const communityRouter = require('express').Router()
const User = require('../models/User')
const Community = require('../models/Community')
const bcrypt = require('bcrypt')

communityRouter.post('/', async (request, response) => {
  const { username, email, password, communityName, communityDescription } = request.body

  if (!password || password.length < 5) {
    return response.status(400).json({ error: 'Password length should be at least 5 characters'})
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    email,
    passwordHash,
    isAdmin: true,
    isCommunityAdmin: true,
    managedCommunities: []
  })

  const savedUser = await user.save()

  const community = new Community({
    name: communityName,
    description: communityDescription,
    admin: savedUser._id,
    additionalAdmins: [savedUser._id],
    isApproved: true
  })

  const savedCommunity = await community.save()

  savedUser.managedCommunity = savedCommunity._id
  savedUser.community = savedCommunity._id

  response.status(201).json({ user: savedUser.toJSON(), community: savedCommunity.toJSON(), message: 'Community and admin user created successfully' })
  
})

module.exports = communityRouter