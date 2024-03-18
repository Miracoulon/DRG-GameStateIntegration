/// <reference types="node" />
import EventEmitter = require("events");
import { DRGGSIMission } from "./Mission/DRGGSIMission";
import { DRGGSIPlayer } from "./Team/Player/DRGGSIPlayer";
import { DRGGSISession } from "./Session/DRGGSISession";
import { DRGGSITeam } from "./Team/DRGGSITeam";
/**
 * A MessageHandler used to process a message with a given type.
 * Should return true if the message was processed successfully, otherwise false.
 * @param data The un-processed message to be handled by this MessageHandler
 * */
type DRGGSIMessageHandler = (data: any) => boolean;
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
    'raw': (message: any) => void;
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
declare class DRGGSI extends EventEmitter {
    private _options;
    private _messageHandlers;
    private _team;
    get Team(): DRGGSITeam;
    private _players;
    private _mission;
    get Mission(): DRGGSIMission;
    /** Whether the lobby is currently on the Spacerig.
     * Does not update during loading screens. */
    private _isOnSpacerig;
    get IsOnSpacerig(): boolean;
    private _session;
    get Session(): DRGGSISession;
    constructor(options: DRGGSIOptions);
    /**
     * Attempts to process the given data object as a DRG-GSI message.
     * @param data The data to process.
     * @returns True if the message was processed successfully, otherwise false.
     */
    digest(data: object): boolean;
    /**
     * Attempts to process the given data string as a DRG-GSI message.
     * @param data The data to process.
     * @returns True if the message was processed successfully, otherwise false.
     */
    digest(data: string): boolean;
    /**
     * Tries to find and return a player by a given ID
     * @param playerID The ID to search for
     * @returns The player if found, otherwise null
     */
    getPlayerByID(playerID: number): DRGGSIPlayer;
    /**
     * Tries to find and return a player by a given name
     * @param playerName The name to search for
     * @returns The player if found, otherwise null
     */
    getPlayerByName(playerName: string): DRGGSIPlayer;
    /**
     * Returns all players currently in the game
     * */
    getAllPlayers(): IterableIterator<DRGGSIPlayer>;
    /**
     * Whether a MessageHandler is registered for the given message type.
     * @param messageType The message type to check for.
     * @returns True if a MessageHandler exists for the message type.
     */
    hasMessageHandler(messageType: any): boolean;
    /**
     * Adds a MessageHandler for a given message type.
     * If a MessageHandler for the specified type already exists no new MessageHandler will be set.
     * @param messageType The message type to add the MessageHandler for.
     * @param messageHandler The MessageHandler to add.
     * @returns True if added successfully, otherwise false.
     */
    addMessageHandler(messageType: string, messageHandler: DRGGSIMessageHandler): boolean;
    /**
     * Removes a MessageHandler for a given message type.
     * @param messageType The message type to remove the MessageHandler for.
     * @returns True if a MessageHandler was removed, otherwise false.
     */
    removeMessageHandler(messageType: string): boolean;
    getHelperPath(helperFile: string): string;
    /**
     * Checks whether a token with TokenName:TokenValue exists.
     * @param tokenName The name of the token to check for.
     * @param tokenValue The value of the token to check for.
     * @returns True if no token is expected or the given token was found, otherwise false.
     */
    private checkAuth;
    private addDefaultMessageHandlers;
}
export { DRGGSI, DRGGSIOptions };
