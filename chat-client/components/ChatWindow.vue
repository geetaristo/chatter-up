<template>
  <b-card>
    <b-card-header>
      <b-row v-if="connected">
        <b-col sm="10">
          Now chatting as <strong> {{ useralias }} </strong>
        </b-col>
        <b-col class="control">
          <b-button variant="dark" @click="leave">
            Exit
          </b-button>
        </b-col>
      </b-row>
      <b-row v-if="connecting">
        Connecting to chat server...
      </b-row>
      <b-row v-if="!connecting && !connected">
        <b-col sm="10">
          Not connected to server
        </b-col>
        <b-col class="control">
          <b-button variant="dark" @click="connectToChatServer">
            Reconnect
          </b-button>
          <b-button variant="dark" @click="leave">
            Exit
          </b-button>
        </b-col>
      </b-row>
    </b-card-header>

    <b-card-body ref="messageWindow" class="messageWindow">
      <ul>
        <li v-for="msg in messages" :key="msg.id">
          {{ formatTimestamp(Number(msg.timestamp)) }} - <strong>{{ msg.useralias }}</strong>: {{ msg.body }}
        </li>
      </ul>
    </b-card-body>

    <b-card-footer class="messageEditor">
      <b-form>
        <b-row>
          <b-col sm="10">
            <b-form-input
              id="message"
              v-model="message"
              placeholder="Say something"
              required
              @keydown.native="keydownHandler"
            />
          </b-col>

          <b-col class="control">
            <b-button
              variant="success"
              :disabled="message.length === 0 && connected === false"
              @click="sendmessage"
            >
              <b-icon-arrow-right />
            </b-button>
          </b-col>
        </b-row>
      </b-form>
    </b-card-footer>
  </b-card>
</template>

<script lang="ts">
import { Vue, Component, namespace } from 'nuxt-property-decorator'
import { BIconArrowRight } from 'bootstrap-vue'
const { DateTime } = require('luxon') // something weird with the luxon types?

const UserModule = namespace('UserModule')

interface RegisterMessage {
  useralias: string
  authtoken: string
}

enum RequestTypes {
  REGISTER,
  USER_MESSAGE,
  UNREGISTER
}

// TODO: these types should be exported from the server
type UserMessage = {
  useralias: string
  datetime?: string
  id?: number
  body: string
}

type ChatRequest = {
  requestType: RequestTypes
  userMessage?: UserMessage
  registerMessage?: RegisterMessage
}

@Component({ components: { BIconArrowRight } })
export default class ChatWindow extends Vue {
  @UserModule.State
  useralias: any

  @UserModule.Action
  logoutUserAlias: any

  message = ''
  messages: Array<UserMessage> = []
  connected = false
  connecting = false
  socket?: WebSocket

  // send message when the enter key is pressed
  keydownHandler (event: KeyboardEvent) {
    if (event.key === 'Enter' && this.message.length > 0) {
      event.preventDefault()
      this.sendmessage()
    }
  }

  formatTimestamp (seconds: number): string {
    const dateTime = DateTime.fromSeconds(seconds)
    return dateTime.toLocaleString(DateTime.DATETIME_SHORT)
  }

  sendmessage () {
    const userMessage: UserMessage = {
      useralias: this.useralias as string,
      body: this.message
    }

    const chatRequest: ChatRequest = {
      requestType: RequestTypes.USER_MESSAGE,
      userMessage
    }

    this.socket?.send(JSON.stringify(chatRequest))
    this.message = ''
  }

  register () {
    const registerMessage: RegisterMessage = {
      useralias: this.useralias,
      authtoken: 'FAKEAUTHTOKEN'
    }

    const chatRequest: ChatRequest = {
      requestType: RequestTypes.REGISTER,
      registerMessage
    }

    this.socket?.send(JSON.stringify(chatRequest))
  }

  async unregister () {
    const registerMessage: RegisterMessage = {
      useralias: this.useralias,
      authtoken: 'FAKEAUTHTOKEN'
    }

    const chatRequest: ChatRequest = {
      requestType: RequestTypes.UNREGISTER,
      registerMessage
    }

    await this.socket?.send(JSON.stringify(chatRequest))
  }

  receiveMessage (messages: Array<UserMessage>) {
    if (!messages || !messages.length) {
      return
    }

    for (const msg of messages) {
      this.messages.push(msg)
    }

    const messageWindow = this.$refs.messageWindow as {scrollTop: number, scrollHeight: number}
    messageWindow.scrollTop = messageWindow.scrollHeight
  }

  connectToChatServer () {
    const self = this
    if (!self.connected) {
      self.connecting = true
      const socket = new WebSocket('ws://localhost:3042')

      socket.onopen = (event) => {
        self.connected = true
        self.connecting = false
        console.log(`Opened socket connection: ${event.type}`)
        this.register()
      }

      socket.onmessage = (event) => {
        console.log(`Received message on socket connection: ${event.data}`)
        self.receiveMessage(JSON.parse(event.data))
      }

      socket.onerror = (event) => {
        if (self.connecting) {
          self.connected = false
          self.connecting = false

          // TODO: Error Alert Here.
          console.log(`Error received on socket connection: ${event.type}`)
        }
        self.connected = false
      }

      self.socket = socket
    } else {
      self.connected = false
      self.connecting = false
    }
  }

  async leave () {
    await this.unregister()
    this.logoutUserAlias()
  }

  mounted () {
    this.connectToChatServer()
  }
}

</script>

<style scoped>
.messageWindow {
  height: 500px;
  border: 1px solid grey;
  border-radius: 4px;
  padding: 10px;
  background-color: black;
  color: white;
  overflow-y: scroll;
  font-family: 'Courier New', Courier, monospace;
}
li {
  list-style: none;
}
.control {
  text-align: right;
}
</style>
