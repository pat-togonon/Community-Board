const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Community = require('../models/Community')
require('dotenv').config()

loginRouter.post('/', async (request, response) => {
  const { username, password, communityId } = request.body
  
  if (!communityId) {
    return response.status(401).json({
      error: 'please select your community'
    })
  }

  const user = await User.findOne({ username }).populate('community', { _id: 1, name: 1 })

  console.log('user is', user)
  
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      return response.status(401).json({
        error: 'invalid username or password'
      })
    }

    if (user.community._id.toString() !== communityId) {
      return response.status(401).json({
        error: 'The community you selected is incorrect'
      })
    }

    const userForToken = {
      username: user.username,
      id: user._id
    }

    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60*60 })

    response
      .status(200)
      .send({ 
        token, 
        username: user.username, 
        name: user.name, 
        id: user._id.toString(), 
        community: user.community._id, 
        communityName: user.community.name })

})

module.exports = loginRouter

