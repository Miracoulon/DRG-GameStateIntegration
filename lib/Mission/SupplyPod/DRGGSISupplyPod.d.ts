/// <reference types="node" />
import EventEmitter = require("events");
import { ESupplyPodState } from "./ESupplyPodState";
interface DRGGSISupplyPodEvents {
    /**
     * Emitted when this SupplyPod changes state.
     * @param {number} id The ID of the SupplyPod of which the state just changed
     * @param {ESupplyPodState} state The new state of the SupplyPod
     */
    'State.Changed': (id: number, state: ESupplyPodState) => void;
    /**
     * Emitted when the amount of remaining charges of this SupplyPod changes.
     * @param {number} id The ID of the SupplyPod of which the amount of charges just changed.
     * @param {number} chargesLeft The amount of charges left on this SupplyPod
     */
    'ChargesLeft.Changed': (id: number, chargesLeft: number) => void;
}
declare interface DRGGSISupplyPod {
    on<U extends keyof DRGGSISupplyPodEvents>(event: U, listener: DRGGSISupplyPodEvents[U]): this;
    emit<U extends keyof DRGGSISupplyPodEvents>(event: U, ...args: Parameters<DRGGSISupplyPodEvents[U]>): boolean;
}
declare class DRGGSISupplyPod extends EventEmitter {
    private static _resourceCost;
    static get ResourceCost(): number;
    private _id;
    get ID(): number;
    private _chargesLeft;
    get ChargesLeft(): number;
    private _state;
    get State(): ESupplyPodState;
    private _target;
    get Target(): {
        X: number;
        Y: number;
        Z: number;
    };
    constructor(id: number);
    handleStateChanged(data: any): void;
    handleChargesLeftChanged(data: any): void;
}
export { DRGGSISupplyPod };
