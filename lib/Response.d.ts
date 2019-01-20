import { Botist, IAdapter, IResponse as IBotistResponse } from './Botist';
import { Scenario } from './Scenario';
export declare class Response {
    private botist;
    private id;
    private adapter;
    private from;
    constructor(botist: Botist, id: string, adapter: IAdapter);
    sendText(text: string): Promise<IBotistResponse>;
    /**
     * Start a scenario.
     */
    scenario(scenario: Scenario, next?: () => void): void;
}
