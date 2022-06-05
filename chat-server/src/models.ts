import { v4 as uuidv4 } from 'uuid'
import { WebSocket } from 'ws'

export type alias = string

// Our user object
export interface User {
  alias: string
}

// Connection 
export interface Connection {
  user: User
  ip: string
  socket: WebSocket
}

export type ConnectedUsers = {
  users: Record<alias, Connection>
}

export interface MessageRequest {
	useralias: string
  id?: string
  timestamp?: number
	body: string
}

export class UserMessage implements MessageRequest {
	private data: { 
    useralias: string 
    id: string
    timestamp: number
    body: string 
  }

  private stringified: string

	constructor(req: MessageRequest) {
    if (req.useralias === undefined || req.body === undefined) {
      throw new Error(`Invalid message payload received: ${req}`)
    }

    if (req.id === undefined) {
      req.id = uuidv4()
    }

    if (req.timestamp === undefined) {
      req.timestamp = Date.now() / 1000 // make this Unix time just cause it's normal
    }

    this.data = {
      useralias: req.useralias,
      id: req.id,
      timestamp: req.timestamp,
      body: req.body 
    }

    this.stringified = JSON.stringify(this.data) // stringify ourselves just once.
	}

	get useralias(): string {
		return this.data.useralias
	}

	get body(): string {
		return this.data.body
	}

  get timemstamp(): number {
    return this.data.timestamp
  }

  get id(): string {
    return this.data.id
  }

  toString(): string {
    return this.stringified
  }
}

export interface RegisterMessage {
  useralias: string
  authtoken: string
}

export enum RequestTypes {
  REGISTER,
  USER_MESSAGE,
  UNREGISTER
}

export class ChatRequest {
	private data: { 
    requestType: RequestTypes
    userMessage?: UserMessage
    registerMessage?: RegisterMessage
  }

	constructor(payload: string) {
    const data = JSON.parse(payload)
    const validatePayload = (data: ChatRequest) : boolean => {
      if (data.requestType === undefined) {
        throw new Error('Invalid ChatRequest message payload received, requestType is undefined: ' + payload)
      }
  
      if (data.requestType === RequestTypes.REGISTER && data.registerMessage === undefined) {
        throw new Error('Invalid ChatRequest message payload received: requestType is RequestTypes.REGISTER but registerMessage is undefined' + payload)
      }
  
      if (data.requestType === RequestTypes.USER_MESSAGE && data.userMessage === undefined) {
        throw new Error('Invalid ChatRequest message payload received requestType is RequestTypes.USER_MESSAGE but userMessage is undefined: ' + payload)
      }

      return true
    }
  
    validatePayload(data)

    this.data = data
    if (data.requestType === RequestTypes.USER_MESSAGE) {
      this.data.userMessage = new UserMessage(this.data.userMessage!)
    }
    if (data.requestType === RequestTypes.REGISTER) {
      this.data.registerMessage = this.data.registerMessage!
    }
    
	}

  get requestType(): RequestTypes {
    return this.data.requestType
  }

  get userMessage(): UserMessage | undefined {
    return this.data.userMessage
  }

  get registerMessage(): RegisterMessage | undefined{
    return this.data.registerMessage
  }
}

export interface ChatStats {
  messageCount: number
  connectionCount: number
}

