import { gql } from 'apollo-server'

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    nickname: String!
  }
  type Markdown {
    id: ID!
    title: String!
    content: String!
  }

  type Query {
    user: User
    markdowns: [Markdown]
  }

  type Mutation {
    login(username: String!, password: String!): ID

    user(id: ID, username: String!, password: String!, nickname: String!): User
    markdown(id: ID, title: String, content: String): Markdown
  }
`

export {
  typeDefs
}