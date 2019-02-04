import { model, Schema, SchemaTypes, Model, Document } from 'mongoose'
import { DataSource } from 'apollo-datasource';

export interface IUser extends Document {
  username: string
  password: string
  nickname: string
}

const schema = new Schema({
  username: SchemaTypes.String,
  password: SchemaTypes.String,
  nickname: SchemaTypes.String,
})

const UserModel : Model<IUser> = model('user', schema)

class User extends DataSource {
  model = UserModel
  async findById () {
    return UserModel.find({ nickname: /if/ }).exec().then(docs => {
      return docs.length > 0 ? docs[0] : null
    })
  }
}

const _instance = new User()

export default _instance