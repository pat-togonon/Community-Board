const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../models/User')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
    
  } else {
    request.token = null
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.ACCESS_SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })

  }

  request.user = await User.findById(decodedToken.id)

  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Oops! Invalid URL. Please go back home' })
}

const errorHandler = (error, request, response, next) => {
  console.log('error is', error.name, ' and message is ', error.message)
  console.log('error path', error.path)

  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  } else if (error.message === 'data and salt arguments required') {
    return response.status(400).send({ error: 'Please input password' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' }) // for backend
  } else if (error.name === 'CastError') {
    return response.status(400).json({ 
      error: `Invalid value for ${error.path}. Please check your input.`
    })
  } else if (error.name === 'TypeError') {
    // this is for invalid url
    return response.status(400).json({ 
      error: 'Something went wrong with your request. Please check again.'
    })
  } else if (error.name === 'ZodError') {
    return response.status(400).json({ error: error.errors.map(e => {
      return `${e.message}`
    }).join('. ') })
  }

  //Add duplicate error 11000 thing 
  
  next(error)
}



module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}