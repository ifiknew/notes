import { ApolloServer } from 'apollo-server'
import { typeDefs } from './schema'
const server = new ApolloServer({
  cors: true,
  typeDefs
})

server
  .listen({ port: 4000 })
  .then(({ url }) => console.log(`🚀 app running at ${url}`))

export {
 server as default
}