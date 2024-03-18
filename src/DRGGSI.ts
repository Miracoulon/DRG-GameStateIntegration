import EventEmitter = require("events");
import { DRGGSIMission } from "./Mission/DRGGSIMission";
import { DRGGSIPlayer } from "./Team/Player/DRGGSIPlayer";
import { DRGGSISession } from "./Session/DRGGSISession";
import { DRGGSISupplyPod } from "./Mission/SupplyPod/DRGGSISupplyPod";
import { DRGGSITeam } from "./Team/DRGGSITeam";
import path = require("path");

/**
 * A MessageHandler used to process a message with a given type.
 * Should return true if the message was processed successfully, otherwise false.
 * @param data The un-processed message to be handled by this MessageHandler
 * */
type DRGGSIMessageHandler = (data) => boolean;

interface DRGGSIOptions {
    /**
     * A single token formatted as Name:Value or multiple tokens as a map of Name <-> Value.
     * If provided and not an empty string or empty map will check each message if a matching token is present.
     * If no matching to is found the message is discarded.
     * Defaults to empty.
     * */
    Tokens?: string | Map<string, string>;
    /**
     * A map of message handlers to start with.
     * If null no custom message handlers will be registered at startup.
     * Defaults to null.
     * */
    MessageHandlers?: Map<string, DRGGSIMessageHandler> | null;
    /**
     * Whether the default MessageHandlers should be registered.
     * If false custom MessageHandlers must be registered for all events manually.
     * Defaults to true.
     * */
    UseDefaultHandlers: boolean;
}


interface DRGGSIEvents {
    /**
     * Emitted when an error occurs.
     * @param message A message describing the error.
     */
    'error': (message: string) => void;
    /**
     * Emitted when a new status message is available.
     * @param message A message describing what happened.
     */
    'info': (message: string) => void;

    /**
     * Emitted when any new message arrives.
     * Emitted *before* the message has been processed.
     * @param message The message that just arrived.
     */
    'raw': (message) => void;

    /** 
     * Emitted each time a connection is established.
     * @param providerName The name of the GSI module provider. In case of the Miracle Mod Manager should always be "Miracle - DRG - GSI".
     * @param providerID The ID of the mod running the GSI module.
     * @param providerVersion The version of the GSI module.
     * @param providerSteamID The SteamID of the player that openend this connection.
     */
    'GSI.Provider': (providerName: string, providerID: string, providerVersion: string, providerSteamID: string) => void;

    /**
     * Emitted each time a new level loads.
     * @param levelName The name of the level.
     * @param IsOnSpacerig Whether this level is the Spacerig.
     */
    'GSI.LevelTransition': (levelName: string, IsOnSpacerig: boolean) => void;
}

declare interface DRGGSI {
    on<U extends keyof DRGGSIEvents>(event: U, listener: DRGGSIEvents[U]): this;
    emit<U extends keyof DRGGSIEvents>(event: U, ...args: Parameters<DRGGSIEvents[U]>): boolean;
}


/**
 * Event based Game State Integration handler for the Miracle Mod Manager for Deep Rock Galactic.
 * */
class DRGGSI extends EventEmitter {
    private _options: DRGGSIOptions = { Tokens: '', MessageHandlers: null, UseDefaultHandlers: true };

    private _messageHandlers: Map<string, DRGGSIMessageHandler>;


    private _team: DRGGSITeam;
    public get Team(): DRGGSITeam { return this._team; };

    private _players: Map<number, DRGGSIPlayer>;
    private _mission: DRGGSIMission;
    public get Mission(): DRGGSIMission { if (this._mission === null) this._mission = new DRGGSIMission(); return this._mission; };

    /** Whether the lobby is currently on the Spacerig.
     * Does not update during loading screens. */
    private _isOnSpacerig: boolean;
    public get IsOnSpacerig(): boolean { return this._isOnSpacerig; };

    private _session: DRGGSISession;
    public get Session(): DRGGSISession { return this._session; };


    constructor(options: DRGGSIOptions) {
        super();
        this._options.Tokens = options.Tokens || '';
        this._messageHandlers = options.MessageHandlers || new Map<string, DRGGSIMessageHandler>();
        this._options.UseDefaultHandlers = (options.UseDefaultHandlers === undefined || options.UseDefaultHandlers === null);

        this._team = new DRGGSITeam();

        this._players = new Map<number, DRGGSIPlayer>();
        if (this._mission === null) this._mission = new DRGGSIMission();
        this._session = new DRGGSISession();

        if (this._options.UseDefaultHandlers) this.addDefaultMessageHandlers();
    }


