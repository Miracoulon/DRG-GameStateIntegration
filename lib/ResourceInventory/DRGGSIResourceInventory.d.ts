/// <reference types="node" />
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
declare class DRGGSIResourceInventory extends EventEmitter {
    private _resources;
    constructor();
    setResourceAmount(resource: string, amount: number): void;
    addResourceAmount(resource: string, amount: number): void;
    removeResourceAmount(resource: string, amount: number): void;
    getResourceAmount(resource: string): number;
    reset(): void;
}
export { DRGGSIResourceInventory };
