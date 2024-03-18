"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DRGGSITeam = void 0;
const EventEmitter = require("events");
const DRGGSIPlayer_1 = require("./Player/DRGGSIPlayer");
const DRGGSIResourceInventory_1 = require("../ResourceInventory/DRGGSIResourceInventory");
class DRGGSITeam extends EventEmitter {
    get Resources() { return this._resources; }
    ;
    get Players() { return this._players; }
    ;
    getPlayerByID(ID) { if (this._players.has(ID)) {
        return this._players.get(ID);
    } return null; }
    ;
    constructor() {
        super();
        this._resources = new DRGGSIResourceInventory_1.DRGGSIResourceInventory();
        this._players = new Map();
    }
    reset() {
        this._resources.reset();
        for (const player of this._players.values()) {
            player.Inventory.reset();
        }
    }
    handlePlayerJoin(data) {
        if (data.ID === undefined || data.PlayerName === undefined || data.IsLocal === undefined || data.IsHost === undefined)
            return false;
        if (this._players.has(data.ID))
            return true;
        const player = new DRGGSIPlayer_1.DRGGSIPlayer(data.ID, data.PlayerName, data.IsLocal, data.IsHost);
        this._players.set(data.ID, player);
        this.emit('Player.Join', data.ID, player);
        return true;
    }
    handlePlayerLeave(data) {
        if (!this._players.has(data.ID))
            return true;
        const player = this._players.get(data.ID);
        this.emit('Player.Leave', data.ID, player);
        this._players.delete(data.ID);
        return true;
    }
}
exports.DRGGSITeam = DRGGSITeam;
