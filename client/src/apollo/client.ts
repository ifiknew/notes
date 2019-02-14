import { resolvers, typeDefs, defaults } from './resolvers';
import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

const cache = new InMemoryCache();
const client = new ApolloClient({
  cache,
  uri: 'http://localhost:4000/graphql',
  headers: {
    authorization: localStorage.getItem('uid') || '',
    'client-name': 'Space Explorer [web]',
    'client-version': '1.0.0',
  },
  clientState: {
    resolvers,
    typeDefs,
    cache,
    defaults
  }
});

client.writeQuery({
  query: gql`
    query user {
      user {
        id
      }
    }
  `,
  data: {
    user: {
      id: localStorage.getItem('uid'),
      __typename: 'User'
    }
  }
})
console.log(
  client.readQuery({
    query: gql`
      query setting {
        setting @client {
          name
          version
        }
      }
    `
  })
)

export default client