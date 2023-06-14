require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()

const Person = require("./models/person")
// const person = require("./models/person")

const requestLoggerr = (request, response, next) => {
    console.log("Method: ", request.method)
    console.log("Path: ", request.path)
    console.log("Body: ", request.body)
    console.log("---")
    next()
}

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name = "CastError"){
        return response.status(400).send({ error: "malformatted id"})
    }
    next(error)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint"})
}

app.use(cors())
app.use(express.static("build"))
app.use(express.json())
app.use(morgan("tiny"))
app.use(requestLoggerr)



app.get("/api/persons", (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})


app.get("/info", (request, response) => {
    const currentDate = new Date()
    const options = { timeZone: "Europe/Dublin"}
    const dateString = currentDate.toLocaleString("en-US", options )
    Person.find({}).then (persons => {
        console.log(`the length is ${persons.length}`)
        response.send(`<h1>Phonebook has info for ${persons.length} people</h1>
    <p> Request received at: ${dateString}</p>
    `)
    })
})


app.get("/api/persons/:id", (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {

        if(person){
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})


app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})


app.put("/api/persons/:id", (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person )
    .then(updatedPerson => {
        response.json(updatedPerson)
    })
    .catch(error => next(error))
})



const randomNumber = (min, max) => {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}

app.post("/api/persons", (request, response) => {
    const body = request.body

    if(body.name === undefined){
        return response.status(400).json({error: "name missing"})
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})




// app.post("/api/persons", (request, response) => {

//     const body = request.body

//     if(!body.name){
//         return response.status(400).json({
//             error: "name missing"
//         })
//     } 


//     if(!body.number){
//         return response.status(400).json({
//             error: "number must be included"
//         })
//     }

//     if(persons.some((person) => person.name === body.name )){
//         return response.status(400).json({
//             error: "Name already exists in phonebook"
//         })
//     }



//     const person = {
//         name: body.name,
//         number: body.number,
//         id: randomNumber(100, 10000)
//     }
//     persons = persons.concat(person)

//     // const person = request.body
//     // person.id = randomNumber(100, 10000)
//     response.json(person)
// })

// error handling if
// name or no is missing
//or 
//name already exists in phonebook

// {error: "name must be unique"}


app.use(unknownEndpoint)
app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})