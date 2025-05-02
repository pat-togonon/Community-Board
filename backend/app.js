const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const communityRouter = require('./controllers/communities')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const middleware = require('./utils/middleware')
const refreshRouter = require('./controllers/refresh')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to MONGODB...')

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB', error.message)
  })

const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())


app.get('/', (request, response) => {
  response.send('<h1>Hello Pat!</h1')
})
app.use('/api/login', loginRouter)
app.use('/api/communities', communityRouter)
app.use(middleware.tokenExtractor)
app.use('/api/users', middleware.userExtractor, usersRouter) // should not be accessible
app.use('/api/refresh', middleware.userExtractor, refreshRouter)

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app