import { ConnectedUsers, User } from './models'
import { WebSocket } from 'ws'

class ConnectionManager {
  connectedUsers: ConnectedUsers = { users: {} }

  constructor () {

  }

  userExists(alias: string) {
    return this.connectedUsers.users[alias] !== undefined
  }

  addUser(user: User, ip: string, socket: WebSocket) {
    this.connectedUsers.users[user.alias] = {
      user, ip, socket
    }
  }

  removeUser(alias: string) {
    delete this.connectedUsers.users[alias]
  }
}

export default new ConnectionManager ()