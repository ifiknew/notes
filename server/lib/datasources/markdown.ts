import { model, Schema, SchemaTypes, Model, Document } from 'mongoose'
import { DataSource } from 'apollo-datasource';

interface IMarkdown extends Document {
  title: string
  content: string,
  userId: string,
  folderId: string,
  createTime: number,
  updateTime: number
}

const schema = new Schema({
  title: SchemaTypes.String,
  content: SchemaTypes.String,
  userId: SchemaTypes.ObjectId,
  folderId: SchemaTypes.ObjectId,
  createTime: SchemaTypes.Number,
  updateTime: SchemaTypes.Number
})

const MarkdownModel : Model<IMarkdown> = model('markdown', schema)

class Markdown extends DataSource {
  model = MarkdownModel
}

const _instance = new Markdown()

export default _instance