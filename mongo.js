const mongoose = require("mongoose")

// usage node mongo.js yourpassword Anna 040-123456

if(
    process.argv.length < 3 || (process.argv.length > 3 && process.argv.length < 5)
){
    console.log(`USAGE: node mongo.js password name number `)
    process.exit(1)
}


const password = process.argv[2]

const url = `mongodb+srv://mlynagh111:${password}@phonebookapp.95uqcqz.mongodb.net/phonebookapp?retryWrites=true&w=majority`

mongoose.set("strictQuery", false)
mongoose.connect(url)

const PersonSchema = new mongoose.Schema({
    name: String, 
    number: String,
})

const Person = mongoose.model("Person", PersonSchema, "persons")



if(process.argv.length === 3){
    let count = 0
    Person.find({}).then(result => {
        console.log("phonebook:\n");
        result.forEach((person) => {
            console.log(`${person.name}  ${person.number}`)
            count += 1
        })
        mongoose.connection.close()
        console.log("\ntotal contacts:", count)
        process.exit(0)
    })
}

const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
})

person.save().then(result => {
    console.log(`Added ${result.name} number ${result.number} to phonebook.`)
    mongoose.connection.close()
})
.catch((err) => {
    console.log(err)
})


// Contact.find({}).then(result => {
//     result.forEach(contact => {
//         console.log(contact)
//     })
//     mongoose.connection.close()
// })