import {
    Botist,
    IAdapter,
    IResponse as IBotistResponse,
    IFrom,
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

    public sendText(text: string): Promise<IBotistResponse> {
        return this.adapter.sendText(this.id, text);
    }

    /**
     * Start a scenario.
     */
    public scenario(scenario: Scenario, next?: () => void) {
        this.botist.scenario(this.from, this, scenario, next);
    }
}
