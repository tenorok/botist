import { IMessage } from './Message.t';
import { Response } from './Response';
import { MessageMiddleware, IMessageMiddleware, ISubscribers } from './Middlewares/Message';
import { IEvent } from './Events/Event';

export interface IScene extends IMessageMiddleware {
    subscribers: ISubscribers;
    enter(msg: IMessage, res: Response, event: IEvent): void;
    leave(msg: IMessage, res: Response, event: IEvent): void;
}

export abstract class MainScene extends MessageMiddleware implements IScene {
    public get subscribers(): ISubscribers {
        return this._subscribers;
    }

    /**
     * Called when scene is activating.
     */
    public enter(_msg: IMessage, _res: Response, _event: IEvent) {}

    /**
     * Called when scene is deactivating.
     */
    public leave(_msg: IMessage, _res: Response, _event: IEvent) {}
}
