const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose
  .connect(url)
  .then((result) => {
    console.log('connected to MongoDB', result)
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{3}-\d{7}/.test(v) || /\d{2}-\d{8}/.test(v)
      },
      message: (props) =>
        `${props.value} is not a valid phone number! Number must be in the format 123-4567890 or 12-34567890`,
    },
    required: [true, 'User phone number required'],
  },
  important: Boolean,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema)
