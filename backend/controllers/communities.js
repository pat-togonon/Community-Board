const communityRouter = require('express').Router()
const User = require('../models/User')
const Community = require('../models/Community')
const bcrypt = require('bcrypt')

communityRouter.get('/', async (request, response) => {
  const communityList = await Community.find({})
  return response.json(communityList)
})

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
    additionalAdmins: [savedUser._id]
  })
  // isApproved - manual after interview. Can add in a PUT method here

  const savedCommunity = await community.save()

  savedUser.managedCommunity = savedCommunity._id
  savedUser.community = savedCommunity._id
  await savedUser.save() //note: need to test - if the admin is tied to community upon registration

  response.status(201).json({ user: savedUser.toJSON(), community: savedCommunity.toJSON(), message: 'Community and admin user created successfully' })
  
})

module.exports = communityRouter

/*

To add on later:

1. PUT request (adding in or removing additional admins)
2. Each community can only have one communityAdmin (the main one). If need to change to another user, need a route for this also - might need to delete the original community admin with the update
3. DELETE request for an entire community? - need poll from its userbase/community members - at least 80% agree
4. Error handling - there's a middleware for this also for overall error handling



*/