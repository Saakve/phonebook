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

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "phone": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "phone": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "phone": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "phone": "39-23-6423122"
    }
]

app.get('/', (req, res) => {
  res.send('<h1>Bienvenido<h1>')
})

app.get('/info', (req, res) => {
 res.send(`<p>Phonebook has info for ${persons.length} people</p>
           <p>${Date()}</p>`)
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then( result => {
    res.json(result)
  })
})

app.post('/api/persons', (req, res, next) => {
  const id = Math.ceil(Math.random() * 1000000)
  const { name, phone } = req.body

  if(!name || !phone) return res.status(400).send({error: 'name or phone is missing'})
  if(persons.some(person => person.name === name)) return res.status(409).send({error: 'name already exists'})
  
  const newPerson = {id, name, phone}
  persons = [...persons, newPerson]
  res.json(persons)
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
  const id = Number(req.params.id)
  persons = persons.filter((person) => person.id !== id)

  res.status(204).end()
})

app.use((req, res) => {
  res.status(404).end()
})

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
