interface ISendError {
    adapter: string;
    type: string;
    code: number;
    text: string;
    statusCode: number;
}
export default class SendError extends Error implements ISendError {
    adapter: string;
    type: string;
    code: number;
    text: string;
    statusCode: number;
    constructor(err: ISendError);
}
export {};
