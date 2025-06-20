const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const communityRouter = require('./controllers/communities')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const middleware = require('./utils/middleware')
const authRouter = require('./routes/auth')
const postRouter = require('./routes/posts')
const commentRouter = require('./routes/comments')
const userRouter = require('./routes/user')
const { url } = require('./utils/config')
const clearDbTestRouter = require('./routes/cleardBforTest')
const path = require('path')

mongoose.set('strictQuery', false)

if (process.env.NODE_ENV !== 'production') {
  console.log('connecting to MONGODB...')
}

mongoose.connect(url)
  .then(_result => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('connected to MongoDB')
    }
  })
  .catch(error => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('error connecting to MongoDB', error.message)
    }
  })

const app = express()

const corsOption = {
  origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : true, // my frontend subdomain when deployed
  credentials: true
}

app.use(cors(corsOption))

app.use(express.json())
app.use(cookieParser())

if (process.env.NODE_ENV === 'test') {
  app.use('/api/tests/', clearDbTestRouter)
}

app.use('/api/auth', authRouter)
app.use('/api/communities/', communityRouter)
app.use('/api/posts/', middleware.tokenExtractor, middleware.userExtractor, postRouter)
app.use('/api/posts/', middleware.tokenExtractor, middleware.userExtractor, commentRouter)
app.use('/api/user/',middleware.tokenExtractor, middleware.userExtractor, userRouter)

app.use(express.static(path.join(__dirname, 'dist')))

app.get('*', (_request, response) => {
  response.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)

module.exports = app