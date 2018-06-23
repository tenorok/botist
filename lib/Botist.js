"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
class Botist {
    constructor(options) {
        this.adaptersList = [];
        this.express = express();
        this.express.use(express.json());
        this.server = this.express.listen(options.port);
        this._mainScene = new options.scene(this);
        this._mainScene.enter();
        this.currentScene = this._mainScene;
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
                this.currentScene.onMessage(adapter, msg);
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
    scenario(scenario, next) {
        scenario.enter(this, this.currentScene, next);
    }
    scene(scene) {
        this.currentScene.leave();
        scene.enter();
        this.currentScene = scene;
    }
    mainScene() {
        this.scene(this._mainScene);
    }
}
exports.Botist = Botist;
//# sourceMappingURL=Botist.js.map