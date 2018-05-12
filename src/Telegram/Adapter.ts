import { URL } from 'url';
import * as API from './API.d';
import { Request, Response } from 'express';
import request = require('request-promise-native');
import {
    IAdapter,
    IResponse as IBotistResponse,
    IError as IBotistError,
} from '../Botist';
import { IBaseMessage } from '../Message';

export class Telegram implements IAdapter {
    private static apiHost: string = 'https://api.telegram.org';
    private apiUrl: string;

    constructor(token: string, private webHookUrl: string) {
        this.apiUrl = Telegram.apiHost + '/bot' + token + '/';
        this.setWebHook();
    }

    get webHookPath(): string {
        return new URL(this.webHookUrl).pathname;
    }

    public onRequest(req: Request, res: Response): IBaseMessage[] {
        const body: API._.Update = req.body;
        res.sendStatus(200);

        if (body.message) {
            if (body.message.text) {
                return [{
                    type: 'text',
                    chatId: String(body.message.chat.id),
                    timestamp: body.message.date,
                    text: body.message.text,
                }];
            }
        }

        return [];
    }

    public sendText(id: string, text: string): Promise<IBotistResponse | IBotistError> {
        return request.post({
            url: this.apiUrl + 'sendMessage',
            json: {
                chat_id: id,
                text,
            },
        }).then((res: API.IResult) => {
            return {
                messageId: String(res.result.message_id),
            };
        }).catch((err: API.IRequestError) => {
            return Promise.reject({
                type: err.name,
                code: err.error.error_code,
                message: err.error.description,
                statusCode: err.statusCode,
            });
        });
    }

    private setWebHook() {
        return request.post({
            url: this.apiUrl + 'setWebHook',
            qs: {
                url: this.webHookUrl,
            },
        }).catch((err: API.ISetWebHookRequestError) => {
            const error: API.IError = JSON.parse(err.error);
            console.error(`${Telegram.name}: Failed to set webhook`, {
                type: err.name,
                code: error.error_code,
                message: error.description,
                statusCode: err.statusCode,
            });
        });
    }
}
