import { URL } from 'url';
import * as API from './API.t';
import { Request, Response } from 'express';
import request = require('request-promise-native');
import {
    IAdapter,
    ITextMessageOptions,
    IResponse as IBotistResponse,
} from '../Botist';
import { IBaseMessage } from '../Message.t';

interface ISendTextTelegramOptions extends API._.SendMessageOptions {
    chat_id: string;
    text: string;
}

interface ISendTextParams extends ITextMessageOptions {
    id: string;
    text: string;
    parseMode?: 'Markdown';
}

export class Telegram implements IAdapter {
    private static apiHost: string = 'https://api.telegram.org';

    public name: string = Telegram.name;

    private apiUrl: string;

    constructor(token: string, private webHookUrl: string) {
        this.apiUrl = Telegram.apiHost + '/bot' + token + '/';
        this.setWebHook();
    }

    public get webHookPath(): string {
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

    public sendText(id: string, text: string, options: ITextMessageOptions = {}): Promise<IBotistResponse> {
        return this._sendText({
            id,
            text,
            ...options,
        });
    }

    public sendMarkdown(id: string, markdown: string, options: ITextMessageOptions = {}): Promise<IBotistResponse> {
        return this._sendText({
            id,
            text: markdown,
            parseMode: 'Markdown',
            ...options,
        });
    }

    private _sendText(params: ISendTextParams): Promise<IBotistResponse> {
        if (!params.text) {
            return Promise.resolve({ messageId: '' });
        }

        const json: ISendTextTelegramOptions = {
            chat_id: params.id,
            text: params.text,
        };

        if (params.parseMode !== undefined) {
            json.parse_mode = params.parseMode;
        }

        if (params.disableWebPagePreview !== undefined) {
            json.disable_web_page_preview = params.disableWebPagePreview;
        }

        return request.post({
            url: this.apiUrl + 'sendMessage',
            json,
        }).then((res: API.IResult) => {
            return {
                messageId: String(res.result.message_id),
            };
        }).catch((err: API.IRequestError) => {
            return Promise.reject({
                adapter: Telegram.name,
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
            try {
                const error: API.IError = JSON.parse(err.error);
                console.error(`${Telegram.name}: Failed to set webhook.`, {
                    type: err.name,
                    code: error.error_code,
                    message: error.description,
                    statusCode: err.statusCode,
                });
            } catch (errParse) {
                console.error(`${Telegram.name}: Failed to set webhook`, err.error);
            }
        });
    }
}
