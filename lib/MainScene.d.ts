import { Botist, IAdapter } from './Botist';
import { ITextMessage, IMessage } from './Message.t';
import { Response } from './Response';
import { IEvent } from './Events/Event';
export declare type MessageCallback<M> = (msg: M, res: Response, next: () => void) => void;
export interface IScene {
    subscribe(): void;
    enter(msg: IMessage, res: Response, event: IEvent): void;
    leave(msg: IMessage, res: Response, event: IEvent): void;
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
    enter(_msg: IMessage, _res: Response, _event: IEvent): void;
    /**
     * Called when scene is deactivating.
     */
    leave(_msg: IMessage, _res: Response, _event: IEvent): void;
    text(text: string | RegExp, callback: MessageCallback<ITextMessage>): void;
    onMessage(adapter: IAdapter, msg: IMessage, startHandlerIndex?: number): void;
}
