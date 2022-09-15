const express  = require('express')
const cors = require('cors')
require('dotenv').config()
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose')

const port = process.env.PORT || 5000

const app = express()

connectDB();

app.use(cors())
app.use(bodyParser.json())


app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'dev'
}))

mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(port, console.log(`Server listening on ${port}`))
}).catch(err => {
    console.log(err)
}) 


