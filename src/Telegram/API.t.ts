export import _ = require('node-telegram-bot-api');

interface IPoll {
    id: string;
    question: string;
    options: IPollOption[];
    total_voter_count: number;
    is_closed: boolean;
    is_anonymous: boolean;
    type: string;
    allows_multiple_answers: boolean;
}

interface IPollOption {
    text: string;
    voter_count: number;
}

interface IMessageResult extends _.Message {
    /** Exists when used sendPoll(). */
    poll?: IPoll;
}

export interface IResult {
    ok: true;
    result: IMessageResult;
}

interface IPollAnswer {
    poll_id: string;
    user: _.User;
    option_ids: number[];
}

export interface IUpdate extends _.Update {
    poll_answer?: IPollAnswer;
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
    error: string; // JSON string of Error.
}
