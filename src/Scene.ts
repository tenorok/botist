import { Botist } from './Botist';
import { MainScene } from './MainScene';
import { Response } from './Response';
import { IMessage } from './Message.t';

export interface ISceneConstructor {
    new (
        botist: Botist,
        back: () => void,
        next: () => void,
        exit: () => void,
    ): Scene;
}

export abstract class Scene extends MainScene {
    /**
     * Time to leave scene in minutes.
     * When this time expires, the method `exit()` is called.
     */
    protected abstract ttl: number;
    private enterTimeoutId?: NodeJS.Timer;

    constructor(
        botist: Botist,
        protected back: () => void,
        protected next: () => void,
        protected exit: () => void,
    ) {
        super(botist);
    }

    public enter(msg: IMessage, res: Response) {
        super.enter(msg, res);

        this.enterTimeoutId = setTimeout(() => {
            this.exit();
        }, this.ttl * 60 * 1000);
    }

    public leave(msg: IMessage, res: Response) {
        super.leave(msg, res);

        if (this.enterTimeoutId) {
            clearTimeout(this.enterTimeoutId);
        }
    }
}
