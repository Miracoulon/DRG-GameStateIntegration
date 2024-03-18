"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DRGGSIItem = void 0;
/**
 * An item that can be carried by a player.
 * */
class DRGGSIItem {
    /** The SavegameID of this Item */
    get SavegameID() { return this._savegameID; }
    ;
    /** The file name of the ItemID used by this Item */
    get ItemID() { return this._itemID; }
    ;
    /** The name of this Item as displayed in the equipment terminal */
    get ItemName() { return this._itemName; }
    ;
    /** A list of DRGGSIItemUpgrade equipped on this item */
    get EquippedUpgrades() { return this._equippedUpgrades.values(); }
    ;
    /** A list of SavegameIDs of the DRGGSIItemUpgrades equipped on this item */
    get EquippedUpgradeIDs() { return this._equippedIDs; }
    ;
    constructor(savegameID, itemID, itemName) {
        this._equippedUpgrades = null;
        this._equippedIDs = null;
        this._savegameID = savegameID;
        this._itemID = itemID;
        this._itemName = itemName;
    }
}
exports.DRGGSIItem = DRGGSIItem;
