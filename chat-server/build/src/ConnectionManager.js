"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ConnectionManager {
    constructor() {
        this.connectedUsers = { users: {} };
    }
    userExists(alias) {
        return this.connectedUsers.users[alias] !== undefined;
    }
    addUser(user, ip, socket) {
        this.connectedUsers.users[user.alias] = {
            user, ip, socket
        };
    }
    removeUser(alias) {
        delete this.connectedUsers.users[alias];
    }
}
exports.default = new ConnectionManager();
