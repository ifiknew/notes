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
    text: String
    createTime: String!
    updateTime: String
    folderId: ID
  }
  type Folder {
    id: ID
    name: String!
    parentId: ID
    folders: [Folder]
    markdowns: [Markdown]
  }

  type Query {
    user: User
    markdowns: [Markdown]
    markdown(id: ID): Markdown
    folder(id: ID): Folder
  }

  type Mutation {
    login(username: String!, password: String!): User

    user(id: ID, username: String!, password: String!, nickname: String!): User
    markdown(id: ID, title: String, content: String, text: String, folderId: ID): Markdown
    folder(id: ID, name: String, parentId: ID): Folder
  }
`

export {
  typeDefs
}