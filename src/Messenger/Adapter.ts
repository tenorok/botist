import * as API from './API.d';
import { Request, Response } from 'express';
import request = require('request-promise-native');
import {
    IAdapter,
    IBaseMessage as IBotistMessage,
    IResponse as IBotistResponse,
    IError as IBotistError,
} from '../Botist';

export class Messenger implements IAdapter {
    private static apiUrl: string = 'https://graph.facebook.com/v3.0/me/messages';

    constructor(private token: string, public webHookPath: string) {}

    public onRequest(req: Request, res: Response): IBotistMessage[] {
        const body: API.IUpdate = req.body;
        res.sendStatus(200);

        const messages: IBotistMessage[] = [];
        for (const record of body.entry) {
            for (const message of record.messaging) {
                if (this.hasMessageText(message)) {
                    messages.push({
                        type: 'text',
                        chatId: message.sender.id,
                        timestamp: message.timestamp,
                        text: message.message.text,
                    });
                }
            }
        }

        return messages;
    }

    public sendText(id: string, text: string): Promise<IBotistResponse | IBotistError> {
        return request.post({
            url: Messenger.apiUrl,
            qs: { access_token: this.token },
            json: {
                messaging_type: 'RESPONSE',
                recipient: {
                    id,
                },
                message: {
                    text,
                },
            },
        }).then((res: API.IResult) => {
            return {
                messageId: res.message_id,
            };
        }).catch((err: API.IRequestError) => {
            return Promise.reject({
                type: err.error.error.type,
                code: err.error.error.code,
                message: err.error.error.message,
                statusCode: err.statusCode,
            });
        });
    }

    private hasMessageText(message: any): message is API.TextMessage | API.ScrapingLinkMessage {
        return typeof message.message.text !== undefined;
    }
}
