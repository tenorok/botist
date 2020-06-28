import * as API from './API.t';
import { Request, Response } from 'express';
import request = require('request-promise-native');
import {
    IAdapter,
    IResponse as IBotistResponse,
    IErrorHandler,
} from '../Botist';
import {
    IBaseMessage,
    MessageType,
} from '../Message.t';
import SendError from '../Errors/SendError';

interface ISendTextParams {
    id: string;
    text: string;
}

export class Messenger implements IAdapter {
    private static apiUrl: string = 'https://graph.facebook.com/v3.0/me/messages';

    public name: string = Messenger.name;

    private _errorHandler?: IErrorHandler;

    constructor(private token: string, public webHookPath: string) {}

    public set errorHandler(handler: IErrorHandler) {
        this._errorHandler = handler;
    }

    public onRequest(req: Request, res: Response): IBaseMessage[] {
        const body: API.IUpdate = req.body;
        res.sendStatus(200);

        const messages: IBaseMessage[] = [];
        for (const record of body.entry) {
            for (const message of record.messaging) {
                if (this.hasMessageText(message)) {
                    messages.push({
                        type: MessageType.text,
                        chatId: message.sender.id,
                        timestamp: message.timestamp,
                        text: message.message.text,
                    });
                }
            }
        }

        return messages;
    }

    public sendText(id: string, text: string): Promise<IBotistResponse> {
        return this._sendText({
            id,
            text,
        });
    }

    /**
     * Messenger doesn't support markdown.
     * https://docs.botframework.com/en-us/channel-inspector/channels/Facebook/#navtitle
     */
    public sendMarkdown(id: string, markdown: string): Promise<IBotistResponse> {
        return this._sendText({
            id,
            text: markdown,
        });
    }

    private _sendText(params: ISendTextParams): Promise<IBotistResponse> {
        if (!params.text) {
            return Promise.resolve({ messageId: '' });
        }

        return request.post({
            url: Messenger.apiUrl,
            qs: { access_token: this.token },
            json: {
                messaging_type: 'RESPONSE',
                recipient: {
                    id: params.id,
                },
                message: {
                    text: params.text,
                },
            },
        }).then((res: API.IResult) => {
            return {
                messageId: res.message_id,
            };
        }).catch((err: API.IRequestError) => {
            // this._errorHandler always set when adapter added.
            return this._errorHandler!(new SendError({
                adapter: Messenger.name,
                chatId: params.id,
                messageType: MessageType.text,
                type: err.error.error.type,
                text: err.error.error.message,
                code: err.error.error.code,
                statusCode: err.statusCode,
            }));
        });
    }

    private hasMessageText(message: any): message is API.ITextMessage | API.IScrapingLinkMessage {
        return typeof message.message.text !== undefined;
    }
}
