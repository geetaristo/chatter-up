import fastify from 'fastify'
import ChatServer from './src/ChatServer'

const restServer = fastify()
const chatServer = new ChatServer(3042)

restServer.register(require('fastify-cors'), { 
  origin: (_origin: any, cb: any) => {
    cb(null, true) // just let everything in right now.
  }
})

restServer.get('/useralias/validate/:useralias', async (request, _reply) => {
  const { useralias } = request.params as { useralias: string }
  const aliasIsValid = chatServer.aliasIsAvailable(useralias)
  console.log(`checking is useralias valid: ${useralias} - ${aliasIsValid}`)
  return { aliasIsValid }
})

restServer.get('/server/stats', async (_request, _reply) => {
  return chatServer.getStats()
})

restServer.listen(3001, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`ReST Server listening at ${address}`)
})


