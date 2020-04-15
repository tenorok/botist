import { Botist } from './Botist';
import { MainScene } from './MainScene';
import { Response } from './Response';
import { IMessage } from './Message.t';
import { IEvent } from './Events/Event';
import { ExitTTLEvent } from './Events/SceneEvents';

export interface ISceneConstructor {
    new (
        botist: Botist,
        back: (event?: IEvent) => void,
        next: (event?: IEvent) => void,
        exit: (event?: IEvent) => void,
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
        protected back: (event?: IEvent) => void,
        protected next: (event?: IEvent) => void,
        protected exit: (event?: IEvent) => void,
    ) {
        super(botist);
    }

    public enter(msg: IMessage, res: Response, event: IEvent) {
        super.enter(msg, res, event);

        this.enterTimeoutId = setTimeout(() => {
            this.exit(new ExitTTLEvent());
        }, this.ttl * 60 * 1000);
    }

    public leave(msg: IMessage, res: Response, event: IEvent) {
        super.leave(msg, res, event);

        if (this.enterTimeoutId) {
            clearTimeout(this.enterTimeoutId);
        }
    }
}
