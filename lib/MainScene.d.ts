import { IMessage } from './Message.t';
import { Response } from './Response';
import { MessageMiddleware, IMessageMiddleware, ISubscribers } from './Middlewares/Message';
import { IEvent } from './Events/Event';
export interface IScene extends IMessageMiddleware {
    subscribers: ISubscribers;
    enter(msg: IMessage, res: Response, event: IEvent): void;
    leave(msg: IMessage, res: Response, event: IEvent): void;
}
export declare abstract class MainScene extends MessageMiddleware implements IScene {
    get subscribers(): ISubscribers;
    /**
     * Called when scene is activating.
     */
    enter(_msg: IMessage, _res: Response, _event: IEvent): void;
    /**
     * Called when scene is deactivating.
     */
    leave(_msg: IMessage, _res: Response, _event: IEvent): void;
}
