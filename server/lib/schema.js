import { gql } from 'apollo-server'

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    password: String!
    nickname: String!
  }

  type Query {
    user: User
  }
`

export {
  typeDefs
}