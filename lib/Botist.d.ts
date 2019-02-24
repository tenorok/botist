import express = require('express');
import { IBaseMessage } from './Message.t';
import { IScene } from './MainScene';
import { Scenario } from './Scenario';
import { Response } from './Response';
import SendError from './Errors/SendError';
export interface ISuccess {
    messageId: string;
}
/** Error is null when it was handled by catch callback. */
export declare type IError = null | SendError;
export declare type IResponse = ISuccess | IError;
export interface ITextMessageOptions {
    disableWebPagePreview?: boolean;
}
export interface IAdapter {
    readonly name: string;
    readonly webHookPath: string;
    errorHandler: IErrorHandler;
    onRequest(req: express.Request, res: express.Response): IBaseMessage[];
    sendText(id: string, text: string, options?: ITextMessageOptions): Promise<IResponse>;
    sendMarkdown(id: string, markdown: string, options?: ITextMessageOptions): Promise<IResponse>;
}
export declare type IErrorHandler = (err: SendError) => Promise<IError>;
declare type ICatch = (err: SendError) => void;
export interface IOptions {
    port: number;
    scene: new (botist: Botist) => IScene;
    catch?: ICatch;
}
export interface IFrom {
    name: string;
    chatId: string;
}
export declare class Botist {
    private express;
    private adaptersList;
    private server;
    private _mainScene;
    private currentScene;
    private catch?;
    constructor(options: IOptions);
    destructor(): void;
    adapter(adapter: IAdapter): void;
    getAdapter(name: string): IAdapter | null;
    scenario(from: IFrom, res: Response, scenario: Scenario, next?: () => void): void;
    scene(from: IFrom, res: Response, scene: IScene): void;
    mainScene(from: IFrom, res: Response): void;
    private onError;
    private getSceneKey;
    private getCurrentScene;
}
export {};
