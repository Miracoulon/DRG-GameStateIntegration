/**
 * A ItemUpgrade that can be equipped on an item.
 * */
declare class DRGGSIItemUpgrade {
    private _savegameID;
    /** The SavegameID of this ItemUpgrade */
    get SavegameID(): string;
    private _internalName;
    /** The file name of this ItemUpgrade */
    get InternalName(): string;
    private _name;
    /** The name of this ItemUpgrade as used in the equipment terminal */
    get DisplayName(): string;
    private _slot;
    /** The slot of this ItemUpgrade in its UpgradeTier as displayed in the equipment terminal */
    get Slot(): number;
    set Slot(newSlot: number);
    /**
     * Creates a new ItemUpgrade
     * @param savegameID The SavegameID of the ItemUpgrade
     * @param internalName The file name of the ItemUpgrade
     * @param displayName The name of the ItemUpgrade as used in the equipment terminal
     */
    constructor(savegameID: string, internalName: string, displayName: string);
}
export { DRGGSIItemUpgrade };
