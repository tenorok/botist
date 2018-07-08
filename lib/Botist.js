"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
class Botist {
    constructor(options) {
        this.adaptersList = [];
        this.currentScene = new Map();
        this.express = express();
        this.express.use(express.json());
        this.server = this.express.listen(options.port);
        this._mainScene = new options.scene(this);
    }
    destructor() {
        this.server.close();
    }
    adapter(adapter) {
        this.adaptersList.push(adapter);
        this.express.post(adapter.webHookPath, (req, res) => {
            const messages = adapter.onRequest(req, res);
            for (const baseMsg of messages) {
                const msg = baseMsg;
                msg.name = adapter.constructor.name;
                this.getCurrentScene(msg).onMessage(adapter, msg);
            }
        });
    }
    getAdapter(name) {
        for (const adapter of this.adaptersList) {
            if (adapter.name === name) {
                return adapter;
            }
        }
        return null;
    }
    scenario(from, res, scenario, next) {
        scenario.enter(this, from, res, this.getCurrentScene(from), next);
    }
    scene(from, res, scene) {
        this.getCurrentScene(from).leave(res);
        scene.enter(res);
        this.currentScene.set(this.getSceneKey(from), scene);
    }
    mainScene(from, res) {
        this.scene(from, res, this._mainScene);
    }
    getSceneKey(from) {
        return from.name + from.chatId;
    }
    getCurrentScene(from) {
        const key = this.getSceneKey(from);
        const currentScene = this.currentScene.get(key);
        if (currentScene) {
            return currentScene;
        }
        this.currentScene.set(key, this._mainScene);
        return this._mainScene;
    }
}
exports.Botist = Botist;
//# sourceMappingURL=Botist.js.map