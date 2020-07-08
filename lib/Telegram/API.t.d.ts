export import _ = require('node-telegram-bot-api');
export interface IResult {
    ok: true;
    result: _.Message;
}
export interface IError {
    ok: false;
    /** https://core.telegram.org/method/messages.sendMessage#possible-errors */
    error_code: number;
    description: string;
}
export interface IRequestError extends requestPromise.IError {
    error: IError;
}
export interface ISetWebHookRequestError extends requestPromise.IError {
    error: string;
}
