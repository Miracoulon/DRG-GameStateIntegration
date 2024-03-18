import { DRGGSIItemUpgrade } from "./DRGGSIItemUpgrade";
/**
 * An item that can be carried by a player.
 * */
declare class DRGGSIItem {
    private _savegameID;
    /** The SavegameID of this Item */
    get SavegameID(): string;
    private _itemID;
    /** The file name of the ItemID used by this Item */
    get ItemID(): string;
    private _itemName;
    /** The name of this Item as displayed in the equipment terminal */
    get ItemName(): string;
    private _equippedUpgrades;
    /** A list of DRGGSIItemUpgrade equipped on this item */
    get EquippedUpgrades(): IterableIterator<DRGGSIItemUpgrade>;
    private _equippedIDs;
    /** A list of SavegameIDs of the DRGGSIItemUpgrades equipped on this item */
    get EquippedUpgradeIDs(): Array<string>;
    constructor(savegameID: string, itemID: string, itemName: string);
}
export { DRGGSIItem };
