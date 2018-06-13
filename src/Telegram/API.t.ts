export import _ = require('node-telegram-bot-api');

export interface IResult {
    ok: true;
    result: _.Message;
}

export interface IError {
    ok: false;
    error_code: 404;
    description: string;
}

export interface IRequestError extends requestPromise.IError {
    error: IError;
}

export interface ISetWebHookRequestError extends requestPromise.IError {
    error: string; // JSON string of Error.
}
