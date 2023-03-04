const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then( () => console.log('Database connected'))
  .catch( e => console.log('Error connecting to MongoDb: ', e))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3,'{VALUE} is shorter than the minimum allowed length (3)'],
    required: [true,'name required']
  },
  phone: {
    type: String,
    minLength: [8, '{VALUE} is shorter than the minimun allowed length (8)'],
    validate: {
      validator: (phone) => /^\d{2,3}-\d+$/.test(phone),
      message: '{VALUE} is not a valid phone number, should fits DD-DDDDD... or DDD-DDDD...'
    },
    required: [true, 'phone number required']
  }
})

personSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
