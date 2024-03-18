class DRGGSIQueueEntry {
    set Content(newContent) { this._content = newContent; }
    ;
    constructor(type, messageType, socketID, targetModID) {
        this._type = type || 0;
        this._messageType = messageType || 'Unknown';
        this._socketID = socketID || '7F59BCDA4EF5A6DD5297728862049DDC';
        this._targetModID = targetModID || '00000000000000000000000000000000';
        this._content = '';
    }
    getFormatted() {
        return ((this._type.toString()) + (this._messageType.length.toString().padStart(4, '0')) + (this._messageType) + (this._socketID) + (this._targetModID) + (this._content));
    }
}
