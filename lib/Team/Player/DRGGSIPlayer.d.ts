/// <reference types="node" />
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
declare class DRGGSIPlayer extends EventEmitter {
    private _playerID;
    /** The ID assigned to this player by the GSI module.
     * Persistent for the duration they are in the game for.
     * May change when reconnecting.
     * */
    get PlayerID(): number;
    private _playerName;
    private set PlayerName(value);
    /** The name of this player. */
    get PlayerName(): string;
    private _isLocal;
    /** Whether this is the local player from the view of the sending GSI module.
     * Can be true on multiple players if receiving from multiple different sources.
     */
    get IsLocalPlayer(): boolean;
    private _isHost;
    /** Whether this player is the host of the lobby. */
    get IsLobbyHost(): boolean;
    private _inventory;
    get Inventory(): DRGGSIResourceInventory;
    /** A map of resource name <-> resource amount of all resources currently carried by this player */
    private _health;
    private set Health(value);
    get Health(): number;
    private _maxHealth;
    get MaxHealth(): number;
    get HealthPercentage(): number;
    private _shield;
    private set Shield(value);
    get Shield(): number;
    private _maxShield;
    get MaxShield(): number;
    get ShieldPercentage(): number;
    private _state;
    private set State(value);
    get State(): EPlayerState;
    private _equipment;
    /** A map of string <-> DRGGSIItem of all items currently available to this player */
    get Equipment(): Map<string, DRGGSIItem>;
    private _equipmentSlots;
    /** A map of number (item slot) <-> string (item savegame ID) of all items currently available to this player */
    get EquipmentSlots(): Map<number, string>;
    private _equippedItem;
    /** The item that this player is currently holding. null if no item is found */
    get EquippedItem(): DRGGSIItem | null;
    /** The SavegameID of the item that this player is currently holding */
    get EquippedItemID(): string;
    constructor(playerID: number, playerName: string, isLocal: boolean, isHost: boolean);
    handlePlayerState(data: any): boolean;
    handleClassChange(data: any): boolean;
    handleHealthInfo(data: any): boolean;
    handleInventoryChanged(data: any): boolean;
    handleInventorySnapshot(data: any): boolean;
    handleSupplyStatusChanged(data: any): boolean;
}
export { DRGGSIPlayer, EPlayerState };
