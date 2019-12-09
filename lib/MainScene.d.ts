import { Botist, IAdapter } from './Botist';
import { ITextMessage, IMessage } from './Message.t';
import { Response } from './Response';
export declare type MessageCallback<M> = (msg: M, res: Response, next: () => void) => void;
export interface IScene {
    subscribe(): void;
    enter(msg: IMessage, res: Response): void;
    leave(msg: IMessage, res: Response): void;
    text(text: string | RegExp, callback: MessageCallback<ITextMessage>): void;
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
    enter(_msg: IMessage, _res: Response): void;
    /**
     * Called when scene is deactivating.
     */
    leave(_msg: IMessage, _res: Response): void;
    text(text: string | RegExp, callback: MessageCallback<ITextMessage>): void;
    onMessage(adapter: IAdapter, msg: IMessage, startHandlerIndex?: number): void;
}
