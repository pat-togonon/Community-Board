const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const communityRouter = require('./controllers/communities')

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

app.use(express.json())

app.get('/', (request, response) => {
  response.send('<h1>Hello Pat!</h1')
})

app.use('/api/communities', communityRouter)

module.exports = app