import { IEvent } from './Event';
export declare class StartEvent implements IEvent {
    readonly type = "start";
}
export declare class BackEvent implements IEvent {
    readonly type = "back";
}
export declare class NextEvent implements IEvent {
    readonly type = "next";
}
export declare class ExitEvent implements IEvent {
    readonly type = "exit";
}
export declare class ExitTTLEvent implements IEvent {
    readonly type = "exit-ttl";
}
