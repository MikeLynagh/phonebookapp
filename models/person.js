const { urlencoded } = require("express")
const mongoose = require("mongoose")

mongoose.set("strictQuery", false)

const url = process.env.MONGODB_URI

console.log("connecting to", urlencoded)

mongoose.connect(url)
    .then(result => {
        console.log("connected to MongoDB")
    })
    .catch((error) => {
        console.log("error connecting to Mongo|DB", error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
        minlength: 3
    },
    number: {
        type: String, 
        validate: {
            validator: function(v){
                return /\d{3}-\d{7}/.test(v)
            },
            message: props => `${props.message} is not a valid phone number`
        },
        required: [true, `User phone number required`]
    },
})



personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject._v
    }
})

module.exports = mongoose.model("Person", personSchema, "persons")