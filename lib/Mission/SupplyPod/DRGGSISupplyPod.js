"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DRGGSISupplyPod = void 0;
const EventEmitter = require("events");
class DRGGSISupplyPod extends EventEmitter {
    static get ResourceCost() { return DRGGSISupplyPod._resourceCost; }
    ;
    get ID() { return this._id; }
    ;
    get ChargesLeft() { return this._chargesLeft; }
    ;
    get State() { return this._state; }
    ;
    get Target() { return this._target; }
    ;
    constructor(id) {
        super();
        this._id = id;
        this._chargesLeft = 4;
    }
    handleStateChanged(data) {
        this._state = data.State;
        this._target = {
            X: data.Target.X,
            Y: data.Target.Y,
            Z: data.Target.Z,
        };
        this.emit('State.Changed', this.ID, this._state);
    }
    handleChargesLeftChanged(data) {
        this._chargesLeft = data.Charges;
        this.emit('ChargesLeft.Changed', this.ID, this._chargesLeft);
    }
}
exports.DRGGSISupplyPod = DRGGSISupplyPod;
