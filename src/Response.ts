import {
    IAdapter,
    IResponse as IBotistResponse,
    IError as IBotistError,
} from './Botist';

export default class Response {
    constructor(private id: string, private adapter: IAdapter) {}

    public sendText(text: string): Promise<IBotistResponse | IBotistError> {
        return this.adapter.sendText(this.id, text);
    }
}
