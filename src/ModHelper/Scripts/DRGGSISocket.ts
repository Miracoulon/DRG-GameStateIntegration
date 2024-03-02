class DRGGSISocket {
    private _socketID: string;
    private _tokenName: string;
    public get TokenName(): string { return this._tokenName; };
    private _tokenValue: string;
    public get TokenValue(): string { return this._tokenValue; };

    private _openHandler;
    private _messageHandler;
    private _errorHandler;
    private _closeHandler;

    private _socket: WebSocket;

    constructor(socketID: string, tokenName: string, tokenValue: string, openHandler, messageHandler, errorHandler, closeHandler) {
        this._socketID = socketID || '7F59BCDA4EF5A6DD5297728862049DDC';
        this._tokenName = tokenName || '';
        this._tokenValue = tokenValue || '';

        openHandler ? this._openHandler = openHandler.bind(null, this._socketID) : this._openHandler = null;
        messageHandler ? this._messageHandler = messageHandler.bind(null, this._socketID) : this._messageHandler = null;
        errorHandler ? this._errorHandler = errorHandler.bind(null, this._socketID) : this._errorHandler = null;
        closeHandler ? this._closeHandler = closeHandler.bind(null, this._socketID) : this._closeHandler = null;

        this._socket = null;
    }

    public connect(URI: string = 'ws://localhost:7664') {
        if (!URI || URI.length <= 0) throw new Error('DRGGSISocket: URI is required to connect');
        if (this._socket) this.disconnect();
        this._socket = new WebSocket(URI);
        this._openHandler ? this._socket.addEventListener('open', this._openHandler) : undefined;
        this._messageHandler ? this._socket.addEventListener('message', this._messageHandler) : undefined;
        this._errorHandler ? this._socket.addEventListener('error', this._errorHandler) : undefined;
        this._closeHandler ? this._socket.addEventListener('close', this._closeHandler) : undefined;
    }

    public disconnect(reason: string = 'Client requested disconnect') {
        if (!this._socket) return;
        this._socket.close(1000, reason);
    }

    public cleanUp() {
        if (this._openHandler) this._socket.removeEventListener('open', this._openHandler);
        if (this._messageHandler) this._socket.removeEventListener('message', this._messageHandler);
        if (this._errorHandler) this._socket.removeEventListener('error', this._errorHandler);
        if (this._closeHandler) this._socket.removeEventListener('close', this._closeHandler);
        this._socket = null;
    }

    public send(data) {
        if (!this._socket) return false;
        if (!(this._socket.readyState === WebSocket.OPEN)) return false;
        this._socket.send(data);
        return true;
    }
}