import { IncomingMessage } from 'http'
import WebSocket from 'ws'
import { ConnectedUsers, ChatRequest, ChatStats, MessageRequest, UserMessage, RequestTypes, RegisterMessage  } from './models'
import ConnectionManager from './ConnectionManager'

export default class ChatServer {
  wsServer: WebSocket.Server
  cachedMessages: Array<MessageRequest> = []
  connectedUsers: ConnectedUsers = { users: {} }

  constructor(port: number) {
    const wsServer = new WebSocket.Server({ port: port })
    wsServer.on('connection', (ws: WebSocket, request: IncomingMessage) => {
      const ip = `${request.socket.remoteAddress}` // maybe we'll want this?
      console.log(`Connection received from ${ip}`)

      ws.on('message', (data: WebSocket.RawData) => {
        try {
          const payload = data.toString('utf-8')

          const chatRequest = new ChatRequest(payload)
          const requestType = chatRequest.requestType

          switch(requestType) {
            case RequestTypes.REGISTER:
              this.handleRegisterMessage(chatRequest.registerMessage!, ip, ws)
              break
            case RequestTypes.USER_MESSAGE:
              this.handleUserMessage(chatRequest.userMessage!)
              break
            case RequestTypes.UNREGISTER:
              this.handleUnRegisterMessage(chatRequest.registerMessage!)
              break  
            default:
              break
          }
        } catch (error: any) {
          console.error(error)
        }
      })

      ws.on('close', (code: number, reason: Buffer) => {
        console.log(`${new Date()} Peer ${ ws } disconnected. Code: ${code}, Reason: ${reason.toString()}`)
      })

      // send cached messages
      if (this.cachedMessages.length) {
        ws.send(`[${this.cachedMessages.map(m => m.toString()).join(',')}]`)
      }
    })

    this.wsServer = wsServer

    setInterval( this.stillThere, 3000)

    console.log('Chat Server is running on port', port)
  }

  handleRegisterMessage(registerMessage: RegisterMessage, ip: string, socket: WebSocket) {
    console.log(`Registering client ${registerMessage.useralias}`)
    ConnectionManager.addUser(
        { alias: registerMessage.useralias },
        ip,
        socket )
  }

  handleUnRegisterMessage(registerMessage: RegisterMessage) {
    console.log(`Unregistering client ${registerMessage.useralias}`)
    ConnectionManager.removeUser(registerMessage.useralias)
    return true
  }

  handleUserMessage(userMessage: UserMessage) {
    console.log(`Handling User Message for client ${userMessage.useralias}`)
    this.cachedMessages.push(userMessage) // for now just save them here.

    process.nextTick(() => {
      this.wsServer.clients.forEach(client => {
        return client.send(`[${userMessage.toString()}]`) // sending these as arrays before I create a server message type
      })
    })
  }

  getStats(): ChatStats {
    return {
      messageCount: this.cachedMessages.length,
      connectionCount: this.wsServer.clients.size
    }
  }

  aliasIsAvailable(useralias: string): boolean {
    return !ConnectionManager.userExists(useralias)
  }

  stillThere() {
    for ( const key in ConnectionManager.connectedUsers.users ) {
      const userConnection = ConnectionManager.connectedUsers.users[key]
      userConnection.socket.ping( (err: Error) => {
        if (err !== undefined) {
          console.log(`error on connection ${key}, ${err.name}: ${err.message}`)
        }
      })
    }
  }
}