    /**
     * Attempts to process the given data object as a DRG-GSI message.
     * @param data The data to process.
     * @returns True if the message was processed successfully, otherwise false.
     */
    public digest(data: object): boolean;
    /**
     * Attempts to process the given data string as a DRG-GSI message.
     * @param data The data to process.
     * @returns True if the message was processed successfully, otherwise false.
     */
    public digest(data: string): boolean;
    public digest(data: object | string): boolean {
        if (!data) return false;

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

        if (!raw) return false;
        if (!raw.Token) return false;
        if (!raw.Token.Name) return false;
        if (!raw.Token.Value) return false;
        if (!this.checkAuth(raw.Token.Name, raw.Token.Value)) return false;
        this.emit('raw', raw);
        if (!raw.Type) return false;
        if (!raw.Data) return false;
        if (!this._messageHandlers.has(raw.Type)) return false;
        try {
            const messageHandler = this._messageHandlers.get(raw.Type);
            return messageHandler(raw.Data);
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
    public getPlayerByID(playerID: number): DRGGSIPlayer {
        if (playerID === undefined) return null;
        if (!this._players.has(playerID)) return null;
        return this._players.get(playerID);
    }

    /**
     * Tries to find and return a player by a given name
     * @param playerName The name to search for
     * @returns The player if found, otherwise null
     */
    public getPlayerByName(playerName: string): DRGGSIPlayer {
        if (playerName === undefined || playerName.length <= 0) return null;
        for (const player of this._players) {
            if (player[1].PlayerName === playerName)
                return player[1];
        }
        return null;
    }

    /**
     * Returns all players currently in the game
     * */
    public getAllPlayers() {
        return this._players.values();
    }


    /**
     * Whether a MessageHandler is registered for the given message type.
     * @param messageType The message type to check for.
     * @returns True if a MessageHandler exists for the message type.
     */
    public hasMessageHandler(messageType): boolean {
        if (!messageType) return false;
        return this._messageHandlers.has(messageType);
    }

    /**
     * Adds a MessageHandler for a given message type.
     * If a MessageHandler for the specified type already exists no new MessageHandler will be set.
     * @param messageType The message type to add the MessageHandler for.
     * @param messageHandler The MessageHandler to add.
     * @returns True if added successfully, otherwise false.
     */
    public addMessageHandler(messageType: string, messageHandler: DRGGSIMessageHandler): boolean {
        if (!messageType) return false;
        if (!messageHandler) return false;
        if (this._messageHandlers.has(messageType)) return false;
        this._messageHandlers.set(messageType, messageHandler);
        return false;
    }

    /**
     * Removes a MessageHandler for a given message type.
     * @param messageType The message type to remove the MessageHandler for.
     * @returns True if a MessageHandler was removed, otherwise false.
     */
    public removeMessageHandler(messageType: string): boolean {
        if (messageType) return false;
        if (!this._messageHandlers.has(messageType)) return false;
        this._messageHandlers.delete(messageType);
        return true;
    }

    public getHelperPath(helperFile: string): string {
        if (helperFile.endsWith('.js')) {
            return path.join(__dirname, 'ModHelper', 'Scripts', helperFile);
        }
        return path.join(__dirname, 'ModHelper', helperFile + (helperFile.endsWith('.html') ? '' :'.hmtl'));
    }

    /**
     * Checks whether a token with TokenName:TokenValue exists.
     * @param tokenName The name of the token to check for.
     * @param tokenValue The value of the token to check for.
     * @returns True if no token is expected or the given token was found, otherwise false.
     */
    private checkAuth(tokenName, tokenValue): boolean {
        if (this._options.Tokens) {
            if (typeof (this._options.Tokens) === 'string') {
                return ((tokenName + ':' + tokenValue) === this._options.Tokens);
            }
            else {
                if (!this._options.Tokens.has(tokenName)) return false;
                return this._options.Tokens.get(tokenName) === tokenValue;
            }
        }
        return true;
    }


    private addDefaultMessageHandlers() {
        this.addMessageHandler('GSI.Provider', (data) => {
            if (data.Name === undefined || data.ID === undefined || data.Version === undefined || data.SteamID === undefined) return false;
            this.emit('GSI.Provider', data.Name, data.ID, data.Version, data.SteamID);
            return true;
        });

        this.addMessageHandler('GSI.LevelTransition', (data) => {
            if (data.Level === undefined || data.IsOnSpacerig === undefined) return false;
            this._isOnSpacerig = data.IsOnSpacerig;
            if (this._isOnSpacerig) {
                this._mission.reset();
            } else {
                
            }
            this._team.reset();
            this.emit('GSI.LevelTransition', data.Level, data.IsOnSpacerig);
            return true;
        });


        this.addMessageHandler('Player.Join', this._team.handlePlayerJoin);
        this.addMessageHandler('Player.Leave', this._team.handlePlayerLeave);

        this.addMessageHandler('Player.ClassChanged', (data) => {
            const player = this._team.getPlayerByID(data.ID);
            if (player) return player.handleClassChange(data);
            return false;
        });

        this.addMessageHandler('Player.HealthInfo', (data) => {
            const player = this._team.getPlayerByID(data.ID);
            if (player) return player.handleHealthInfo(data);
            return false;
        });

        this.addMessageHandler('Player.State', (data) => {
            const player = this._team.getPlayerByID(data.ID);
            if (player) return player.handlePlayerState(data);
            return false;
        })

        this.addMessageHandler('Player.Inventory.Changed', (data) => {
            const player = this._team.getPlayerByID(data.ID);
            if (player) return player.handleInventoryChanged(data);
            return false;
        });

        this.addMessageHandler('Player.Iventory.Snapshot', (data) => {
            const player = this._team.getPlayerByID(data.ID);
            if (player) return player.handleInventorySnapshot(data);
            return false;
        });

        this.addMessageHandler('Player.SupplyStatusChanged', (data) => {
            const player = this._team.getPlayerByID(data.ID);
            if (player) return player.handleSupplyStatusChanged(data);
            return false;
        });

        this.addMessageHandler('Mission.Time', this.Mission.handleMissionTime);
        this.addMessageHandler('Mission.Info', this.Mission.handleMissionInfo);

        this.addMessageHandler('Droppod.StateChanged', (data) => {
            if (this._isOnSpacerig) { return false; }
            else { return this._mission.handleDropPodInfo(data); }
        });

        this.addMessageHandler('SupplyPod.Charges.Changed', this.Mission.handleSupplyPodCharges);
        this.addMessageHandler('SupplyPod.State.Changed', this.Mission.handleSupplyPodStateChanged);
        this.addMessageHandler('SupplyPod.Ordered', this.Mission.handleSupplyPodOrdered);

        this.addMessageHandler('Session.Info.Changed', this.Session.handleInfoChanged);
    }
}

export { DRGGSI, DRGGSIOptions };