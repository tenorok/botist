"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MainScene_1 = require("./MainScene");
const SceneEvents_1 = require("./Events/SceneEvents");
class Scene extends MainScene_1.MainScene {
    constructor(botist, back, next, exit) {
        super(botist);
        this.back = back;
        this.next = next;
        this.exit = exit;
    }
    enter(msg, res, event) {
        super.enter(msg, res, event);
        this.enterTimeoutId = setTimeout(() => {
            this.exit(new SceneEvents_1.ExitTTLEvent());
        }, this.ttl * 60 * 1000);
    }
    leave(msg, res, event) {
        super.leave(msg, res, event);
        if (this.enterTimeoutId) {
            clearTimeout(this.enterTimeoutId);
        }
    }
}
exports.Scene = Scene;
//# sourceMappingURL=Scene.js.map