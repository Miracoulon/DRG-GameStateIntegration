"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EPlayerState = exports.DRGGSIPlayer = void 0;
const EventEmitter = require("events");
const EPlayerState_1 = require("./EPlayerState");
Object.defineProperty(exports, "EPlayerState", { enumerable: true, get: function () { return EPlayerState_1.EPlayerState; } });
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
        this.emit('Player.NameChanged', this, this._playerName);
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
    /** A map of resource name <-> resource amount of all resources currently carried by this player */
    get Inventory() { if (this._inventory === null)
        this._inventory = new Map(); return this._inventory; }
    ;
    set Health(newHealth) {
        this._health = newHealth < 0 ? 0 : newHealth;
        this.emit('Player.Health', this, this._health);
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
        this.emit('Player.Shield', this, this._shield);
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
        this.emit('Player.State', this, this._state, previousState);
    }
    get State() { return this._state; }
    ;
    constructor(playerID, playerName, isLocal, isHost) {
        super();
        this._playerID = playerID || -1;
        this._playerName = playerName;
        this._isLocal = isLocal;
        this._isHost = isHost;
        this._inventory = new Map();
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
        this._inventory.set(data.Resource, data.Amount);
        this.emit('Player.Inventory.Changed', this, data.Resource, data.Amount);
        return true;
    }
    handleInventorySnapshot(data) {
        if (data.Resources === undefined)
            return false;
        for (const resourceInfo of data.Resources) {
            if (resourceInfo.Resource === undefined || resourceInfo.Amount === undefined)
                continue;
            this._inventory.set(resourceInfo.Resource, resourceInfo.Amount);
        }
        this.emit('Player.Inventory.Snapshot', this, this._inventory);
        return true;
    }
    handleSupplyStatusChanged(data) {
        return false;
    }
}
exports.DRGGSIPlayer = DRGGSIPlayer;
