import {
    Botist,
    IAdapter,
    IResponse as IBotistResponse,
    IFrom,
    ITextMessageOptions,
} from './Botist';
import { Scenario } from './Scenario';
import { IMessage } from './Message.t';

export class Response {
    private from: IFrom;

    constructor(
        private botist: Botist,
        private adapter: IAdapter,
        public readonly msg: IMessage,
    ) {
        this.from = {
            adapter: adapter.name,
            chatId: msg.chatId,
        };
    }

    public sendText(text: string, options?: ITextMessageOptions): Promise<IBotistResponse> {
        return this.adapter.sendText(this.msg.chatId, text, options);
    }

    public sendMarkdown(markdown: string, options?: ITextMessageOptions): Promise<IBotistResponse> {
        return this.adapter.sendMarkdown(this.msg.chatId, markdown, options);
    }

    /**
     * Start a scenario.
     */
    public scenario(scenario: Scenario, next?: () => void) {
        this.botist.scenario(this.from, this, scenario, next);
    }
}
