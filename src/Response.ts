import {
    Botist,
    IAdapter,
    IResponse as IBotistResponse,
    IFrom,
    ITextMessageOptions,
} from './Botist';
import { Scenario } from './Scenario';

export class Response {
    private from: IFrom;

    constructor(
        private botist: Botist,
        private id: string,
        private adapter: IAdapter,
    ) {
        this.from = {
            name: adapter.name,
            chatId: id,
        };
    }

    public sendText(text: string, options?: ITextMessageOptions): Promise<IBotistResponse> {
        return this.adapter.sendText(this.id, text, options);
    }

    public sendMarkdown(markdown: string, options?: ITextMessageOptions): Promise<IBotistResponse> {
        return this.adapter.sendMarkdown(this.id, markdown, options);
    }

    /**
     * Start a scenario.
     */
    public scenario(scenario: Scenario, next?: () => void) {
        this.botist.scenario(this.from, this, scenario, next);
    }
}
