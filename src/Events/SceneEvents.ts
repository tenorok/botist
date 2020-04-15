import { IEvent } from './Event';

export class StartEvent implements IEvent {
    public readonly type = 'start';
}

export class BackEvent implements IEvent {
    public readonly type = 'back';
}

export class NextEvent implements IEvent {
    public readonly type = 'next';
}

export class ExitEvent implements IEvent {
    public readonly type = 'exit';
}

export class ExitTTLEvent implements IEvent {
    public readonly type = 'exit-ttl';
}
