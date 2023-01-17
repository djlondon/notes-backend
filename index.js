const path = require('node:path')
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') })
const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:', request.path)
  console.log('Body:', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)
const noteModel = require('./models/note')

app.get('/', (request, response) => {
  response.send('<h1>Hello world</h1>')
})

app.get('/api/notes', (request, response) => {
  noteModel.Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
  noteModel.Note.findById(request.params.id).then(note => {
    response.status(note ? 200 : 404).json(note)
  })
})

app.put('/api/notes/:id', async (request, response) => {
  const body = request.body
  noteModel.Note.findById(request.params.id).then(note => {
    note.important = body.important
    note.save()
    response.status(note ? 200 : 404).json(note)
  })
})

app.delete('/api/notes/:id', (request, response) => {
  noteModel.Note.deleteOne({ _id: request.params.id })
  response.status(204).end()
})

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = new noteModel.Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })
  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

const PORT = process.env.PORT || 3001

noteModel.connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})

app.use((request, response) => {
  response.status(404).send({ error: `unknown endpoint ${request.path}` })
})