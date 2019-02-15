import * as DataSources from './datasources'
import { IUser } from './datasources/user';
import { IFolder } from './datasources/folder';

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
  [key: string]: {
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
      console.log(authorization, user);
      
      if (!!authorization) {
        return dataSources.Markdown.model.find({ userId: user.id })
      }
      return []
    },
    markdown: async (_, params, { dataSources, authorization, user }) => {
      const { id } = params
      return dataSources.Markdown.model.findById(id).exec()
    },
    folder: async (_, params, { dataSources }) => {
      const { id } = params
      if (id) {
        return dataSources.Folder.model.findById(id).exec()
      }
      return {
        id: null,
        parentId: null,
        name: '__root',
      }
    }
  },
  Mutation: {
    login: async (_, { username, password }, { dataSources }) => {
      return dataSources.User.model.findOne({ username, password }).exec()
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
        return dataSources.Markdown.model.findByIdAndUpdate(id, {...params, updateTime: new Date().valueOf() }).exec()
      }
      return dataSources.Markdown.model.create({ ...params, userId: user.id, createTime: new Date().valueOf() })
    },
    folder: async (_: any, params, { dataSources, user }) => {
      const { id } = params
      if (Object.keys(params).length === 1 && id) {
        return dataSources.Folder.model.findOneAndDelete({ _id: id }).exec()
      }
      if (id) {
        return dataSources.Folder.model.findByIdAndUpdate(id, {...params, updateTime: new Date().valueOf() }).exec()
      }
      return dataSources.Folder.model.create({ ...params, userId: user.id, createTime: new Date().valueOf() })
    }
  },
  Folder: {
    folders: async (folder: IFolder, params, { dataSources, user }) => {
      return dataSources.Folder.model.find({ parentId: folder.id, userId: user.id })
    },
    markdowns: async (folder: IFolder, params, { dataSources, user }) => {
      return dataSources.Markdown.model.find({ folderId: folder.id, userId: user.id })
    },
  }
}

export {
  resolvers
}