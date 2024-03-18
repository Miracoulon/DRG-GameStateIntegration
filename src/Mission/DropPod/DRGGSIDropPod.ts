import EventEmitter = require("events");
import { EDRGGSIDropPodState } from "./EDRGGSIDropPodState";
import { EDRGGSIDropPodType } from "./EDRGGSIDropPodType";

interface DRGGSIDropPodEvents {

    'State.Changed': (pod: DRGGSIDropPod, state: EDRGGSIDropPodState) => void;
}

declare interface DRGGSIDropPod {
    on<U extends keyof DRGGSIDropPodEvents>(event: U, listener: DRGGSIDropPodEvents[U]): this;
    emit<U extends keyof DRGGSIDropPodEvents>(event: U, ...args: Parameters<DRGGSIDropPodEvents[U]>): boolean;
}


class DRGGSIDropPod extends EventEmitter {
    private _type: EDRGGSIDropPodType;
    public get Type(): EDRGGSIDropPodType { return this._type; };

    private _state: EDRGGSIDropPodState;
    private set State(newState: EDRGGSIDropPodState) {
        if (this._state === newState) return;
        this._state = newState;
        this.emit('State.Changed', this, this._state);
    }
    public get State(): EDRGGSIDropPodState { return this._state; };

    constructor() {
        super();
        this.State = EDRGGSIDropPodState.WaitingForGameStart;
    }

    public handleStateInfo(state) {
        this.State = state;
    }
}

export { DRGGSIDropPod };