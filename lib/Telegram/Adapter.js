"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const request = require("request-promise-native");
class Telegram {
    constructor(token, webHookUrl) {
        this.webHookUrl = webHookUrl;
        this.name = Telegram.name;
        this.apiUrl = Telegram.apiHost + '/bot' + token + '/';
        this.setWebHook();
    }
    get webHookPath() {
        return new url_1.URL(this.webHookUrl).pathname;
    }
    onRequest(req, res) {
        const body = req.body;
        res.sendStatus(200);
        if (body.message) {
            if (body.message.text) {
                return [{
                        type: 'text',
                        chatId: String(body.message.chat.id),
                        timestamp: body.message.date,
                        text: body.message.text,
                    }];
            }
        }
        return [];
    }
    sendText(id, text) {
        if (!text) {
            return Promise.resolve({ messageId: '' });
        }
        return request.post({
            url: this.apiUrl + 'sendMessage',
            json: {
                chat_id: id,
                text,
                parse_mode: 'Markdown',
            },
        }).then((res) => {
            return {
                messageId: String(res.result.message_id),
            };
        }).catch((err) => {
            return Promise.reject({
                type: err.name,
                code: err.error.error_code,
                message: err.error.description,
                statusCode: err.statusCode,
            });
        });
    }
    setWebHook() {
        return request.post({
            url: this.apiUrl + 'setWebHook',
            qs: {
                url: this.webHookUrl,
            },
        }).catch((err) => {
            try {
                const error = JSON.parse(err.error);
                console.error(`${Telegram.name}: Failed to set webhook.`, {
                    type: err.name,
                    code: error.error_code,
                    message: error.description,
                    statusCode: err.statusCode,
                });
            }
            catch (errParse) {
                console.error(`${Telegram.name}: Failed to set webhook`, err.error);
            }
        });
    }
}
Telegram.apiHost = 'https://api.telegram.org';
exports.Telegram = Telegram;
//# sourceMappingURL=Adapter.js.map