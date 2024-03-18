import EventEmitter = require("events");

interface DRGGSIResourceInventoryEvents {
    /**
     * Emitted whenever the amount of a resource changes
     * @param resource The resource that changed
     * @param amount The current amount in the inventory
     */
    'AmountChanged': (resource: string, amount: number) => void;
}

declare interface DRGGSIResourceInventory {
    on<U extends keyof DRGGSIResourceInventoryEvents>(event: U, listener: DRGGSIResourceInventoryEvents[U]): this;
    emit<U extends keyof DRGGSIResourceInventoryEvents>(event: U, ...args: Parameters<DRGGSIResourceInventoryEvents[U]>): boolean;
}

class DRGGSIResourceInventory extends EventEmitter {
    private _resources: Map<string, number>;
    constructor() {
        super();

        this._resources = new Map<string, number>();
    }

    public setResourceAmount(resource: string, amount: number) {
        this._resources.set(resource, amount);
        this.emit('AmountChanged', resource, amount);
    }

    public addResourceAmount(resource: string, amount: number) {
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

    public removeResourceAmount(resource: string, amount: number) {
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

    public getResourceAmount(resource: string): number {
        if (this._resources.has(resource)) {
            return this._resources.get(resource);
        }
        return 0;
    }

    public reset() {
        for (const resource of this._resources.keys()) {
            this.emit('AmountChanged', resource, 0);
        }
        this._resources = new Map<string, number>();
    }
}

export { DRGGSIResourceInventory };