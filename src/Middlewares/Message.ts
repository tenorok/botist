import { Botist, IAdapter } from '../Botist';
import { Response } from '../Response';
import {
    ITextMessage,
    IImageMessage,
    IMessage,
} from '../Message.t';
import { IScene } from '../MainScene';

export type MessageCallback<M> = (msg: M, res: Response, next: () => void) => void;

interface ITextMessageHandler {
    text: string | RegExp;
    callback: MessageCallback<ITextMessage>;
}

interface IImageMessageHandler {
    callback: MessageCallback<IImageMessage>;
}

interface IMessageHandlers {
    text: ITextMessageHandler[];
    image: IImageMessageHandler[];
}

export interface IMessageMiddleware {
    subscribe(): void;
    text(text: string | RegExp, callback: MessageCallback<ITextMessage>): void | Promise<void>;
    guard(scene: IScene, msg: IMessage): boolean;
    continue(): boolean;
    onMessage(adapter: IAdapter, msg: IMessage, startHandlerIndex?: number): Promise<void>;
}

export abstract class MessageMiddleware implements IMessageMiddleware {
    private messageHandlers: IMessageHandlers = {
        text: [],
        image: [],
    };

    constructor(private botist: Botist) {
        this.subscribe();
    }

    public abstract subscribe(): void;

    public text(text: string | RegExp, callback: MessageCallback<ITextMessage>): void {
        this.messageHandlers.text.push({
            text,
            callback,
        });
    }

    /**
     * Determines the need to applying middleware for scene and message.
     */
    public guard(_scene: IScene, _msg: IMessage) {
        return true;
    }

    /**
     * Determines the need to call the handlers of the next middleware.
     */
    public continue() {
        return true;
    }

    public async onMessage(adapter: IAdapter, msg: IMessage, startHandlerIndex: number = 0): Promise<void> {
        for (let i = startHandlerIndex; i < this.messageHandlers[msg.type].length; i++) {
            const handler = this.messageHandlers[msg.type][i];
            if (msg.type === 'text') {
                const handlerText = (handler as ITextMessageHandler).text;
                if (
                    typeof handlerText === 'string' && msg.text !== handlerText ||
                    handlerText instanceof RegExp && !msg.text.match(handlerText)
                ) {
                    continue;
                }
            }

            const res = new Response(this.botist, adapter, msg);
            return handler.callback.call(null, msg, res, () => {
                return this.onMessage(adapter, msg, i + 1);
            });
        }
    }
}
