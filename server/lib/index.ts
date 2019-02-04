import { ApolloServer } from 'apollo-server'
import { typeDefs } from './schema'
import * as dataSources from './datasources'
import { resolvers } from './resolvers'
const server = new ApolloServer({
  cors: true,
  typeDefs,
  resolvers,
  dataSources: () => dataSources,
  context: async ({ req }) => {
    const authorization = req.headers.authorization
    if (authorization) {
      const user = await dataSources.User.model.findById(authorization).exec()
      return {
        user,
        authorization
      }
    }
    return {}
  }
})

server
  .listen({ port: 4000 })
  .then(({ url }) => console.log(`🚀 app running at ${url}`))

export {
 server as default
}