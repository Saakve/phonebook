require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person.js')

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (req, res, next) => {
  Person.estimatedDocumentCount()
  .then( totalEntries => {
    res.send(`
      <p>Phonebook has info for ${totalEntries} people</p>
      <p>${Date()}</p>
    `)
  })
  .catch(next)
})

app.get('/api/persons', (req, res, next) => {
  Person.find({})
  .then( result => {
    res.json(result)
  })
  .catch(next)
})

app.post('/api/persons', (req, res, next) => {
  const { name, phone } = req.body

  Person.create({name, phone})
  .then( () => {
    Person.find({})
    .then(persons => res.json(persons))
    .catch(next)
  })
  .catch(next)
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id

  Person.findById(id)
  .then(person => {
    if(!person) return res.status(404).end()
    res.json(person)
  })
  .catch(next)
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const {name, phone} = req.body

  Person.findByIdAndUpdate(id, {name, phone}, {new: true, runValidators: true})
  .then( updatedPerson => {
    if(!updatedPerson) return res.status(404).end()
    res.json(updatedPerson)
   })
  .catch(next)
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id

  Person.findByIdAndRemove(id)
  .then( () => res.status(204).end())
  .catch(next)
})

app.use((req, res) => {
  res.status(404).end()
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message, error.name)
  if(error.name === 'CastError') return res.status(400).send( {error: 'malformatted id'} )
  if(error.name === 'ValidationError') return res.status(400).send( {error: error.message} )
  res.status(500).end()
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
