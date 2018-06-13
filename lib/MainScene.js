"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Response_1 = require("./Response");
class MainScene {
    constructor(botist) {
        this.botist = botist;
        this.messageHandlers = {
            text: [],
            image: [],
        };
        this.subscribe();
    }
    /**
     * Called when scene is activating.
     */
    enter() { }
    /**
     * Called when scene is deactivating.
     */
    leave() { }
    text(text, callback) {
        this.messageHandlers.text.push({
            text,
            callback,
        });
    }
    onMessage(adapter, msg, startHandlerIndex = 0) {
        for (let i = startHandlerIndex; i < this.messageHandlers[msg.type].length; i++) {
            const handler = this.messageHandlers[msg.type][i];
            if (msg.type === 'text' && !msg.text.match(handler.text)) {
                continue;
            }
            const res = new Response_1.default(msg.chatId, adapter);
            handler.callback.call(null, msg, res, () => {
                this.onMessage(adapter, msg, i + 1);
            });
            break;
        }
    }
    scenario(scenario, next) {
        this.botist.scenario(scenario, next);
    }
}
exports.MainScene = MainScene;
//# sourceMappingURL=MainScene.js.map