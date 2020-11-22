"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const request = require("request-promise-native");
const Message_t_1 = require("../Message.t");
const SendError_1 = require("../Errors/SendError");
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
    set errorHandler(handler) {
        this._errorHandler = handler;
    }
    onRequest(req, res) {
        const update = req.body;
        res.sendStatus(200);
        if (update.message) {
            const { message } = update;
            if (message.text) {
                const textMessage = {
                    type: Message_t_1.MessageType.text,
                    chatId: String(message.chat.id),
                    timestamp: message.date,
                    text: message.text,
                };
                if (message.from && message.from.language_code) {
                    textMessage.language = message.from.language_code;
                }
                return [textMessage];
            }
        }
        if (update.poll_answer) {
            return [{
                    type: Message_t_1.MessageType.poll,
                    chatId: String(update.poll_answer.user.id),
                    timestamp: Date.now(),
                    pollId: update.poll_answer.poll_id,
                    answers: update.poll_answer.option_ids,
                }];
        }
        return [];
    }
    sendText(id, text, options = {}) {
        return this._sendText({
            id,
            text,
            ...options,
        });
    }
    sendMarkdown(id, markdown, options = {}) {
        return this._sendText({
            id,
            text: markdown,
            parseMode: 'Markdown',
            ...options,
        });
    }
    sendPoll(id, poll) {
        const json = {
            chat_id: id,
            question: poll.question,
            options: poll.options,
            allows_multiple_answers: poll.multiple,
            // Need to use only anonymous polls for correct working scenes mechanism.
            is_anonymous: false,
        };
        return request.post({
            url: this.apiUrl + 'sendPoll',
            json,
        }).then((res) => {
            return {
                messageId: String(res.result.message_id),
                pollId: res.result.poll.id,
            };
        }).catch((err) => {
            return this.handleError({
                id,
                messageType: Message_t_1.MessageType.poll,
                err,
            });
        });
    }
    _sendText(params) {
        if (!params.text) {
            return Promise.resolve({ messageId: '' });
        }
        const json = {
            chat_id: params.id,
            text: params.text,
        };
        if (params.parseMode !== undefined) {
            json.parse_mode = params.parseMode;
        }
        if (params.disableWebPagePreview !== undefined) {
            json.disable_web_page_preview = params.disableWebPagePreview;
        }
        return request.post({
            url: this.apiUrl + 'sendMessage',
            json,
        }).then((res) => {
            return {
                messageId: String(res.result.message_id),
            };
        }).catch((err) => {
            return this.handleError({
                id: params.id,
                messageType: Message_t_1.MessageType.text,
                err,
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
    handleError(params) {
        const { id, messageType, err, } = params;
        // this._errorHandler always set when adapter added.
        return this._errorHandler(new SendError_1.default({
            adapter: Telegram.name,
            chatId: id,
            messageType,
            type: err.name,
            text: err.error.description,
            code: err.error.error_code,
            statusCode: err.statusCode,
        }));
    }
}
exports.Telegram = Telegram;
Telegram.apiHost = 'https://api.telegram.org';
//# sourceMappingURL=Adapter.js.map