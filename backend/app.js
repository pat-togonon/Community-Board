const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const communityRouter = require('./controllers/communities')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const middleware = require('./utils/middleware')
const authRouter = require('./routes/auth')
const postRouter = require('./routes/posts')

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

const corsOption = {
  origin: true,
  credentials: true
}

app.use(cors(corsOption))

app.use(express.json())
app.use(cookieParser())


app.get('/', (request, response) => {
  response.send('<h1>Hello Pat!</h1')
})
app.use('/api/auth', authRouter)
app.use('/api/communities', communityRouter)
app.use('/api/', middleware.tokenExtractor, middleware.userExtractor, postRouter)

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app