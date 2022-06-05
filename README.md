# Chatter Up!!

This project implements a simplistic websocket chat server. The language of choice is TypeScript

## ./chat-server
This is the server code that runs both an http ReST server and also a websocket server. The ReSt server is implemented using the [fastify framework.](https://www.fastify.io/) The Websocket uses the [ws npm library](https://www.npmjs.com/package/ws)

## ./chat-client
This is the client code utilizing the [nuxt](https://nuxtjs.org/) framework; specifically the [typescript version of nuxt](https://typescript.nuxtjs.org/)

## Set up
### Prerequisites
You must have [node](https://nodejs.org/en/) and npm installed

### Starting the chat server
Open up a terminal window and navigate to the `./chat-server` directory:
 * run `npm install`
 * the execute the command `npm start`

You should see a message:
```
Chat Server is running on port 3042
ReST Server listening at http://127.0.0.1:3001
```

### Starting the chat client
Open up a terminal window and navigate to the `./chat-server` directory:
 * run `npm install`
 * the execute the command `npm run dev`
 * open up a web browser and navigate to http://localhost:3000/
 * type in a user name and press the `Join Chat` button


### Future ideas.
* Some examples of optional features to consider:
* Frontend allows the user to supply an alias
* Frontend allows the user to supply an avatar
* Basic server side profanity filtering
* Persistence for chat that survives a server restart
* Server driven slash commands (eg: /roll to roll dice)

