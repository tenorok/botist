interface ISendError {
    adapter: string;
    type: string;
    code: number;
    text: string;
    statusCode: number;
}

export default class SendError extends Error implements ISendError {
    public adapter: string;
    public type: string;
    public code: number;
    public text: string;
    public statusCode: number;

    constructor(err: ISendError) {
        super(`${err.adapter} with ${err.type} ${err.statusCode}. ${err.text}`);

        this.adapter = err.adapter;
        this.type = err.type;
        this.code = err.code;
        this.text = err.text;
        this.statusCode = err.statusCode;
    }
}
