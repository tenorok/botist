import * as http from 'http';
import express = require('express');

import createDebug = require('debug');
const debugAdapter = createDebug('botist:adapter');

import {
    IBaseMessage,
    IMessage,
} from './Message.t';
import { IScene } from './MainScene';
import { Scenario } from './Scenario';
import { Response } from './Response';

export interface ISuccess {
    messageId: string;
}

export interface IError {
    adapter: string;
    type: string;
    code: number;
    message: string;
    statusCode: number;
}

export type IResponse = ISuccess | IError;

export interface ITextMessageOptions {
    disableWebPagePreview?: boolean;
}

export interface IAdapter {
    readonly name: string;
    readonly webHookPath: string;
    onRequest(req: express.Request, res: express.Response): IBaseMessage[];
    sendText(id: string, text: string, options?: ITextMessageOptions): Promise<IResponse>;
    sendMarkdown(id: string, markdown: string, options?: ITextMessageOptions): Promise<IResponse>;
}

export interface IOptions {
    port: number;
    scene: new (botist: Botist) => IScene;
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
        debugAdapter('new %s with webhook %s', adapter.name, adapter.webHookPath);
        this.adaptersList.push(adapter);

        this.express.post(adapter.webHookPath, (req, res) => {
            const messages = adapter.onRequest(req, res);
            debugAdapter('%s requested %O', adapter.name, messages);
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
