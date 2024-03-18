declare class DRGGSIQueueEntry {
    private _type;
    private _messageType;
    private _socketID;
    private _targetModID;
    private _content;
    set Content(newContent: string);
    constructor(type: number, messageType: string, socketID?: string, targetModID?: string);
    getFormatted(): string;
}
