import { IAdapter, IResponse as IBotistResponse, IError as IBotistError } from './Botist';
export default class Response {
    private id;
    private adapter;
    constructor(id: string, adapter: IAdapter);
    sendText(text: string): Promise<IBotistResponse | IBotistError>;
}
