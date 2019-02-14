import gql from 'graphql-tag';
import { async } from 'q';
import client from './client';

export const typeDefs = gql`
  type Setting {
    name: String
    version: String
  }

  type Query {
    setting: Setting
  }

  type Mutation {
    setting(name: String, version: String) : Setting
  }
`;

export const resolvers = {
  Mutation: {
    setting: async(_: any, params: any) => {
      const result = await client.readQuery({
        query: gql`
          query setting {
            setting @client {
              name
              version
            }
          }
        `
      })
      client.writeData({
        data: {
          setting: {
            ...result,
            ...params
          }
        }
      })
      return {
        ...result,
        ...params
      }
    }
  }
};

export const defaults = {
  setting: {
    name: '123',
    version: null,
    __typename: 'Setting'
  }
}