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
    /** ==== SPECIAL STATE EVENTS ==== */
    /**
     * Emitted when this player dies.
     * @param player The player that just died
     */
    'State.OnDeath': (player: DRGGSIPlayer) => void;
    /**
     * Emitted when this player was revived.
     * @param player The player that just got revived
     */
    'State.OnRevived': (player: DRGGSIPlayer) => void;
    /**
     * Emitted when this player gets paralyzed (example: Grabbed by a leech)
     * @param player The player that just got paralyzed
     */
    'State.OnParalyzed': (player: DRGGSIPlayer) => void;
    /**
     * Emitted when this player stops being paralyzed
     * @param player The player that just stopped being paralyzed
     */
    'State.OnUnparalyzed': (player: DRGGSIPlayer) => void;
    /**
     * Emitted when this player starts using a zipline
     * @param player The player that just started using a zipline
     */
    'State.OnZiplineStart': (player: DRGGSIPlayer) => void;
    /**
     * Emitted when this player stops using a zipline
     * @param player The player that just stopped using a zipline
     */
    'State.OnZiplineEnd': (player: DRGGSIPlayer) => void;
    /**
     * Emitted when this player starts a "Use" action
     * @param player The player that just started the action
     */
    'State.OnBeginUsing': (player: DRGGSIPlayer) => void;
    /**
     * Emitted when this player stops a "Use" action
     * @param player The player that just stopped the action
     */
    'State.OnEndUsing': (player: DRGGSIPlayer) => void;
    /**
     * Emitted when the movement of this player is locked (example: Standing in the escape pod)
     * @param player The player whose movement just got locked
     */
    'State.OnMovementLocked': (player: DRGGSIPlayer) => void;
    /**
     * Emitted when the movement of this player is unlocked (example: At the start of the mission)
     * @param player The player whose movement just got unlocked
     */
    'State.OnMovementUnlocked': (player: DRGGSIPlayer) => void;
    /**
     * Emitted when this player gets grabbed
     * @param player The player that just got grabbed
     */
    'State.OnGrabbed': (player: DRGGSIPlayer) => void;
    /**
     * Emitted when this player gets released after being grabbed
     * @param player The player that just got released
     */
    'State.OnReleased': (player: DRGGSIPlayer) => void;
    /**
     * Emitted when this player starts flying
     * @param player The player that just started flying
     */
    'State.OnBeginFlying': (player: DRGGSIPlayer) => void;
    /**
     * Emitted when this player stops flying
     * @param player The player that just stopped flying
     */
    'State.OnEndFlying': (player: DRGGSIPlayer) => void;
    /**
     * Emitted when this player gets frozen
     * @param player The player that just got frozen
     */
    'State.OnFrozen': (player: DRGGSIPlayer) => void;
    /**
     * Emitted when this player gets unfrozen
     * @param player The player that just got unfrozen
     */
    'State.OnUnfrozen': (player: DRGGSIPlayer) => void;
    /**
     * Emitted when this player passes out from drinking too much beer
     * @param player The player that just passed out
     */
    'State.OnPassedOut': (player: DRGGSIPlayer) => void;
    /**
     * Emitted when this player sobers up after having passed out
     * @param player The player that just sobered up
     */
    'State.OnSoberedUp': (player: DRGGSIPlayer) => void;
    /**
     * Emitted when this player starts piloting another object (example: Cave Angel)
     * @param player The player that just started piloting another object
     */
    'State.OnStartedPiloting': (player: DRGGSIPlayer) => void;
    /**
     * Emitted when this player stops piloting another object
     * @param player The player that just stopped piloting another object
     */
    'State.OnStoppedPiloting': (player: DRGGSIPlayer) => void;
    /**
     * Emitted when this player becomes infected with Rockpox
     * @param player The player that just got infected
     */
    'State.OnInfected': (player: DRGGSIPlayer) => void;
    /**
     * Emitted when this player breaks out of a Rockpox infection
     * @param player The player that just stopped being infected
     */
    'State.OnCured': (player: DRGGSIPlayer) => void;
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
