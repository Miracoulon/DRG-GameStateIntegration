"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EPlayerState = exports.DRGGSIPlayer = void 0;
const EventEmitter = require("events");
const EPlayerState_1 = require("./EPlayerState");
Object.defineProperty(exports, "EPlayerState", { enumerable: true, get: function () { return EPlayerState_1.EPlayerState; } });
const DRGGSIResourceInventory_1 = require("../../ResourceInventory/DRGGSIResourceInventory");
const enterStateEvents = new Map([
    [EPlayerState_1.EPlayerState.Dead, 'State.OnDeath'],
    [EPlayerState_1.EPlayerState.Downed, 'State.OnDeath'],
    [EPlayerState_1.EPlayerState.Paralyzed, 'State.OnParalyzed'],
    [EPlayerState_1.EPlayerState.Zipline, 'State.OnZiplineStart'],
    [EPlayerState_1.EPlayerState.Using, 'State.OnBeginUsing'],
    [EPlayerState_1.EPlayerState.NoMovement, 'State.OnMovementLocked'],
    [EPlayerState_1.EPlayerState.Grabbed, 'State.OnGrabbed'],
    [EPlayerState_1.EPlayerState.Flying, 'State.OnBeginFlying'],
    [EPlayerState_1.EPlayerState.Frozen, 'State.OnFrozen'],
    [EPlayerState_1.EPlayerState.PassedOut, 'State.OnPassedOut'],
    [EPlayerState_1.EPlayerState.Piloting, 'State.OnStartedPiloting'],
    [EPlayerState_1.EPlayerState.Infected, 'State.OnInfected'],
]);
const exitStateEvents = new Map([
    [EPlayerState_1.EPlayerState.Dead, 'State.OnRevived'],
    [EPlayerState_1.EPlayerState.Downed, 'State.OnRevived'],
    [EPlayerState_1.EPlayerState.Paralyzed, 'State.OnUnparalyzed'],
    [EPlayerState_1.EPlayerState.Zipline, 'State.OnZiplineEnd'],
    [EPlayerState_1.EPlayerState.Using, 'State.OnStoppedUsing'],
    [EPlayerState_1.EPlayerState.NoMovement, 'State.OnMovementUnlocked'],
    [EPlayerState_1.EPlayerState.Grabbed, 'State.OnReleased'],
    [EPlayerState_1.EPlayerState.Flying, 'State.OnEndFlying'],
    [EPlayerState_1.EPlayerState.Frozen, 'State.OnUnfrozen'],
    [EPlayerState_1.EPlayerState.PassedOut, 'State.OnSoberedUp'],
    [EPlayerState_1.EPlayerState.Piloting, 'State.OnStoppedPiloting'],
    [EPlayerState_1.EPlayerState.Infected, 'State.OnCured'],
]);
/**
 * A player in the game.
 * */
class DRGGSIPlayer extends EventEmitter {
    /** The ID assigned to this player by the GSI module.
     * Persistent for the duration they are in the game for.
     * May change when reconnecting.
     * */
    get PlayerID() { return this._playerID; }
    ;
    set PlayerName(newName) {
        this._playerName = newName;
        this.emit('NameChanged', this, this._playerName);
    }
    ;
    /** The name of this player. */
    get PlayerName() { return this._playerName; }
    ;
    /** Whether this is the local player from the view of the sending GSI module.
     * Can be true on multiple players if receiving from multiple different sources.
     */
    get IsLocalPlayer() { return this._isLocal; }
    ;
    /** Whether this player is the host of the lobby. */
    get IsLobbyHost() { return this._isHost; }
    ;
    get Inventory() { return this._inventory; }
    ;
    set Health(newHealth) {
        this._health = newHealth < 0 ? 0 : newHealth;
        this.emit('Health', this, this._health);
    }
    ;
    get Health() { return this._health; }
    ;
    get MaxHealth() { return this._maxHealth; }
    ;
    get HealthPercentage() { return this._health / this._maxHealth; }
    ;
    set Shield(newShield) {
        this._shield = newShield < 0 ? 0 : newShield;
        this.emit('Shield', this, this._shield);
    }
    ;
    get Shield() { return this._shield; }
    ;
    get MaxShield() { return this._maxShield; }
    ;
    get ShieldPercentage() { return this._shield / this._maxShield; }
    ;
    set State(newState) {
        if (this._state === newState)
            return;
        const previousState = this._state;
        this._state = newState;
        if (exitStateEvents.has(previousState))
            this.emit(exitStateEvents.get(previousState), this);
        if (enterStateEvents.has(this._state))
            this.emit(enterStateEvents.get(this._state), this);
        this.emit('State', this, this._state, previousState);
    }
    get State() { return this._state; }
    ;
    /** A map of string <-> DRGGSIItem of all items currently available to this player */
    get Equipment() { if (this._equipment === null)
        this._equipment = new Map(); return this._equipment; }
    ;
    /** A map of number (item slot) <-> string (item savegame ID) of all items currently available to this player */
    get EquipmentSlots() { if (this._equipmentSlots === null)
        this._equipmentSlots = new Map(); return this._equipmentSlots; }
    ;
    /** The item that this player is currently holding. null if no item is found */
    get EquippedItem() { if (this.Equipment.has(this._equippedItem))
        return this.Equipment.get(this._equippedItem); return null; }
    ;
    /** The SavegameID of the item that this player is currently holding */
    get EquippedItemID() { return this._equippedItem; }
    ;
    constructor(playerID, playerName, isLocal, isHost) {
        super();
        this._equipment = null;
        this._equipmentSlots = null;
        this._playerID = playerID || -1;
        this._playerName = playerName;
        this._isLocal = isLocal;
        this._isHost = isHost;
        this._inventory = new DRGGSIResourceInventory_1.DRGGSIResourceInventory();
        //this._inventory = new Map<string, number>();
        this._equipment = new Map();
        this._equipmentSlots = new Map();
        this._equippedItem = '';
        this._state = EPlayerState_1.EPlayerState.Invalid;
    }
    handlePlayerState(data) {
        if (data.State === undefined)
            return false;
        this.State = data.State;
        return false;
    }
    handleClassChange(data) {
        return false;
    }
    handleHealthInfo(data) {
        if (data.Health === undefined || data.MaxHealth === undefined || data.Shield === undefined || data.MaxShield === undefined)
            return false;
        this._maxHealth = data.MaxHealth;
        this.Health = data.Health;
        this._maxShield = data.MaxShield;
        this.Shield = data.Shield();
        return true;
    }
    handleInventoryChanged(data) {
        if (data.Resource === undefined || data.Amount === undefined)
            return false;
        //this._inventory.set(data.Resource, data.Amount);
        this._inventory.setResourceAmount(data.Resource, data.Amount);
        this.emit('Inventory.Changed', this, data.Resource, data.Amount);
        return true;
    }
    handleInventorySnapshot(data) {
        if (data.Resources === undefined)
            return false;
        for (const resourceInfo of data.Resources) {
            if (resourceInfo.Resource === undefined || resourceInfo.Amount === undefined)
                continue;
            //this._inventory.set(resourceInfo.Resource, resourceInfo.Amount);
            this._inventory.setResourceAmount(resourceInfo.Resource, resourceInfo.Amount);
        }
        this.emit('Inventory.Snapshot', this, this._inventory);
        return true;
    }
    handleSupplyStatusChanged(data) {
        return false;
    }
}
exports.DRGGSIPlayer = DRGGSIPlayer;
