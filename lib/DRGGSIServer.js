"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DRGGSIServer = void 0;
const EventEmitter = require("events");
const ws_1 = require("ws");
const WebSocket = require("ws");
const DRGGSI_1 = require("./DRGGSI");
/**
 * A WebSocketServer implementation fo the DRG GSI Module for the Miracle Mod Manager.
 * Uses 'ws' (https://github.com/websockets/ws) as the WebSocketServer
 * */
class DRGGSIServer extends EventEmitter {
    /** The DRGGSI instance used by this server */
    get GSI() { return this._gsi; }
    ;
    /** Whether this server has completed its setup and is either listening on its own or waiting for the external server to start listening */
    get IsReady() { return this._isReady; }
    ;
    constructor(Options, GSIOptions) {
        super();
        this._webSocketServer = null;
        this._gsi = null;
        this._isReady = false;
        this._options = Options || { WebSocketServer: null, Port: 7664, ExternalServer: null };
        if (!this._options.WebSocketServer && !this._options.ExternalServer && !this._options.Port) {
            this.emit('error', `Failed setting up DRGGSIServer: "Exactly one option must be provided: 'WebSocketServer', 'ExternalServer' or 'Port'`);
            return this;
        }
        try {
            if (this._options.WebSocketServer) {
                this._webSocketServer = this._options.WebSocketServer;
            }
            else {
                if (this._options.ExternalServer) {
                    this._webSocketServer = new ws_1.WebSocketServer({ server: this._options.ExternalServer, handleProtocols: this.handleProtocols });
                }
                else {
                    if (!this._options.Port)
                        this._options.Port = 7664;
                    this._webSocketServer = new ws_1.WebSocketServer({ port: this._options.Port, handleProtocols: this.handleProtocols });
                }
            }
        }
        catch (e) {
            this.emit('error', `Failed setting up DRGGSIServer: "${e.message}"`);
            return this;
        }
        if (!this._webSocketServer) {
            this.emit('error', 'Failed setting up DRGGSIServer: "WebSocketServer is null"');
            return this;
        }
        this._connectionHandler = this.connectionHandler.bind(this);
        this._errorHandler = this.errorHandler.bind(this);
        this._socketErrorHandler = this.socketErrorHandler.bind(this);
        this._socketCloseHandler = this.socketCloseHandler.bind(this);
        this._socketMessageHandler = this.socketMessageHandler.bind(this);
        this._webSocketServer.on('connection', this._connectionHandler);
        this._webSocketServer.on('error', this._errorHandler);
        this._gsi = new DRGGSI_1.DRGGSI(GSIOptions);
        this._isReady = true;
    }
    /**
     * Sends a message to all connected clients.
     * Clients of which the readyState is not OPEN will be ignored.
     * @param message The message to send
     */
    send(message) {
        if (!this._webSocketServer)
            return false;
        for (const socket of this._webSocketServer.clients) {
            if (socket.readyState !== WebSocket.OPEN)
                continue;
            socket.send(message, (e) => {
                this.emit('error', `Failed sending message to socket: "${e.message}"`);
            });
        }
    }
    handleProtocols(protocols, request) {
        if (!protocols || protocols.size <= 0)
            return false;
        if (protocols.has('MIRACLE.DRG.GSI'))
            return 'MIRACLE.DRG.GSI';
        return false;
    }
    connectionHandler(ws, request) {
        this.emit('info', `Incoming connection`);
        ws.on('error', this._socketErrorHandler);
        ws.on('close', this._socketCloseHandler);
        ws.on('message', this._socketMessageHandler);
    }
    errorHandler(error) {
        this.emit('error', `Encountered error during operation: "${error.message}"`);
    }
    socketErrorHandler(error) {
        this.emit('error', `Encountered error on WebSocket: "${error.message}"`);
    }
    socketCloseHandler(code, reason) {
        this.emit('info', `WebSocket connection closed: ${code} -> "${reason ? reason.toString('utf-8') : (code === 1000 ? 'Client disconnected' : 'Unknown')}"`);
    }
    socketMessageHandler(data, isBinary) {
        if (this._gsi) {
            try {
                this._gsi.digest(data);
            }
            catch (e) {
                this.emit('error', `Failed to read message: "${e.message}"`);
            }
        }
        else {
            this.emit('error', 'Failed to read message: "DRGGSI instance is null"');
        }
    }
}
exports.DRGGSIServer = DRGGSIServer;
