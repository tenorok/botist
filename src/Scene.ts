import { Botist } from './Botist';
import { MainScene } from './MainScene';

export abstract class Scene extends MainScene {
    /**
     * Time to leave scene in minutes.
     * When this time expires, the method `exit()` is called.
     */
    protected abstract ttl: number;
    private enterTimeoutId?: NodeJS.Timer;

    constructor(
        private _botist: Botist,
        protected back: () => void,
        protected next: () => void,
    ) {
        super(_botist);
    }

    public enter() {
        super.enter();

        this.enterTimeoutId = setTimeout(() => {
            this.exit();
        }, this.ttl * 60 * 1000);
    }

    public exit() {
        super.exit();

        if (this.enterTimeoutId) {
            clearTimeout(this.enterTimeoutId);
        }
        this._botist.enterMainScene();
    }
}
