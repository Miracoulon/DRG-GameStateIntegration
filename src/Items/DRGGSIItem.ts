import { DRGGSIItemUpgrade } from "./DRGGSIItemUpgrade";

/**
 * An item that can be carried by a player.
 * */
class DRGGSIItem {
    private _savegameID: string;
    /** The SavegameID of this Item */
    public get SavegameID(): string { return this._savegameID; };
    private _itemID: string;
    /** The file name of the ItemID used by this Item */
    public get ItemID(): string { return this._itemID; };
    private _itemName: string;
    /** The name of this Item as displayed in the equipment terminal */
    public get ItemName(): string { return this._itemName; };

    private _equippedUpgrades: Map<string, DRGGSIItemUpgrade> = null;
    /** A list of DRGGSIItemUpgrade equipped on this item */
    public get EquippedUpgrades() { return this._equippedUpgrades.values(); };
    private _equippedIDs: Array<string> = null;
    /** A list of SavegameIDs of the DRGGSIItemUpgrades equipped on this item */
    public get EquippedUpgradeIDs(): Array<string> { return this._equippedIDs; };

    public constructor(savegameID: string, itemID: string, itemName: string) {
        this._savegameID = savegameID;
        this._itemID = itemID;
        this._itemName = itemName;
    }
}

export { DRGGSIItem };