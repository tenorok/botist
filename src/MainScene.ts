import { Botist, IAdapter } from './Botist';
import {
    ITextMessage,
    IImageMessage,
    IMessage,
} from './Message.t';
import { Response } from './Response';

interface IMessageHandlers {
    text: ITextMessageHandler[];
    image: IImageMessageHandler[];
}

export type MessageCallback<M> = (msg: M, res: Response, next: () => void) => void;

interface ITextMessageHandler {
    text: string | RegExp;
    callback: MessageCallback<ITextMessage>;
}

interface IImageMessageHandler {
    callback: MessageCallback<IImageMessage>;
}

export interface IScene {
    subscribe(): void;
    enter(msg: IMessage, res: Response): void;
    leave(msg: IMessage, res: Response): void;
    text(text: string | RegExp, callback: MessageCallback<ITextMessage>): void;
    onMessage(adapter: IAdapter, msg: IMessage, startHandlerIndex?: number): void;
}

export abstract class MainScene implements IScene {
    private messageHandlers: IMessageHandlers = {
        text: [],
        image: [],
    };

    constructor(private botist: Botist) {
        this.subscribe();
    }

    public abstract subscribe(): void;

    /**
     * Called when scene is activating.
     */
    public enter(_msg: IMessage, _res: Response) {}

    /**
     * Called when scene is deactivating.
     */
    public leave(_msg: IMessage, _res: Response) {}

    public text(text: string | RegExp, callback: MessageCallback<ITextMessage>): void {
        this.messageHandlers.text.push({
            text,
            callback,
        });
    }

    public onMessage(adapter: IAdapter, msg: IMessage, startHandlerIndex: number = 0): void {
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
            handler.callback.call(null, msg, res, () => {
                this.onMessage(adapter, msg, i + 1);
            });
            break;
        }
    }
}
