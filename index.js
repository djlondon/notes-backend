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
const Note = require('./models/note')

app.get('/', (request, response) => {
  response.send('<h1>Hello world</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
  const id = +request.params.id
  const note = notes.find(note => note.id === id)
  response.status(note ? 200 : 404).json(note)
})

app.put('/api/notes/:id', (request, response) => {
  const id = +request.params.id
  const body = request.body
  let note = notes.find(note => note.id === id)
  if (!note) {
    console.error(`no note with id ${id}`)
    return response.status(404).end()
  }
  note = {
    content: body.content,
    important: body.important,
    date: body.date,
    id: body.id,
  }
  response.status(200).json(note)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = +request.params.id
  if (!notes.find(note => note.id === id)) {
    return response.status(404).end()
  }
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  }
  notes = notes.concat(note)
  response.json(note)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.use((request, response) => {
  response.status(404).send({ error: `unknown endpoint ${request.path}` })
})