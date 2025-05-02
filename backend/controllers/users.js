const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')
const Post = require('../models/Post')
const Community = require('../models/Community')
const Comment = require('../models/Comment')

/*
// DO NOT SHOW cos contains list of users - privacy 
usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  return response.json(users.map(user => user.toJSON()))
})
*/

//create new users
usersRouter.post('/', async (request, response) => {
  const { username, password, email, communityId } = request.body

  if (!password || password.length < 5) {
    return response.status(400).json({ error: 'Password should have at least 5 characters' })
  }

  if (!communityId) {
    return response.status(400).json({ error: 'Please select a community' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    password,
    email,
    passwordHash,
    community: communityId
  })

  //the way to link each other is through ID

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

//for user page / profile

usersRouter.get('/:id', async (request, response) => {
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

})

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
module.exports = usersRouter