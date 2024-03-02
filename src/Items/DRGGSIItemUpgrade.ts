/**
 * A ItemUpgrade that can be equipped on an item.
 * */
class DRGGSIItemUpgrade {
    private _savegameID: string;
    /** The SavegameID of this ItemUpgrade */
    public get SavegameID(): string { return this._savegameID; };
    private _internalName: string;
    /** The file name of this ItemUpgrade */
    public get InternalName(): string { return this._internalName; };
    private _name: string;
    /** The name of this ItemUpgrade as used in the equipment terminal */
    public get DisplayName(): string { return this._name; };
    private _slot: number;
    /** The slot of this ItemUpgrade in its UpgradeTier as displayed in the equipment terminal */
    public get Slot(): number { return this._slot; };
    public set Slot(newSlot: number) {
        this._slot = newSlot;
    };

    /**
     * Creates a new ItemUpgrade
     * @param savegameID The SavegameID of the ItemUpgrade
     * @param internalName The file name of the ItemUpgrade
     * @param displayName The name of the ItemUpgrade as used in the equipment terminal
     */
    public constructor(savegameID: string, internalName: string, displayName: string) {
        this._savegameID = savegameID;
        this._internalName = internalName;
        this._name = displayName;
    }
}

export { DRGGSIItemUpgrade };