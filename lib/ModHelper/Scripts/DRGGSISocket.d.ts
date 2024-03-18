declare class DRGGSISocket {
    private _socketID;
    private _tokenName;
    get TokenName(): string;
    private _tokenValue;
    get TokenValue(): string;
    private _openHandler;
    private _messageHandler;
    private _errorHandler;
    private _closeHandler;
    private _socket;
    constructor(socketID: string, tokenName: string, tokenValue: string, openHandler: any, messageHandler: any, errorHandler: any, closeHandler: any);
    connect(URI?: string): void;
    disconnect(reason?: string): void;
    cleanUp(): void;
    send(data: any): boolean;
}
