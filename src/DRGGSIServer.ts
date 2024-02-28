import EventEmitter = require("events");
import { Server as HTTPServer, IncomingMessage } from "http";
import { Server as HTTPSServer } from "https";
import { WebSocketServer } from "ws";
import WebSocket = require("ws");
import { DRGGSI, DRGGSIOptions } from "./DRGGSI";

/**
 * Available options for a DRGGSIServer.
 * Exactly one of 'WebSocketServer', 'ExternalServer' or 'Port' must be set.
 * */
interface DRGGSIServerOptions {
    /** 
     * The WebSocketServer to use.
     * If null a new WebSocketServer will be openend.
     * Defaults to null.
     * */
    WebSocketServer: WebSocketServer | null;
    /**
     * If WebSocketServer is null this is the port that the new server will be openend on.
     * Defaults to 7664.
     * */
    Port: number | null;
    /**
     * An external server to use when creating a new WebSocketServer.
     * If not null will take priority over Port.
     * Defaults to null.
     * */
    ExternalServer: HTTPServer | HTTPSServer | null;
}

interface DRGGSIServerEvents {
    /**
     * Emitted when an error occurs on the server.
     * @param message A message describing the error.
     */
    'error': (message: string) => void;
    /**
     * Emitted when a new status message is available.
     * @param message A message describing what happened.
     */
    'info': (message: string) => void;
}

declare interface DRGGSIServer {
    on<U extends keyof DRGGSIServerEvents>(event: U, listener: DRGGSIServerEvents[U]): this;
    emit<U extends keyof DRGGSIServerEvents>(event: U, ...args: Parameters<DRGGSIServerEvents[U]>): boolean;
}


/**
 * A WebSocketServer implementation fo the DRG GSI Module for the Miracle Mod Manager.
 * Uses 'ws' (https://github.com/websockets/ws) as the WebSocketServer
 * */
class DRGGSIServer extends EventEmitter {
    private _options: DRGGSIServerOptions;
    private _webSocketServer: WebSocketServer = null;
    private _errorHandler: (error: Error) => void;
    private _connectionHandler: (ws: WebSocket, request: IncomingMessage) => void;
    private _socketErrorHandler: (error: Error) => void;
    private _socketCloseHandler: (code: number, reason: Buffer) => void;
    private _socketMessageHandler: (data: WebSocket.RawData, isBinary: boolean) => void;

    private _gsi: DRGGSI = null;
    /** The DRGGSI instance used by this server */
    public get GSI(): DRGGSI { return this._gsi; };

    private _isReady: boolean;
    /** Whether this server has completed its setup and is either listening on its own or waiting for the external server to start listening */
    public get IsReady(): boolean { return this._isReady; };

    constructor(Options: DRGGSIServerOptions, GSIOptions: DRGGSIOptions) {
        super();
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
                    this._webSocketServer = new WebSocketServer({ server: this._options.ExternalServer, handleProtocols: this.handleProtocols });
                }
                else {
                    if (!this._options.Port) this._options.Port = 7664;
                    this._webSocketServer = new WebSocketServer({ port: this._options.Port, handleProtocols: this.handleProtocols });
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

        this._gsi = new DRGGSI(GSIOptions);

        this._isReady = true;
    }

    /**
     * Sends a message to all connected clients.
     * Clients of which the readyState is not OPEN will be ignored.
     * @param message The message to send
     */
    public send(message: ArrayBuffer): boolean;
    /**
     * Sends a message to all connected clients.
     * Clients of which the readyState is not OPEN will be ignored.
     * @param message The message to send
     */
    public send(message: string): boolean;
    /**
     * Sends a message to all connected clients.
     * Clients of which the readyState is not OPEN will be ignored.
     * @param message The message to send
     */
    public send(message: string | ArrayBuffer): boolean {
        if (!this._webSocketServer) return false;
        for (const socket of this._webSocketServer.clients) {
            if (socket.readyState !== WebSocket.OPEN) continue;
            socket.send(message, (e: Error) => {
                this.emit('error', `Failed sending message to socket: "${e.message}"`);
            });
        }
    }



    private handleProtocols(protocols: Set<string>, request: IncomingMessage): string | false {
        if (!protocols || protocols.size <= 0) return false;
        if (protocols.has('MIRACLE.DRG.GSI')) return 'MIRACLE.DRG.GSI';
        return false;
    }

    

    private connectionHandler(ws: WebSocket, request: IncomingMessage) {
        this.emit('info', `Incoming connection`);
        ws.on('error', this._socketErrorHandler);
        ws.on('close', this._socketCloseHandler);
        ws.on('message', this._socketMessageHandler);
    }

    private errorHandler(error: Error) {
        this.emit('error', `Encountered error during operation: "${error.message}"`);
    }



    private socketErrorHandler(error: Error) {
        this.emit('error', `Encountered error on WebSocket: "${error.message}"`);
    }

    private socketCloseHandler(code: number, reason: Buffer) {
        this.emit('info', `WebSocket connection closed: ${code} -> "${reason ? reason.toString('utf-8') : (code === 1000 ? 'Client disconnected' : 'Unknown')}"`);
    }

    private socketMessageHandler(data: WebSocket.RawData, isBinary: boolean) {
        if (this._gsi) {
            try {
                this._gsi.digest(data as ArrayBuffer);
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

export { DRGGSIServer };