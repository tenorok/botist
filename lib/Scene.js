"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MainScene_1 = require("./MainScene");
class Scene extends MainScene_1.MainScene {
    constructor(_botist, back, next) {
        super(_botist);
        this._botist = _botist;
        this.back = back;
        this.next = next;
    }
    enter() {
        super.enter();
        this.enterTimeoutId = setTimeout(() => {
            this.exit();
        }, this.ttl * 60 * 1000);
    }
    leave() {
        super.leave();
        if (this.enterTimeoutId) {
            clearTimeout(this.enterTimeoutId);
        }
    }
    /**
     * Called when this scene is deactivating and main scene will be activate.
     */
    exit() {
        this._botist.mainScene();
    }
}
exports.Scene = Scene;
//# sourceMappingURL=Scene.js.map