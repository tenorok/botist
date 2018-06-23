/// <reference types="express" />
import { Request, Response } from 'express';
import { IAdapter, IResponse as IBotistResponse, IError as IBotistError } from '../Botist';
import { IBaseMessage } from '../Message.t';
export declare class Messenger implements IAdapter {
    private token;
    webHookPath: string;
    private static apiUrl;
    name: string;
    constructor(token: string, webHookPath: string);
    onRequest(req: Request, res: Response): IBaseMessage[];
    sendText(id: string, text: string): Promise<IBotistResponse | IBotistError>;
    private hasMessageText(message);
}
