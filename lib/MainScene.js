"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("./Middlewares/Message");
class MainScene extends Message_1.MessageMiddleware {
    get subscribers() {
        return this._subscribers;
    }
    /**
     * Called when scene is activating.
     */
    enter(_msg, _res, _event) { }
    /**
     * Called when scene is deactivating.
     */
    leave(_msg, _res, _event) { }
}
exports.MainScene = MainScene;
//# sourceMappingURL=MainScene.js.map