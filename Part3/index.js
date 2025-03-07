const express = require('express')
const app = express()
require('dotenv').config()

const Person = require('./models/person')
app.use(express.static('dist'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const morgan = require('morgan')
const cors = require('cors')
app.use(cors())

app.use(express.json())

morgan.token('content', (req) => JSON.stringify(req.body))

app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms {:content'
  )
)

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  console.log(body)

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Missing person details',
    })
  }

  const person = new Person({
    name: body.name,
    number: String(body.number),
    important: body.important || false,
  })

  console.log(person, 'this is the id:', person.id)

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const id = req.params.id

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  console.log('this is the id', id)
  Person.findByIdAndDelete(req.params.id)
    .then(res.status(204).end())
    .catch((error) => next(error))
})

app.get('/info', (req, res) => {
  const now = new Date()
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZoneName: 'short',
  }
  const fullDateString = now.toLocaleString('en-US', options)

  Person.find({})
    .then((persons) => {
      res.send(`
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${fullDateString}</p>
    `)
    })
    .catch((error) => {
      console.error('Error fetching persons:', error)
      res.status(500).send('Error fetching persons')
    })
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
