const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.zeplh.mongodb.net/phoneApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  Number: Number,
  important: Boolean,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: process.argv[3],
  Number: process.argv[4],
  important: true,
})

if (process.argv.length > 3) {
  person.save().then((result) => {
    console.log(
      `added ${person.name} number ${person.Number} to phonebook and ${result}`
    )
    mongoose.connection.close()
  })
} else {
  Person.find({}).then((result) => {
    console.log('phonebook:')
    result.forEach((person) => {
      console.log(` ${person.name} ${person.Number}`)
    })
    mongoose.connection.close()
  })
}
