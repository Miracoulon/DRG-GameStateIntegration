import EventEmitter = require("events");
import { DRGGSIItem } from "./Items/DRGGSIItem";
import { EPlayerState } from "./EPlayerState";
import { DRGGSIResourceInventory } from "../../ResourceInventory/DRGGSIResourceInventory";


interface DRGGSIPlayerEvents {
    /**
     * Emitted when the name of this player changes.
     * Also called once on initial connection.
     * @param player The player whose name just changed.
     * @param name The name of this player.
     */
    'NameChanged': (player: DRGGSIPlayer, name: string) => void;
    /**
     * Emitted when the state of this player changes.
     * @param player The player whose state just changed.
     * @param state The new state of this player.
     * @param previousState The previous state of this player
     */
    'State': (player: DRGGSIPlayer, state: EPlayerState, previousState: EPlayerState) => void;

    /**
     * Emitted when the players health changes.
     * @param player The player whose health just changed.
     * @param health The new health of the player.
     */
    'Health': (player: DRGGSIPlayer, health: number) => void;
    /**
     * Emitted when the players shield changes.
     * @param player The player whose shield just changed.
     * @param shield The new shield of the player.
     */
    'Shield': (player: DRGGSIPlayer, shield: number) => void;
    'SupplyStatusChanged': (player: DRGGSIPlayer, health: number, ammo: number) => void;
    'Inventory.Changed': (player: DRGGSIPlayer, resource: string, newAmount: number) => void;
    'Inventory.Snapshot': (player: DRGGSIPlayer, resources: DRGGSIResourceInventory) => void;
}

declare interface DRGGSIPlayer {
    on<U extends keyof DRGGSIPlayerEvents>(event: U, listener: DRGGSIPlayerEvents[U]): this;
    emit<U extends keyof DRGGSIPlayerEvents>(event: U, ...args: Parameters<DRGGSIPlayerEvents[U]>): boolean;
}

/**
 * A player in the game.
 * */
class DRGGSIPlayer extends EventEmitter {
    private _playerID: number;
    /** The ID assigned to this player by the GSI module.
     * Persistent for the duration they are in the game for.
     * May change when reconnecting.
     * */
    public get PlayerID(): number { return this._playerID; };
    private _playerName: string;
    private set PlayerName(newName: string) {
        this._playerName = newName;
        this.emit('NameChanged', this, this._playerName);
    };
    /** The name of this player. */
    public get PlayerName(): string { return this._playerName; };
    private _isLocal: boolean;
    /** Whether this is the local player from the view of the sending GSI module. 
     * Can be true on multiple players if receiving from multiple different sources.
     */
    public get IsLocalPlayer(): boolean { return this._isLocal; };
    private _isHost: boolean;
    /** Whether this player is the host of the lobby. */
    public get IsLobbyHost(): boolean { return this._isHost; };

    private _inventory: DRGGSIResourceInventory;
    public get Inventory(): DRGGSIResourceInventory { return this._inventory; };
    //private _inventory: Map<string, number> = null;
    /** A map of resource name <-> resource amount of all resources currently carried by this player */
    //public get Inventory(): Map<string, number> { if (this._inventory === null) this._inventory = new Map<string, number>(); return this._inventory; };


    private _health: number;
    private set Health(newHealth: number) {
        this._health = newHealth < 0 ? 0 : newHealth;
        this.emit('Health', this, this._health);
    };
    public get Health(): number { return this._health; };
    private _maxHealth: number;
    public get MaxHealth(): number { return this._maxHealth; };
    public get HealthPercentage(): number { return this._health / this._maxHealth; };

    private _shield: number;
    private set Shield(newShield: number) {
        this._shield = newShield < 0 ? 0 : newShield;
        this.emit('Shield', this, this._shield);
    };
    public get Shield(): number { return this._shield; };
    private _maxShield: number;
    public get MaxShield(): number { return this._maxShield; };
    public get ShieldPercentage(): number { return this._shield / this._maxShield; };

    private _state: EPlayerState;
    private set State(newState: EPlayerState) {
        if (this._state === newState) return;
        const previousState = this._state;
        this._state = newState;
        this.emit('State', this, this._state, previousState);
    }
    public get State(): EPlayerState { return this._state; };

    private _equipment: Map<string, DRGGSIItem> = null;
    /** A map of string <-> DRGGSIItem of all items currently available to this player */
    public get Equipment(): Map<string, DRGGSIItem> { if (this._equipment === null) this._equipment = new Map<string, DRGGSIItem>(); return this._equipment; };
    private _equipmentSlots: Map<number, string> = null;
    /** A map of number (item slot) <-> string (item savegame ID) of all items currently available to this player */
    public get EquipmentSlots(): Map<number, string> { if (this._equipmentSlots === null) this._equipmentSlots = new Map<number, string>(); return this._equipmentSlots; };
    private _equippedItem: string;
    /** The item that this player is currently holding. null if no item is found */
    public get EquippedItem(): DRGGSIItem | null { if (this.Equipment.has(this._equippedItem)) return this.Equipment.get(this._equippedItem); return null; };
    /** The SavegameID of the item that this player is currently holding */
    public get EquippedItemID(): string { return this._equippedItem; };
    

    constructor(playerID: number, playerName: string, isLocal: boolean, isHost: boolean) {
        super();

        this._playerID = playerID || -1;
        this._playerName = playerName;
        this._isLocal = isLocal;
        this._isHost = isHost;

        this._inventory = new DRGGSIResourceInventory();
        //this._inventory = new Map<string, number>();
        this._equipment = new Map<string, DRGGSIItem>();
        this._equipmentSlots = new Map<number, string>();
        this._equippedItem = '';

        this._state = EPlayerState.Invalid;
    }

    public handlePlayerState(data): boolean {
        if (data.State === undefined) return false;
        this.State = data.State;
        return false;
    }

    public handleClassChange(data): boolean {
        return false;
    }

    public handleHealthInfo(data): boolean {
        if (data.Health === undefined || data.MaxHealth === undefined || data.Shield === undefined || data.MaxShield === undefined) return false;
        this._maxHealth = data.MaxHealth;
        this.Health = data.Health;
        this._maxShield = data.MaxShield;
        this.Shield = data.Shield();
        return true;
    }

    public handleInventoryChanged(data): boolean {
        if (data.Resource === undefined || data.Amount === undefined) return false;
        //this._inventory.set(data.Resource, data.Amount);
        this._inventory.setResourceAmount(data.Resource, data.Amount);
        this.emit('Inventory.Changed', this, data.Resource, data.Amount);
        return true;
    }

    public handleInventorySnapshot(data): boolean {
        if (data.Resources === undefined) return false;
        for (const resourceInfo of data.Resources) {
            if (resourceInfo.Resource === undefined || resourceInfo.Amount === undefined) continue;
            //this._inventory.set(resourceInfo.Resource, resourceInfo.Amount);
            this._inventory.setResourceAmount(resourceInfo.Resource, resourceInfo.Amount);
        }
        this.emit('Inventory.Snapshot', this, this._inventory);
        return true;
    }

    public handleSupplyStatusChanged(data): boolean {
        return false;
    }
}

export { DRGGSIPlayer, EPlayerState };