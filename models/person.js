const mongoose = require("mongoose")
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose.connect(url)
.then( () => console.log("Database connected"))
.catch( e => console.log("Error connecting to MongoDb: ", e))

const personSchema = new mongoose.Schema({
  name: String,
  phone: String
})

personSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id
    delete ret._id
    delete ret.__v
  }
})

module.exports = mongoose.model("Person", personSchema)
