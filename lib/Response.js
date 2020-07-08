"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Response {
    constructor(botist, adapter, msg) {
        this.botist = botist;
        this.adapter = adapter;
        this.msg = msg;
        this.from = {
            adapter: adapter.name,
            chatId: msg.chatId,
        };
    }
    sendText(text, options) {
        return this.adapter.sendText(this.msg.chatId, text, options);
    }
    sendMarkdown(markdown, options) {
        return this.adapter.sendMarkdown(this.msg.chatId, markdown, options);
    }
    /**
     * Start a scenario.
     */
    scenario(scenario, next) {
        this.botist.scenario(this.from, this, scenario, next);
    }
}
exports.Response = Response;
//# sourceMappingURL=Response.js.map