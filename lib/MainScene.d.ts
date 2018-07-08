import { Botist, IAdapter } from './Botist';
import { IExtendedMessage, ITextMessage, IMessage } from './Message.t';
import { Response } from './Response';
export declare type MessageCallback<M> = (msg: M, res: Response, next: () => void) => void;
export interface IScene {
    subscribe(): void;
    enter(res: Response): void;
    leave(res: Response): void;
    text(text: string | RegExp, callback: MessageCallback<ITextMessage & IExtendedMessage>): void;
    onMessage(adapter: IAdapter, msg: IMessage, startHandlerIndex?: number): void;
}
export declare abstract class MainScene implements IScene {
    private botist;
    private messageHandlers;
    constructor(botist: Botist);
    abstract subscribe(): void;
    /**
     * Called when scene is activating.
     */
    enter(_: Response): void;
    /**
     * Called when scene is deactivating.
     */
    leave(_: Response): void;
    text(text: string | RegExp, callback: MessageCallback<ITextMessage & IExtendedMessage>): void;
    onMessage(adapter: IAdapter, msg: IMessage, startHandlerIndex?: number): void;
}
