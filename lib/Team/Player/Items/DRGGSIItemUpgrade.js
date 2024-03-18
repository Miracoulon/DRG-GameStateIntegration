"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DRGGSIItemUpgrade = void 0;
/**
 * A ItemUpgrade that can be equipped on an item.
 * */
class DRGGSIItemUpgrade {
    /** The SavegameID of this ItemUpgrade */
    get SavegameID() { return this._savegameID; }
    ;
    /** The file name of this ItemUpgrade */
    get InternalName() { return this._internalName; }
    ;
    /** The name of this ItemUpgrade as used in the equipment terminal */
    get DisplayName() { return this._name; }
    ;
    /** The slot of this ItemUpgrade in its UpgradeTier as displayed in the equipment terminal */
    get Slot() { return this._slot; }
    ;
    set Slot(newSlot) {
        this._slot = newSlot;
    }
    ;
    /**
     * Creates a new ItemUpgrade
     * @param savegameID The SavegameID of the ItemUpgrade
     * @param internalName The file name of the ItemUpgrade
     * @param displayName The name of the ItemUpgrade as used in the equipment terminal
     */
    constructor(savegameID, internalName, displayName) {
        this._savegameID = savegameID;
        this._internalName = internalName;
        this._name = displayName;
    }
}
exports.DRGGSIItemUpgrade = DRGGSIItemUpgrade;
