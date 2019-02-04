import { connect, connection } from 'mongoose'
import User from './user'
import Markdown from './markdown'
connect('mongodb://127.0.0.1:27017/app', { useNewUrlParser: true })

connection.on('error', async (err) => {
  console.error(err)
})
connection.once('open', () => {
  console.log('open conn')
})

export {
 User,
 Markdown
}