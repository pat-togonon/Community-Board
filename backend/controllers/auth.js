const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const Post = require('../models/Post')
const Community = require('../models/Community')
const Comment = require('../models/Comment')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const { userRegistrationSchema, loginSchema } = require('../validators/auth')
const { compose } = require('redux')

// User registration

// DO NOT SHOW cos contains list of users - privacy 
//Show list of community users to community admins only

const usersList = async (request, response) => {
  const users = await User.find({})
  return response.json(users.map(user => user.toJSON()))
}


//create new users
const createAccount = async (request, response) => {

  const parsedData = userRegistrationSchema.parse(request.body)
  const { username, password, email, communityId } = parsedData

  if (!password || password.length < 5) {
    return response.status(400).json({ error: 'Password should have at least 5 characters' })
  }
  
  const communityExists = await Community.findById(communityId)
  
  if (!communityId) {
    return response.status(400).json({ error: 'Please select a community' })
  }

  if (!communityExists) {
    return response.status(400).json({ error: 'Invalid. Community does not exist' })
  }

  const userExists = await User.findOne({ email })
  const usernameExists = await User.findOne({ username })
  
  if (userExists || usernameExists) {
    return response.status(400).json({ 
      error: {
        email: userExists ? 'Email is already in use' : null,
        username: usernameExists ? 'Username already exists' : null
      }
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    password,
    email,
    passwordHash,
    community: [communityExists._id]
  })

  //the way to link each other is through ID

  const savedUser = await user.save()
  
  communityExists.communityUsers = communityExists.communityUsers.concat(savedUser._id)

  await communityExists.save()
  return response.status(201).json(savedUser)
}

//for user page / profile

// get individual user - but needs validation - community exists and user is part of that community

const viewOneUser = async (request, response) => {
  const user = await User
    .findById(request.params.id)
    .populate('community', { name: 1, id: 1})
    .populate('managedCommunity', { name: 1, description: 1 })
    .populate('createdPosts', { 
      mainCategory: 1,
      subCategory: 1,
      title: 1,
      description: 1,
      createdAt: 1,
      _id: 1
    })
    .populate({
      path: 'comments',
      select: 'content createdAt post _id',
      populate: {
        path: 'post',
        select: 'mainCategory subCategory title createdAt _id: 1'
      }
    })
    .populate('favoritePosts', {
      mainCategory: 1,
      subCategory: 1,
      title: 1,
      description: 1,
      createdAt: 1,
      _id: 1
    })

    response.json(user)

}

// profile update - adding in name, birth year, etc - put request
// delete profile - delete request

/*
usersRouter.put('/:id', async (request, response) => {
  const { communityId } = request.body
  
  const user = await User.findByIdAndUpdate(request.params.id,
    { community: communityId },
    { new: true, runValidators: true }
  )
   
  response.json(user)

})
*/

// User log in

const login = async (request, response) => {
  
  const parsedData = loginSchema.parse(request.body)
  const { username, password, communityId } = parsedData
  
  const communityExists = await Community.findById(communityId)
  
  const user = await User.findOne({ username }).populate('community', { _id: 1, name: 1 })

  const userIsInCommunity = communityExists.communityUsers.find(commUser => commUser.toString() === user._id.toString())

  if (!communityId || !communityExists || !userIsInCommunity) {
    return response.status(401).json({
    error: 'Please provide or select your correct community'
    })
  }
  
  if (!password) {
    return response.status(401).json({
      error: 'Please input password'
    })
  }  
  
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)
  
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
    error: 'invalid username or password'
    })
  }
  
  const userForToken = {
    username: user.username,
    id: user._id
  }
  
  const accessToken = jwt.sign(userForToken, process.env.ACCESS_SECRET, { expiresIn: '150m' })
  
  const refreshToken = jwt.sign(userForToken, process.env.REFRESH_SECRET, { expiresIn: '30d'})
  
  response.cookie('jwt', refreshToken, {
    httpOnly: true,
    sameSite: 'Lax', // set to none upon deployment/production
    secure: false, // set to true upon deployment / production
    maxAge: 30 * 24 * 60 * 60 * 1000
  })
  
  response
    .status(200)
    .send({ 
      accessToken, 
      username: user.username, 
      name: user.name, 
      id: user._id.toString(), 
      community: user.community.map(comm => comm._id), 
      communityName: user.community.map(comm => comm.name)
    })  
    
  }


// Refresh token

const getRefreshToken = async (request, response) => {
  const refreshToken = request.cookies.jwt

  if (!refreshToken) {
    return response.status(406).json({ error: 'Unauthorized' })
  }

  try {
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET)
  
  const userForToken = {
    username: decoded.username,
    id: decoded.id
  }

   const accessToken = jwt.sign(userForToken, process.env.ACCESS_SECRET, { expiresIn: '1m' })
   

   const decodedUser = await User.findById(userForToken.id)
    .populate('community', { name: 1, _id: 1 })

  const userFrontend = {
    username: decodedUser.username,
    name: decodedUser.name,
    id: decodedUser._id.toString(),
    community: decodedUser.community.map(c => c._id.toString()),
    communityName: decodedUser.community.map(c => c.name)
  }

  console.log('user frontend is', userFrontend)

  return response.json({ accessToken, userFrontend })

  } catch (error) {
    console.log('Refresh token verification failed:', error.message) // for debugging
    return response.status(406).json({ error: 'Unauthorized' })
  }
}

// remove error handler (but include in middleware)


// User log out

const logout = async (request, response) => {
  response.clearCookie('jwt', {
    httpOnly: true,
    secure: false, //set to true on production /deployment
    sameSite: 'Lax'
  })

  return response.status(204).end()
}

module.exports = {
    createAccount,
    usersList,
    login,
    viewOneUser,
    getRefreshToken,
    logout
}