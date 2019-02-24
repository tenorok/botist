import { Botist, IAdapter, IResponse as IBotistResponse, ITextMessageOptions } from './Botist';
import { Scenario } from './Scenario';
export declare class Response {
    private botist;
    private id;
    private adapter;
    private from;
    constructor(botist: Botist, id: string, adapter: IAdapter);
    sendText(text: string, options?: ITextMessageOptions): Promise<IBotistResponse>;
    sendMarkdown(markdown: string, options?: ITextMessageOptions): Promise<IBotistResponse>;
    /**
     * Start a scenario.
     */
    scenario(scenario: Scenario, next?: () => void): void;
}
