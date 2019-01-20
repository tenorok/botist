import { Request, Response } from 'express';
import { IAdapter, IResponse as IBotistResponse } from '../Botist';
import { IBaseMessage } from '../Message.t';
export declare class Telegram implements IAdapter {
    private webHookUrl;
    private static apiHost;
    name: string;
    private apiUrl;
    constructor(token: string, webHookUrl: string);
    readonly webHookPath: string;
    onRequest(req: Request, res: Response): IBaseMessage[];
    sendText(id: string, text: string): Promise<IBotistResponse>;
    private setWebHook;
}
