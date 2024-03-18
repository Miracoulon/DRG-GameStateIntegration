/// <reference types="node" />
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
declare class DRGGSIDropPod extends EventEmitter {
    private _type;
    get Type(): EDRGGSIDropPodType;
    private _state;
    private set State(value);
    get State(): EDRGGSIDropPodState;
    constructor();
    handleStateInfo(state: any): void;
}
export { DRGGSIDropPod };
