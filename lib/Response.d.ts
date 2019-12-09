import { Botist, IAdapter, IResponse as IBotistResponse, ITextMessageOptions } from './Botist';
import { Scenario } from './Scenario';
import { IMessage } from './Message.t';
export declare class Response {
    private botist;
    private adapter;
    readonly msg: IMessage;
    private from;
    constructor(botist: Botist, adapter: IAdapter, msg: IMessage);
    sendText(text: string, options?: ITextMessageOptions): Promise<IBotistResponse>;
    sendMarkdown(markdown: string, options?: ITextMessageOptions): Promise<IBotistResponse>;
    /**
     * Start a scenario.
     */
    scenario(scenario: Scenario, next?: () => void): void;
}
