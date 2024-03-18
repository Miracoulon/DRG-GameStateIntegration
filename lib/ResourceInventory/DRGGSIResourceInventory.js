"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DRGGSIResourceInventory = void 0;
const EventEmitter = require("events");
class DRGGSIResourceInventory extends EventEmitter {
    constructor() {
        super();
        this._resources = new Map();
    }
    setResourceAmount(resource, amount) {
        this._resources.set(resource, amount);
        this.emit('AmountChanged', resource, amount);
    }
    addResourceAmount(resource, amount) {
        if (this._resources.has(resource)) {
            const count = this._resources.get(resource);
            this._resources.set(resource, count + amount);
            this.emit('AmountChanged', resource, count + amount);
        }
        else {
            this._resources.set(resource, amount);
            this.emit('AmountChanged', resource, amount);
        }
    }
    removeResourceAmount(resource, amount) {
        if (this._resources.has(resource)) {
            const count = this._resources.get(resource);
            this._resources.set(resource, count - amount);
            this.emit('AmountChanged', resource, count - amount);
        }
        else {
            this._resources.set(resource, -amount);
            this.emit('AmountChanged', resource, -amount);
        }
    }
    getResourceAmount(resource) {
        if (this._resources.has(resource)) {
            return this._resources.get(resource);
        }
        return 0;
    }
    reset() {
        for (const resource of this._resources.keys()) {
            this.emit('AmountChanged', resource, 0);
        }
        this._resources = new Map();
    }
}
exports.DRGGSIResourceInventory = DRGGSIResourceInventory;
