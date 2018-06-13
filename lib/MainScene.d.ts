import { Botist, IAdapter } from './Botist';
import { IExtendedMessage, ITextMessage, IMessage } from './Message.t';
import Response from './Response';
import { Scenario } from './Scenario';
export declare type MessageCallback<M> = (msg: M, res: Response, next: () => void) => void;
export interface IScene {
    subscribe(): void;
    enter(): void;
    leave(): void;
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
    enter(): void;
    /**
     * Called when scene is deactivating.
     */
    leave(): void;
    text(text: string | RegExp, callback: MessageCallback<ITextMessage & IExtendedMessage>): void;
    onMessage(adapter: IAdapter, msg: IMessage, startHandlerIndex?: number): void;
    protected scenario(scenario: Scenario, next?: () => void): void;
}
