/// <reference types="node" />
import EventEmitter = require("events");
import { DRGGSIPlayer } from "./Player/DRGGSIPlayer";
import { DRGGSIResourceInventory } from "../ResourceInventory/DRGGSIResourceInventory";
interface DRGGSITeamEvents {
    /**
     * Emitted when a new player joins.
     * @param playerID The ID assigned to the player by the GSI module. Persistent for the duration they are in the game. May change on reconnect.
     * @param player The player that joined.
     */
    'Player.Join': (playerID: number, player: DRGGSIPlayer) => void;
    /**
     * Emitted when a player leaves the game.
     * May be called without a previous 'Player.Join' event in the case that they disconnect before spawning.
     * @param playerID The ID assigned to the player by the GSI module.
     * @param player The player that left the game.
     */
    'Player.Leave': (playerID: number, player: DRGGSIPlayer) => void;
}
declare interface DRGGSITeam {
    on<U extends keyof DRGGSITeamEvents>(event: U, listener: DRGGSITeamEvents[U]): this;
    emit<U extends keyof DRGGSITeamEvents>(event: U, ...args: Parameters<DRGGSITeamEvents[U]>): boolean;
}
declare class DRGGSITeam extends EventEmitter {
    private _resources;
    get Resources(): DRGGSIResourceInventory;
    private _players;
    get Players(): Map<number, DRGGSIPlayer>;
    getPlayerByID(ID: number): DRGGSIPlayer;
    constructor();
    reset(): void;
    handlePlayerJoin(data: any): boolean;
    handlePlayerLeave(data: any): boolean;
}
export { DRGGSITeam };
