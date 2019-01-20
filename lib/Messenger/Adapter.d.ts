import { Request, Response } from 'express';
import { IAdapter, IResponse as IBotistResponse } from '../Botist';
import { IBaseMessage } from '../Message.t';
export declare class Messenger implements IAdapter {
    private token;
    webHookPath: string;
    private static apiUrl;
    name: string;
    constructor(token: string, webHookPath: string);
    onRequest(req: Request, res: Response): IBaseMessage[];
    sendText(id: string, text: string): Promise<IBotistResponse>;
    private hasMessageText;
}
