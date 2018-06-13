"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request-promise-native");
class Messenger {
    constructor(token, webHookPath) {
        this.token = token;
        this.webHookPath = webHookPath;
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
        return request.post({
            url: Messenger.apiUrl,
            qs: { access_token: this.token },
            json: {
                messaging_type: 'RESPONSE',
                recipient: {
                    id,
                },
                message: {
                    text,
                },
            },
        }).then((res) => {
            return {
                messageId: res.message_id,
            };
        }).catch((err) => {
            return Promise.reject({
                type: err.error.error.type,
                code: err.error.error.code,
                message: err.error.error.message,
                statusCode: err.statusCode,
            });
        });
    }
    hasMessageText(message) {
        return typeof message.message.text !== undefined;
    }
}
Messenger.apiUrl = 'https://graph.facebook.com/v3.0/me/messages';
exports.Messenger = Messenger;
//# sourceMappingURL=Adapter.js.map