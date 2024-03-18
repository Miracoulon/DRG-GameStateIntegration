const sockets = new Map();
const messageQueue = new DRGGSIQueue();
window.addEventListener('load', () => {
    const entry = new DRGGSIQueueEntry(1, 'GSI.Ready');
    messageQueue.enqueue(entry);
});
/** Called by the GSI module of the Miracle Mod Manager. */
function update() {
    if (messageQueue.isEmpty) {
        document.title = '';
        return;
    }
    const entry = messageQueue.dequeue();
    document.title = entry.getFormatted();
}
/**
 * Writes an error to the message queue to be read by the GSI module of the Miracle Mod Manager.
 * @param {string} message The error message to write.
 * @param {string} socketID The ID of the socket that generated this error. Uses the broadcast ID if no socket ID is specified.
 */
function writeError(message, socketID) {
    const entry = new DRGGSIQueueEntry(1, 'GSI.Error', socketID);
    entry.Content = message;
    messageQueue.enqueue(entry);
}
/**
 * Attempts to send a message to the specified socket.
 * @param {string} socketID The ID of the socket to send to.
 * @param {string} messageType The type of the message to send.
 * @param {string | object} message The actual content of the message.
 */
function sendDirect(socketID, messageType, message) {
    if (!socketID) {
        writeError('DRGGSI: SocketID must be set to send data', socketID);
        return;
    }
    if (!message)
        return;
    if (!sockets.has(socketID)) {
        writeError(`DRGGSI: "${socketID}" is not an active socket`, socketID);
        return;
    }
    const socket = sockets.get(socketID);
    try {
        const data = {
            Type: 'GSI.Generic',
            Token: {
                Name: '',
                Value: ''
            },
            Data: {},
        };
        data.Type = messageType || 'GSI.Generic';
        data.Token.Name = socket.TokenName;
        data.Token.Value = socket.TokenValue;
        if (typeof (message) === 'object') {
            data.Data = message;
        }
        else if (typeof (message) === 'string') {
            data.Data = JSON.parse(message);
        }
        else {
            writeError(`DRGGSI: Message must be either string or object`, socketID);
        }
        const result = JSON.stringify(data);
        if (!socket.send(result)) {
            writeError(`DRGGSI: Failed sending data to "${socketID}"`, socketID);
        }
    }
    catch (e) {
        writeError(`DRGGSI: Failed to send message "${e.message}"`, socketID);
    }
}
/**
 * Attempts to send a message to all specified sockets.
 * @param {Array<string>} socketIDs The list of socket IDs to send to.
 * @param {string} messageType The type of the message to send.
 * @param {string | object} message The actual content of the message.
 */
function sendMulti(socketIDs, messageType, message) {
    if (!socketIDs || socketIDs.length <= 0) {
        writeError('DRGGSI: SocketIDs must be set to send data', null);
        return;
    }
    if (!message)
        return;
    try {
        const data = {
            Type: 'GSI.Generic',
            Token: {
                Name: '',
                Value: ''
            },
            Data: {},
        };
        data.Type = messageType || 'GSI.Generic';
        if (typeof (message) === 'object') {
            data.Data = message;
        }
        else if (typeof (message) === 'string') {
            data.Data = JSON.parse(message);
        }
        else {
            writeError(`DRGGSI: Message must be either string or object`, null);
        }
        for (const socketID of socketIDs) {
            if (!sockets.has(socketID)) {
                writeError(`DRGGSI: "${socketID}" is not an active socket`, socketID);
                return;
            }
            const socket = sockets.get(socketID);
            data.Token.Name = socket.TokenName;
            data.Token.Value = socket.TokenValue;
            const result = JSON.stringify(data);
            if (!socket.send(result)) {
                writeError(`DRGGSI: Failed sending data to "${socketID}"`, socketID);
            }
        }
    }
    catch (e) {
        writeError(`DRGGSI: Failed to send message "${e.message}"`, null);
    }
}
function handleSocketOpen(socketID) {
    if (!sockets.has(socketID)) {
        writeError(`DRGGSI: Received OnSocketOpen but "${socketID}" is not an active socket`, socketID);
        return;
    }
    sendDirect(socketID, 'GSI.Connect', { Data: { SocketID: socketID } });
    const entry = new DRGGSIQueueEntry(1, 'GSI.Connect', socketID);
    messageQueue.enqueue(entry);
}
function handleSocketMessage(socketID, message) {
    if (!message) {
        writeError(`DRGGSI: Received empty message "${socketID}"`, socketID);
        return;
    }
    let parsed = null;
    try {
        parsed = JSON.parse(message);
    }
    catch (e) {
        writeError(`DRGGSI: Failed parsing message: "${e.message}"`, socketID);
        return;
    }
    const entry = new DRGGSIQueueEntry(2, parsed.Type, socketID, parsed.ModID || '');
    entry.Content = parsed.Data;
    messageQueue.enqueue(entry);
}
function handleSocketError(socketID, error) {
    writeError(error, socketID);
}
function handleSocketClose(socketID, closeEvent) {
    const entry = new DRGGSIQueueEntry(1, 'GSI.Disconnect', socketID);
    entry.Content = ((closeEvent.code.toString().padStart(4, '0') + (closeEvent.wasClean ? '1' : '0') + (closeEvent.reason || 'Unknown close reason')));
    messageQueue.enqueue(entry);
    if (sockets.has(socketID)) {
        const socket = sockets.get(socketID);
        sockets.delete(socketID);
        socket.cleanUp();
    }
}
/**
 * Creates and prepares a socket.
 * Attempts to connect it to the given URI.
 * @param {string} socketID The ID of the socket to connect.
 * @param {string} tokenName The name of the auth token.
 * @param {string} tokenValue The value of the auth token.
 * @param {string} URI The URI to connect to.
 */
function connect(socketID, tokenName, tokenValue, URI = 'ws://localhost:7664') {
    let socket = null;
    if (sockets.has(socketID)) {
        socket = sockets.get(socketID);
        sockets.delete(socketID);
        socket.disconnect('Client requested reconnect');
    }
    socket = new DRGGSISocket(socketID, tokenName, tokenValue, handleSocketOpen, handleSocketMessage, handleSocketError, handleSocketClose);
}
/**
 * Disconnects a socket with the given ID if it exists.
 * @param {string} socketID The ID of the socket to disconnect.
 * @param {string} reason The reason the socket is disconnecting.
 */
function disconnect(socketID, reason = 'Client initiated disconnect') {
    if (sockets.has(socketID)) {
        const socket = sockets.get(socketID);
        socket.disconnect(reason);
    }
}
