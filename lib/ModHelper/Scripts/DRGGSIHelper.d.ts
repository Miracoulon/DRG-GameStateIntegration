declare const sockets: Map<string, DRGGSISocket>;
declare const messageQueue: DRGGSIQueue;
/** Called by the GSI module of the Miracle Mod Manager. */
declare function update(): void;
/**
 * Writes an error to the message queue to be read by the GSI module of the Miracle Mod Manager.
 * @param {string} message The error message to write.
 * @param {string} socketID The ID of the socket that generated this error. Uses the broadcast ID if no socket ID is specified.
 */
declare function writeError(message: string, socketID: string): void;
/**
 * Attempts to send a message to the specified socket.
 * @param {string} socketID The ID of the socket to send to.
 * @param {string} messageType The type of the message to send.
 * @param {string | object} message The actual content of the message.
 */
declare function sendDirect(socketID: string, messageType: string, message: string | object): void;
/**
 * Attempts to send a message to all specified sockets.
 * @param {Array<string>} socketIDs The list of socket IDs to send to.
 * @param {string} messageType The type of the message to send.
 * @param {string | object} message The actual content of the message.
 */
declare function sendMulti(socketIDs: Array<string>, messageType: string, message: string | object): void;
declare function handleSocketOpen(socketID: string): void;
declare function handleSocketMessage(socketID: string, message: any): void;
declare function handleSocketError(socketID: string, error: any): void;
declare function handleSocketClose(socketID: string, closeEvent: any): void;
/**
 * Creates and prepares a socket.
 * Attempts to connect it to the given URI.
 * @param {string} socketID The ID of the socket to connect.
 * @param {string} tokenName The name of the auth token.
 * @param {string} tokenValue The value of the auth token.
 * @param {string} URI The URI to connect to.
 */
declare function connect(socketID: string, tokenName: string, tokenValue: string, URI?: string): void;
/**
 * Disconnects a socket with the given ID if it exists.
 * @param {string} socketID The ID of the socket to disconnect.
 * @param {string} reason The reason the socket is disconnecting.
 */
declare function disconnect(socketID: string, reason?: string): void;
