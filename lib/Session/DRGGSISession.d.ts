/// <reference types="node" />
import EventEmitter = require("events");
import { ESessionVisibility } from "./ESessionVisibility";
interface DRGGSISessionEvents {
    /** Emitted when the session settings get updated */
    'Info.Changed': () => void;
}
declare interface DRGGSISession {
    on<U extends keyof DRGGSISessionEvents>(event: U, listener: DRGGSISessionEvents[U]): this;
    emit<U extends keyof DRGGSISessionEvents>(event: U, ...args: Parameters<DRGGSISessionEvents[U]>): boolean;
}
declare class DRGGSISession extends EventEmitter {
    private _sessionVisibility;
    /** The visibility of this DRGGSISession as used by the games server browser */
    get Visibility(): ESessionVisibility;
    private _serverID;
    /** The ID of the server as assigned by the session system */
    get ServerID(): string;
    private _hostID;
    /** The SteamID of the hosting player of this session */
    get HostID(): string;
    private _isPassworded;
    /** Whether this session is protected by a password */
    get IsPassworded(): boolean;
    private _serverName;
    /** The name of the server running this session as displayed in the server browser */
    get ServerName(): string;
    constructor();
    /**
     * Returns the invite link to this session.
     * Will return null if the Visibility of this session is ESessionVisibility.SOLO
     * @returns {string | null} The invite link to this session if available, otherwise null.
     * */
    getInviteLink(): string | null;
    handleInfoChanged(data: any): boolean;
}
export { DRGGSISession };
