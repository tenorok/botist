import { Botist } from './Botist';
import { MainScene } from './MainScene';
import { Response } from './Response';
export interface ISceneConstructor {
    new (botist: Botist, back: () => void, next: () => void, exit: () => void): Scene;
}
export declare abstract class Scene extends MainScene {
    protected back: () => void;
    protected next: () => void;
    protected exit: () => void;
    /**
     * Time to leave scene in minutes.
     * When this time expires, the method `exit()` is called.
     */
    protected abstract ttl: number;
    private enterTimeoutId?;
    constructor(botist: Botist, back: () => void, next: () => void, exit: () => void);
    enter(res: Response): void;
    leave(res: Response): void;
}
