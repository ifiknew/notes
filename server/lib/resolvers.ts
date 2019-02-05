import * as DataSources from './datasources'
import { IUser } from './datasources/user';

interface Context {
  dataSources: typeof DataSources
  authorization: string,
  user: IUser
}
type Resolver = (_:any, params: { [key: string]: any }, context: Context) => any
interface Resolvers {
  Query: {
    [key:string] : Resolver
  },
  Mutation: {
    [key:string] : Resolver
  },
}

const resolvers: Resolvers = {
  Query: {
    user: async (_, params, { dataSources, authorization, user }) => {
      if (Object.keys(params).length === 0 && !!authorization) {
        return user
      }
      return null
    },
    markdowns: async (_, __, { dataSources, authorization, user }) => {
      if (!!authorization) {
        return dataSources.Markdown.model.find({ userId: user.id })
      }
      return []
    }
  },
  Mutation: {
    login: async (_, { username, password }, { dataSources }) => {
      return dataSources.User.model.findOne({ username, password }).exec().then(doc => doc._id)
    },
    user: async (_: any, params, { dataSources, user }) => {
      const { id } = params
      if (id) {
        return dataSources.User.model.findByIdAndUpdate(id, params).exec()
      }
      return dataSources.User.model.create(params)
    },
    markdown: async (_: any, params, { dataSources, user }) => {
      const { id } = params
      if (Object.keys(params).length === 1 && id) {
        return dataSources.Markdown.model.findOneAndDelete({ _id: id }).exec()
      }
      if (id) {
        return dataSources.Markdown.model.findByIdAndUpdate(id, params).exec()
      }
      return dataSources.Markdown.model.create(params)
    }
  },
}

export {
  resolvers
}