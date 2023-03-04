const mongoose = require('mongoose')

if(process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

//Conexi�n a la BD
const url = `mongodb+srv://saakve:${process.argv[2]}@cluster0.bvltx.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.set('strictQuery', false)
mongoose.connect(url)

//Schemas para las colecciones
const personSchema = new mongoose.Schema({
  name: String,
  phone: String
})

//Modelos para crear colecciones y manipular documentos
const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3) {
  Person.find({}).then( persons => {
    console.log('phonebook:')
    persons.forEach( ({ name, phone }) => console.log(name + ' ' + phone))
    mongoose.connection.close()
  })
}

if(process.argv.length === 5) {
  const name = process.argv[3]
  const phone = process.argv[4]

  Person.create({ name, phone }).then( () => {
    console.log(`added ${name} number ${phone} to phonebook`)
    mongoose.connection.close()
  })
}
