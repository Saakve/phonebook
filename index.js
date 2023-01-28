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

app.get('/info', (req, res) => {
  Person.estimatedDocumentCount().then( totalEntries => {
    res.send(`
      <p>Phonebook has info for ${totalEntries} people</p>
      <p>${Date()}</p>
    `)
  })
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then( result => {
    res.json(result)
  })
})

app.post('/api/persons', (req, res, next) => {
  const { name, phone } = req.body

  if(!name || !phone) return res.status(400).send({error: 'name or phone is missing'})

  Person.create({name, phone}).then( () => {
    Person.find({}).then( persons => res.json(persons))
  })

})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  
  Person.findById(id)
  .then(person => {
    if(!person) next()
    res.json(person)
   })
  .catch( () => res.status(400).end())
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id

  Person.findByIdAndRemove(id)
  .then( personRemoved => {
    res.status(204).end()
  })
  .catch( () => res.status(400).end())
})

app.use((req, res) => {
  res.status(404).end()
})

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
