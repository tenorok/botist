import { Botist } from './Botist';
import { MainScene } from './MainScene';
export declare abstract class Scene extends MainScene {
    private _botist;
    protected back: () => void;
    protected next: () => void;
    /**
     * Time to leave scene in minutes.
     * When this time expires, the method `exit()` is called.
     */
    protected abstract ttl: number;
    private enterTimeoutId?;
    constructor(_botist: Botist, back: () => void, next: () => void);
    enter(): void;
    leave(): void;
    /**
     * Called when this scene is deactivating and main scene will be activate.
     */
    protected exit(): void;
}
