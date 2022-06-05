"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const models_1 = require("./models");
const ConnectionManager_1 = __importDefault(require("./ConnectionManager"));
class ChatServer {
    constructor(port) {
        this.cachedMessages = [];
        this.connectedUsers = { users: {} };
        const wsServer = new ws_1.default.Server({ port: port });
        wsServer.on('connection', (ws, request) => {
            const ip = `${request.socket.remoteAddress}`; // maybe we'll want this?
            console.log(`Connection received from ${ip}`);
            ws.on('message', (data) => {
                try {
                    const payload = data.toString('utf-8');
                    const chatRequest = new models_1.ChatRequest(payload);
                    const requestType = chatRequest.requestType;
                    switch (requestType) {
                        case models_1.RequestTypes.REGISTER:
                            this.handleRegisterMessage(chatRequest.registerMessage, ip, ws);
                            break;
                        case models_1.RequestTypes.USER_MESSAGE:
                            this.handleUserMessage(chatRequest.userMessage);
                            break;
                        case models_1.RequestTypes.UNREGISTER:
                            this.handleUnRegisterMessage(chatRequest.registerMessage);
                            break;
                        default:
                            break;
                    }
                }
                catch (error) {
                    console.error(error);
                }
            });
            ws.on('close', (code, reason) => {
                console.log(`${new Date()} Peer ${ws} disconnected. Code: ${code}, Reason: ${reason.toString()}`);
            });
            // send cached messages
            if (this.cachedMessages.length) {
                ws.send(`[${this.cachedMessages.map(m => m.toString()).join(',')}]`);
            }
        });
        this.wsServer = wsServer;
        setInterval(this.stillThere, 3000);
        console.log('Chat Server is running on port', port);
    }
    handleRegisterMessage(registerMessage, ip, socket) {
        console.log(`Registering client ${registerMessage.useralias}`);
        ConnectionManager_1.default.addUser({ alias: registerMessage.useralias }, ip, socket);
    }
    handleUnRegisterMessage(registerMessage) {
        console.log(`Unregistering client ${registerMessage.useralias}`);
        ConnectionManager_1.default.removeUser(registerMessage.useralias);
        return true;
    }
    handleUserMessage(userMessage) {
        console.log(`Handling User Message for client ${userMessage.useralias}`);
        this.cachedMessages.push(userMessage); // for now just save them here.
        process.nextTick(() => {
            this.wsServer.clients.forEach(client => {
                return client.send(`[${userMessage.toString()}]`); // sending these as arrays before I create a server message type
            });
        });
    }
    getStats() {
        return {
            messageCount: this.cachedMessages.length,
            connectionCount: this.wsServer.clients.size
        };
    }
    aliasIsAvailable(useralias) {
        return !ConnectionManager_1.default.userExists(useralias);
    }
    stillThere() {
        for (const key in ConnectionManager_1.default.connectedUsers.users) {
            const userConnection = ConnectionManager_1.default.connectedUsers.users[key];
            userConnection.socket.ping((err) => {
                if (err !== undefined) {
                    console.log(`error on connection ${key}, ${err.name}: ${err.message}`);
                }
            });
        }
    }
}
exports.default = ChatServer;
