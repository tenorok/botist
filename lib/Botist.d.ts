import express = require('express');
import { IBaseMessage } from './Message.t';
import { IScene } from './MainScene';
import { Scenario } from './Scenario';
import { Response } from './Response';
export interface IAdapter {
    readonly name: string;
    readonly webHookPath: string;
    onRequest(req: express.Request, res: express.Response): IBaseMessage[];
    sendText(id: string, text: string): Promise<IResponse | IError>;
}
export interface IOptions {
    port: number;
    scene: new (botist: Botist) => IScene;
}
export interface IResponse {
    messageId: string;
}
export interface IError {
    type: string;
    code: number;
    message: string;
    statusCode: number;
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
    constructor(options: IOptions);
    destructor(): void;
    adapter(adapter: IAdapter): void;
    getAdapter(name: string): IAdapter | null;
    scenario(from: IFrom, res: Response, scenario: Scenario, next?: () => void): void;
    scene(from: IFrom, res: Response, scene: IScene): void;
    mainScene(from: IFrom, res: Response): void;
    private getSceneKey;
    private getCurrentScene;
}
