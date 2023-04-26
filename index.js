const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const app = express()

app.use(express.json())
app.use(morgan("tiny"))
app.use(cors())


let persons = 
    [
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

app.get("/", (request, response) => {
    response.send("<h1>Phonebook</h1>")
})

app.get("/api/persons", (request, response) => {
    response.json(persons)
})

app.get("/info", (request, response) => {
    const currentDate = new Date()
    const options = { timeZone: "Europe/Dublin" }
    const dateString = currentDate.toLocaleString("en-US", options)
    response.send(`<h1>Phonebook has info for ${persons.length} people</h1>
    <p> Request received at: ${dateString}</p>
    `)
})


app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const person = persons.find(person => person.id === id)
    if(person){
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
    
})


const randomNumber = (min, max) => {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}


app.post("/api/persons", (request, response) => {

    const body = request.body

    if(!body.name){
        return response.status(400).json({
            error: "name missing"
        })
    } 

    if(!body.number){
        return response.status(400).json({
            error: "number must be included"
        })
    }

    if(persons.some((person) => person.name === body.name )){
        return response.status(400).json({
            error: "Name already exists in phonebook"
        })
    }



    const person = {
        name: body.name,
        number: body.number,
        id: randomNumber(100, 10000)
    }
    persons = persons.concat(person)

    // const person = request.body
    // person.id = randomNumber(100, 10000)
    response.json(person)
})

// error handling if
// name or no is missing
//or 
//name already exists in phonebook

// {error: "name must be unique"}





const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})