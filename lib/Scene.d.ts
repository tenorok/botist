import { Botist } from './Botist';
import { MainScene } from './MainScene';
import { Response } from './Response';
import { IMessage } from './Message.t';
import { IEvent } from './Events/Event';
export interface ISceneConstructor {
    new (botist: Botist, back: (event?: IEvent) => void, next: (event?: IEvent) => void, exit: (event?: IEvent) => void): Scene;
}
export declare abstract class Scene extends MainScene {
    protected back: (event?: IEvent) => void;
    protected next: (event?: IEvent) => void;
    protected exit: (event?: IEvent) => void;
    /**
     * Time to leave scene in minutes.
     * When this time expires, the method `exit()` is called.
     */
    protected abstract ttl: number;
    private enterTimeoutId?;
    constructor(botist: Botist, back: (event?: IEvent) => void, next: (event?: IEvent) => void, exit: (event?: IEvent) => void);
    enter(msg: IMessage, res: Response, event: IEvent): void;
    leave(msg: IMessage, res: Response, event: IEvent): void;
}
