import { model, Schema, SchemaTypes, Model, Document } from 'mongoose'
import { DataSource } from 'apollo-datasource';

interface IMarkdown extends Document {
  title: string
  content: string
}

const schema = new Schema({
  title: SchemaTypes.String,
  content: SchemaTypes.String,
})

const MarkdownModel : Model<IMarkdown> = model('markdown', schema)

class Markdown extends DataSource {
  model = MarkdownModel
}

const _instance = new Markdown()

export default _instance