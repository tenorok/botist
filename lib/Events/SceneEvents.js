"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StartEvent {
    constructor() {
        this.type = 'start';
    }
}
exports.StartEvent = StartEvent;
class BackEvent {
    constructor() {
        this.type = 'back';
    }
}
exports.BackEvent = BackEvent;
class NextEvent {
    constructor() {
        this.type = 'next';
    }
}
exports.NextEvent = NextEvent;
class ExitEvent {
    constructor() {
        this.type = 'exit';
    }
}
exports.ExitEvent = ExitEvent;
class ExitTTLEvent {
    constructor() {
        this.type = 'exit-ttl';
    }
}
exports.ExitTTLEvent = ExitTTLEvent;
//# sourceMappingURL=SceneEvents.js.map