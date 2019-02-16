import { model, Schema, SchemaTypes, Model, Document } from 'mongoose'
import { DataSource } from 'apollo-datasource';

export interface IFolder extends Document {
  name: string
  parentId?: string,
  userId: string,
  createTime: number,
  updateTime: number,
}

const schema = new Schema({
  name: SchemaTypes.String,
  parentId: SchemaTypes.ObjectId,
  userId: SchemaTypes.ObjectId,
  createTime: SchemaTypes.Number,
  updateTime: SchemaTypes.Number
})

const FolderModel : Model<IFolder> = model('folder', schema)

class Folder extends DataSource {
  model = FolderModel
}

const _instance = new Folder()

export default _instance