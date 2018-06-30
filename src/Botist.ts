import * as http from 'http';
import express = require('express');
import {
    IBaseMessage,
    IMessage,
} from './Message.t';
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

export class Botist {
    private express: express.Express;
    private adaptersList: IAdapter[] = [];
    private server: http.Server;
    private _mainScene: IScene;
    private currentScene: Map<string, IScene> = new Map();

    constructor(options: IOptions) {
        this.express = express();
        this.express.use(express.json());
        this.server = this.express.listen(options.port);

        this._mainScene = new options.scene(this);
    }

    public destructor() {
        this.server.close();
    }

    public adapter(adapter: IAdapter): void {
        this.adaptersList.push(adapter);
        this.express.post(adapter.webHookPath, (req, res) => {
            const messages = adapter.onRequest(req, res);
            for (const baseMsg of messages) {
                const msg: IMessage = baseMsg as IMessage;
                msg.name = adapter.constructor.name;
                this.getCurrentScene(msg).onMessage(adapter, msg);
            }
        });
    }

    public getAdapter(name: string): IAdapter | null {
        for (const adapter of this.adaptersList) {
            if (adapter.name === name) {
                return adapter;
            }
        }

        return null;
    }

    public scenario(from: IFrom, res: Response, scenario: Scenario, next?: () => void) {
        scenario.enter(this, from, res, this.getCurrentScene(from), next);
    }

    public scene(from: IFrom, res: Response, scene: IScene) {
        this.getCurrentScene(from).leave(res);
        scene.enter(res);
        this.currentScene.set(this.getSceneKey(from), scene);
    }

    public mainScene(from: IFrom, res: Response) {
        this.scene(from, res, this._mainScene);
    }

    private getSceneKey(from: IFrom): string {
        return from.name + from.chatId;
    }

    private getCurrentScene(from: IFrom): IScene {
        const key = this.getSceneKey(from);
        const currentScene = this.currentScene.get(key);
        if (currentScene) {
            return currentScene;
        }

        this.currentScene.set(key, this._mainScene);
        return this._mainScene;
    }
}
