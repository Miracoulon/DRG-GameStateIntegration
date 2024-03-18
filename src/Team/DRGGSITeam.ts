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

class DRGGSITeam extends EventEmitter {
    private _resources: DRGGSIResourceInventory;
    public get Resources(): DRGGSIResourceInventory { return this._resources; };

    private _players: Map<number, DRGGSIPlayer>;
    public get Players(): Map<number, DRGGSIPlayer> { return this._players; };
    public getPlayerByID(ID: number): DRGGSIPlayer { if (this._players.has(ID)) { return this._players.get(ID); } return null; };

    constructor() {
        super();

        this._resources = new DRGGSIResourceInventory();
        this._players = new Map<number, DRGGSIPlayer>();
    }

    public reset() {
        this._resources.reset();
        for (const player of this._players.values()) {
            player.Inventory.reset();
        }
    }

    public handlePlayerJoin(data): boolean {
        if (data.ID === undefined || data.PlayerName === undefined || data.IsLocal === undefined || data.IsHost === undefined) return false;
        if (this._players.has(data.ID)) return true;
        const player = new DRGGSIPlayer(data.ID, data.PlayerName, data.IsLocal, data.IsHost);
        this._players.set(data.ID, player);
        this.emit('Player.Join', data.ID, player);
        return true;
    }

    public handlePlayerLeave(data): boolean {
        if (!this._players.has(data.ID)) return true;
        const player = this._players.get(data.ID);
        this.emit('Player.Leave', data.ID, player);
        this._players.delete(data.ID);
        return true;
    }
}

export { DRGGSITeam };