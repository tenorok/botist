"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MainScene_1 = require("./MainScene");
class Scene extends MainScene_1.MainScene {
    constructor(botist, back, next, exit) {
        super(botist);
        this.back = back;
        this.next = next;
        this.exit = exit;
    }
    enter(msg, res) {
        super.enter(msg, res);
        this.enterTimeoutId = setTimeout(() => {
            this.exit();
        }, this.ttl * 60 * 1000);
    }
    leave(msg, res) {
        super.leave(msg, res);
        if (this.enterTimeoutId) {
            clearTimeout(this.enterTimeoutId);
        }
    }
}
exports.Scene = Scene;
//# sourceMappingURL=Scene.js.map