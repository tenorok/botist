import { URL } from 'url';
import * as API from './API.t';
import { Request, Response } from 'express';
import request = require('request-promise-native');
import {
    IAdapter,
    ITextMessageOptions,
    IResponse as IBotistResponse,
    IError,
    IErrorHandler,
    IPoll,
} from '../Botist';
import {
    IBaseMessage,
    MessageType,
} from '../Message.t';
import SendError from '../Errors/SendError';

interface ISendTextTelegramOptions extends API._.SendMessageOptions {
    chat_id: string;
    text: string;
}

interface ISendPollTelegramOptions {
    chat_id: string;
    question: string;
    options: string[];
    /** @default false */
    allows_multiple_answers?: boolean;
    /** @default true */
    is_anonymous?: boolean;
}

interface ISendTextParams extends ITextMessageOptions {
    id: string;
    text: string;
    parseMode?: 'Markdown';
}

interface IErrorHandlerParams {
    id: string;
    messageType: MessageType;
    err: API.IRequestError;
}

export class Telegram implements IAdapter {
    private static apiHost: string = 'https://api.telegram.org';

    public name: string = Telegram.name;

    private apiUrl: string;
    private _errorHandler?: IErrorHandler;

    constructor(token: string, private webHookUrl: string) {
        this.apiUrl = Telegram.apiHost + '/bot' + token + '/';
        this.setWebHook();
    }

    public get webHookPath(): string {
        return new URL(this.webHookUrl).pathname;
    }

    public set errorHandler(handler: IErrorHandler) {
        this._errorHandler = handler;
    }

    public onRequest(req: Request, res: Response): IBaseMessage[] {
        const update: API.IUpdate = req.body;
        res.sendStatus(200);

        if (update.message) {
            const { message } = update;
            if (message.text) {
                const textMessage: IBaseMessage = {
                    type: MessageType.text,
                    chatId: String(message.chat.id),
                    timestamp: message.date,
                    text: message.text,
                };

                if (message.from && message.from.language_code) {
                    textMessage.language = message.from.language_code;
                }

                return [textMessage];
            }
        }

        if (update.poll_answer) {
            return [{
                type: MessageType.poll,
                chatId: String(update.poll_answer.user.id),
                timestamp: Date.now(),
                pollId: update.poll_answer.poll_id,
                answers: update.poll_answer.option_ids,
            }];
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

    public sendPoll(id: string, poll: IPoll): Promise<IBotistResponse> {
        const json: ISendPollTelegramOptions = {
            chat_id: id,
            question: poll.question,
            options: poll.options,
            allows_multiple_answers: poll.multiple,
            // Need to use only anonymous polls for correct working scenes mechanism.
            is_anonymous: false,
        };

        return request.post({
            url: this.apiUrl + 'sendPoll',
            json,
        }).then((res: API.IResult) => {
            return {
                messageId: String(res.result.message_id),
                pollId: res.result.poll!.id,
            };
        }).catch((err: API.IRequestError) => {
            return this.handleError({
                id,
                messageType: MessageType.poll,
                err,
            });
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
            return this.handleError({
                id: params.id,
                messageType: MessageType.text,
                err,
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

    private handleError(params: IErrorHandlerParams): Promise<IError> {
        const {
            id,
            messageType,
            err,
        } = params;

        // this._errorHandler always set when adapter added.
        return this._errorHandler!(new SendError({
            adapter: Telegram.name,
            chatId: id,
            messageType,
            type: err.name,
            text: err.error.description,
            code: err.error.error_code,
            statusCode: err.statusCode,
        }));
    }
}
