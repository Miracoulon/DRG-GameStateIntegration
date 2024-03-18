"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DRGGSIDropPod = void 0;
const EventEmitter = require("events");
const EDRGGSIDropPodState_1 = require("./EDRGGSIDropPodState");
class DRGGSIDropPod extends EventEmitter {
    get Type() { return this._type; }
    ;
    set State(newState) {
        if (this._state === newState)
            return;
        this._state = newState;
        this.emit('State.Changed', this, this._state);
    }
    get State() { return this._state; }
    ;
    constructor() {
        super();
        this.State = EDRGGSIDropPodState_1.EDRGGSIDropPodState.WaitingForGameStart;
    }
    handleStateInfo(state) {
        this.State = state;
    }
}
exports.DRGGSIDropPod = DRGGSIDropPod;
