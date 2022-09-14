const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
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
  res.json(persons)
})

app.post('/api/persons', (req, res, next) => {
  const id = Math.ceil(Math.random() * 1000000)
  const { name, number } = req.body

  if(!name || !number) return res.status(400).send({error: 'name or number is missing'})
  if(persons.some(person => person.name === name)) return res.status(409).send({error: 'name already exists'})
  
  const newPerson = {id, name, number}
  persons = [...persons, newPerson]
  res.json(persons)
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = Number(req.params.id)
  const person = persons.find((person) => person.id === id)

  if (person) res.json(person)
  if (!id) res.status(400).end()

  next()
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter((person) => person.id !== id)

  res.status(204).end()
})

app.use((req, res) => {
  res.status(404).end()	
})

const PORT = process.env.PORT || 3007

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
