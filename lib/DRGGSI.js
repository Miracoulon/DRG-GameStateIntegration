"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DRGGSI = void 0;
const EventEmitter = require("events");
const DRGGSIMission_1 = require("./DRGGSIMission");
const DRGGSIPlayer_1 = require("./Player/DRGGSIPlayer");
/**
 * Event based Game State Integration handler for the Miracle Mod Manager for Deep Rock Galactic.
 * */
class DRGGSI extends EventEmitter {
    get Mission() { if (this._mission === null)
        this._mission = new DRGGSIMission_1.DRGGSIMission(); return this._mission; }
    ;
    constructor(options) {
        super();
        this._options = { Tokens: '', MessageHandlers: null, UseDefaultHandlers: true };
        this._options.Tokens = options.Tokens || '';
        this._messageHandlers = options.MessageHandlers || new Map();
        this._options.UseDefaultHandlers = (options.UseDefaultHandlers === undefined || options.UseDefaultHandlers === null);
        this._players = new Map();
        if (this._mission === null)
            this._mission = new DRGGSIMission_1.DRGGSIMission();
        if (this._options.UseDefaultHandlers)
            this.addDefaultMessageHandlers();
    }
    digest(data) {
        if (!data)
            return false;
        let raw = null;
        if (typeof (data) === 'string') {
            try {
                raw = JSON.parse(data);
            }
            catch (e) {
                this.emit('error', `Failed to parse message: "${e.message}"`);
                return false;
            }
        }
        else {
            raw = data;
        }
        if (!raw)
            return false;
        if (!raw.Token)
            return false;
        if (!raw.Token.Name)
            return false;
        if (!raw.Token.Value)
            return false;
        if (!this.checkAuth(raw.Token.Name, raw.Token.Value))
            return false;
        this.emit('raw', raw);
        if (!raw.Type)
            return false;
        if (!this._messageHandlers.has(raw.Type))
            return false;
        try {
            const messageHandler = this._messageHandlers.get(raw.Type);
            return messageHandler(raw);
        }
        catch (e) {
            this.emit('error', `Failed to handle message: "${e.message}"`);
            return false;
        }
    }
    /**
     * Tries to find and return a player by a given ID
     * @param playerID The ID to search for
     * @returns The player if found, otherwise null
     */
    getPlayerByID(playerID) {
        if (playerID === undefined)
            return null;
        if (!this._players.has(playerID))
            return null;
        return this._players.get(playerID);
    }
    /**
     * Tries to find and return a player by a given name
     * @param playerName The name to search for
     * @returns The player if found, otherwise null
     */
    getPlayerByName(playerName) {
        if (playerName === undefined || playerName.length <= 0)
            return null;
        for (const player of this._players) {
            if (player[1].PlayerName === playerName)
                return player[1];
        }
        return null;
    }
    /**
     * Returns all players currently in the game
     * */
    getAllPlayers() {
        return this._players.values();
    }
    /**
     * Whether a MessageHandler is registered for the given message type.
     * @param messageType The message type to check for.
     * @returns True if a MessageHandler exists for the message type.
     */
    hasMessageHandler(messageType) {
        if (!messageType)
            return false;
        return this._messageHandlers.has(messageType);
    }
    /**
     * Adds a MessageHandler for a given message type.
     * If a MessageHandler for the specified type already exists no new MessageHandler will be set.
     * @param messageType The message type to add the MessageHandler for.
     * @param messageHandler The MessageHandler to add.
     * @returns True if added successfully, otherwise false.
     */
    addMessageHandler(messageType, messageHandler) {
        if (!messageType)
            return false;
        if (!messageHandler)
            return false;
        if (this._messageHandlers.has(messageType))
            return false;
        this._messageHandlers.set(messageType, messageHandler);
        return false;
    }
    /**
     * Removes a MessageHandler for a given message type.
     * @param messageType The message type to remove the MessageHandler for.
     * @returns True if a MessageHandler was removed, otherwise false.
     */
    removeMessageHandler(messageType) {
        if (messageType)
            return false;
        if (!this._messageHandlers.has(messageType))
            return false;
        this._messageHandlers.delete(messageType);
        return true;
    }
    /**
     * Checks whether a token with TokenName:TokenValue exists.
     * @param tokenName The name of the token to check for.
     * @param tokenValue The value of the token to check for.
     * @returns True if no token is expected or the given token was found, otherwise false.
     */
    checkAuth(tokenName, tokenValue) {
        if (this._options.Tokens) {
            if (typeof (this._options.Tokens) === 'string') {
                return ((tokenName + ':' + tokenValue) === this._options.Tokens);
            }
            else {
                if (!this._options.Tokens.has(tokenName))
                    return false;
                return this._options.Tokens.get(tokenName) === tokenValue;
            }
        }
        return true;
    }
    addDefaultMessageHandlers() {
        this.addMessageHandler('GSI.Provider', (data) => {
            if (data.Name === undefined || data.ID === undefined || data.Version === undefined || data.SteamID === undefined)
                return false;
            this.emit('GSI.Provider', data.Name, data.ID, data.Version, data.SteamID);
            return true;
        });
        this.addMessageHandler('Player.Join', (data) => {
            if (data.ID === undefined || data.PlayerName === undefined || data.IsLocal === undefined || data.IsHost === undefined)
                return false;
            if (this._players.has(data.ID))
                return true;
            const player = new DRGGSIPlayer_1.DRGGSIPlayer(data.ID, data.PlayerName, data.IsLocal, data.IsHost);
            this._players.set(data.ID, player);
            this.emit('Player.Join', data.ID, player);
            return true;
        });
        this.addMessageHandler('Player.Leave', (data) => {
            if (!this._players.has(data.ID))
                return true;
            const player = this._players.get(data.ID);
            this.emit('Player.Leave', data.ID, player);
            this._players.delete(data.ID);
            return true;
        });
        this.addMessageHandler('Player.ClassChanged', (data) => {
            const player = this.getPlayerByID(data.ID);
            if (player)
                return player.handleClassChange(data);
            return false;
        });
        this.addMessageHandler('Player.HealthInfo', (data) => {
            const player = this.getPlayerByID(data.ID);
            if (player)
                return player.handleHealthInfo(data);
            return false;
        });
        this.addMessageHandler('Player.State', (data) => {
            const player = this.getPlayerByID(data.ID);
            if (player)
                return player.handlePlayerState(data);
            return false;
        });
        this.addMessageHandler('Player.Inventory.Changed', (data) => {
            const player = this.getPlayerByID(data.ID);
            if (player)
                return player.handleInventoryChanged(data);
            return false;
        });
        this.addMessageHandler('Player.Iventory.Snapshot', (data) => {
            const player = this.getPlayerByID(data.ID);
            if (player)
                return player.handleInventorySnapshot(data);
            return false;
        });
        this.addMessageHandler('Player.SupplyStatusChanged', (data) => {
            const player = this.getPlayerByID(data.ID);
            if (player)
                return player.handleSupplyStatusChanged(data);
            return false;
        });
        this.addMessageHandler('Mission.Time', this.Mission.handleMissionTime);
        this.addMessageHandler('Mission.Info', this.Mission.handleMissionInfo);
    }
}
exports.DRGGSI = DRGGSI;
