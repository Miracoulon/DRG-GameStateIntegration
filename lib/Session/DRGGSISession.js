"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DRGGSISession = void 0;
const EventEmitter = require("events");
const ESessionVisibility_1 = require("./ESessionVisibility");
class DRGGSISession extends EventEmitter {
    /** The visibility of this DRGGSISession as used by the games server browser */
    get Visibility() { return this._sessionVisibility; }
    ;
    /** The ID of the server as assigned by the session system */
    get ServerID() { return this._serverID; }
    ;
    /** The SteamID of the hosting player of this session */
    get HostID() { return this._hostID; }
    ;
    /** Whether this session is protected by a password */
    get IsPassworded() { return this._isPassworded; }
    ;
    /** The name of the server running this session as displayed in the server browser */
    get ServerName() { return this._serverName; }
    ;
    constructor() {
        super();
        this._sessionVisibility = ESessionVisibility_1.ESessionVisibility.SOLO;
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
    getInviteLink() {
        if (this._sessionVisibility === ESessionVisibility_1.ESessionVisibility.SOLO)
            return null;
        if (this._serverID === '' || this._hostID === '')
            return null;
        return 'steam://joinlobby/548430/' + this._serverID + '/' + this._hostID;
    }
    handleInfoChanged(data) {
        this._serverID = data.ServerID || '';
        this._hostID = data.HostID || '';
        if (data.IsSolo === undefined || data.IsSolo === null || data.IsPrivate === undefined || data.IsPrivate === null) {
            this._sessionVisibility = ESessionVisibility_1.ESessionVisibility.SOLO;
        }
        else {
            if (data.IsSolo)
                this._sessionVisibility = ESessionVisibility_1.ESessionVisibility.SOLO;
            else if (data.IsPrivate)
                this._sessionVisibility = ESessionVisibility_1.ESessionVisibility.PRIVATE;
            else
                this._sessionVisibility = ESessionVisibility_1.ESessionVisibility.PUBLIC;
        }
        this._serverName = data.Name || 'Unknown';
        this._isPassworded = data.Passworded;
        this.emit('Info.Changed');
        return true;
    }
}
exports.DRGGSISession = DRGGSISession;
