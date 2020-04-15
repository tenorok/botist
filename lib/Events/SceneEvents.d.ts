import { IEvent } from './Event';
export declare class StartEvent implements IEvent {
    readonly type: string;
}
export declare class BackEvent implements IEvent {
    readonly type: string;
}
export declare class NextEvent implements IEvent {
    readonly type: string;
}
export declare class ExitEvent implements IEvent {
    readonly type: string;
}
export declare class ExitTTLEvent implements IEvent {
    readonly type: string;
}
