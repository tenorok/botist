"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request-promise-native");
const SendError_1 = require("../Errors/SendError");
class Messenger {
    constructor(token, webHookPath) {
        this.token = token;
        this.webHookPath = webHookPath;
        this.name = Messenger.name;
    }
    set errorHandler(handler) {
        this._errorHandler = handler;
    }
    onRequest(req, res) {
        const body = req.body;
        res.sendStatus(200);
        const messages = [];
        for (const record of body.entry) {
            for (const message of record.messaging) {
                if (this.hasMessageText(message)) {
                    messages.push({
                        type: 'text',
                        chatId: message.sender.id,
                        timestamp: message.timestamp,
                        text: message.message.text,
                    });
                }
            }
        }
        return messages;
    }
    sendText(id, text) {
        return this._sendText({
            id,
            text,
        });
    }
    /**
     * Messenger doesn't support markdown.
     * https://docs.botframework.com/en-us/channel-inspector/channels/Facebook/#navtitle
     */
    sendMarkdown(id, markdown) {
        return this._sendText({
            id,
            text: markdown,
        });
    }
    _sendText(params) {
        if (!params.text) {
            return Promise.resolve({ messageId: '' });
        }
        return request.post({
            url: Messenger.apiUrl,
            qs: { access_token: this.token },
            json: {
                messaging_type: 'RESPONSE',
                recipient: {
                    id: params.id,
                },
                message: {
                    text: params.text,
                },
            },
        }).then((res) => {
            return {
                messageId: res.message_id,
            };
        }).catch((err) => {
            // this._errorHandler always set when adapter added.
            return this._errorHandler(new SendError_1.default({
                adapter: Messenger.name,
                type: err.error.error.type,
                code: err.error.error.code,
                text: err.error.error.message,
                statusCode: err.statusCode,
            }));
        });
    }
    hasMessageText(message) {
        return typeof message.message.text !== undefined;
    }
}
exports.Messenger = Messenger;
Messenger.apiUrl = 'https://graph.facebook.com/v3.0/me/messages';
//# sourceMappingURL=Adapter.js.map