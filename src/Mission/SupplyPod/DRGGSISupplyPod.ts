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


class DRGGSISupplyPod extends EventEmitter {
    private static _resourceCost: number;
    public static get ResourceCost(): number { return DRGGSISupplyPod._resourceCost; };

    private _id: number;
    public get ID(): number { return this._id; };
    private _chargesLeft: number;
    public get ChargesLeft(): number { return this._chargesLeft; };
    private _state: ESupplyPodState;
    public get State(): ESupplyPodState { return this._state; };
    private _target: {
        X: number;
        Y: number;
        Z: number;
    }
    public get Target() { return this._target; };

    public constructor(id: number) {
        super();

        this._id = id;
        this._chargesLeft = 4;
    }

    public handleStateChanged(data) {
        this._state = data.State as ESupplyPodState;
        this._target = {
            X: data.Target.X,
            Y: data.Target.Y,
            Z: data.Target.Z,
        };
        this.emit('State.Changed', this.ID, this._state);
    }

    public handleChargesLeftChanged(data) {
        this._chargesLeft = data.Charges;
        this.emit('ChargesLeft.Changed', this.ID, this._chargesLeft);
    }
}

export { DRGGSISupplyPod };