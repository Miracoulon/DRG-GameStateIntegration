import EventEmitter = require("events");
import { ESessionVisibility } from "./ESessionVisibility";

interface DRGGSISessionEvents {
    /** Emitted when the session settings get updated */
    'Session.Info.Changed': () => void;
}

declare interface DRGGSISession {
    on<U extends keyof DRGGSISessionEvents>(event: U, listener: DRGGSISessionEvents[U]): this;
    emit<U extends keyof DRGGSISessionEvents>(event: U, ...args: Parameters<DRGGSISessionEvents[U]>): boolean;
}


class DRGGSISession extends EventEmitter {
    private _sessionVisibility: ESessionVisibility;
    /** The visibility of this DRGGSISession as used by the games server browser */
    public get Visibility(): ESessionVisibility { return this._sessionVisibility; };
    private _serverID: string;
    /** The ID of the server as assigned by the session system */
    public get ServerID(): string { return this._serverID; };
    private _hostID: string;
    /** The SteamID of the hosting player of this session */
    public get HostID(): string { return this._hostID; };
    private _isPassworded: boolean;
    /** Whether this session is protected by a password */
    public get IsPassworded(): boolean { return this._isPassworded; };
    private _serverName: string;
    /** The name of the server running this session as displayed in the server browser */
    public get ServerName(): string { return this._serverName; };

    public constructor() {
        super();

        this._sessionVisibility = ESessionVisibility.SOLO;
        this._serverID = '';
        this._hostID = '';
        this._isPassworded = true;
        this._serverName = '';
    }

    /**
     * Returns the invite link to this session.
     * Will return null if the Visibility of this session is ESessionVisibility.SOLO
     * @returns {string | null} The invite link to this session if available, otherwise null.
     * */
    public getInviteLink(): string | null {
        if (this._sessionVisibility === ESessionVisibility.SOLO) return null;
        if (this._serverID === '' || this._hostID === '') return null;
        return 'steam://joinlobby/548430/' + this._serverID + '/' + this._hostID;
    }

    public handleInfoChanged(data): boolean {
        this._serverID = data.ServerID || '';
        this._hostID = data.HostID || '';

        if (data.IsSolo === undefined || data.IsSolo === null || data.IsPrivate === undefined || data.IsPrivate === null) {
            this._sessionVisibility = ESessionVisibility.SOLO;
        }
        else {
            if (data.IsSolo) this._sessionVisibility = ESessionVisibility.SOLO;
            else if (data.IsPrivate) this._sessionVisibility = ESessionVisibility.PRIVATE;
            else this._sessionVisibility = ESessionVisibility.PUBLIC;
        }

        this._serverName = data.Name || 'Unknown';
        this._isPassworded = data.Passworded;

        this.emit('Session.Info.Changed');
        return true;
    }
}

export { DRGGSISession };