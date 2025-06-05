const communityRouter = require('express').Router()
const User = require('../models/User')
const Community = require('../models/Community')
const bcrypt = require('bcrypt')
const { communityRegistrationSchema } = require('../validators/community')
const { tokenExtractor, userExtractor } = require('../utils/middleware')

communityRouter.get('/', async (request, response) => {
  const activeCommunityList = await Community.find({ isApproved: true })
  return response.json(activeCommunityList)
})

communityRouter.get('/:id', tokenExtractor, userExtractor, async (request, response) => {

  const currentCommunity = await Community.findOne({
    _id: request.params.id,
    communityUsers: { $in: [request.user._id] }
  })

  if (!currentCommunity) {
    return response.status(404).json({ error: "Community not found or you are not a member of this community." })
  }

  return response.json(currentCommunity)
})

communityRouter.post('/', async (request, response) => {

  const receivedData = request.body

  const yearToday = new Date().getFullYear()
  console.log('year today', yearToday)

  const dataToParse = {
    username: receivedData.username,
    password: receivedData.password,
    email: receivedData.email,
    communityName: receivedData.communityName,
    communityDescription: receivedData.communityDescription,
    birthYear: Number(receivedData.birthYear.trim()),
    chosenSecurityQuestion: receivedData.chosenSecurityQuestion,
    securityAnswer: receivedData.securityAnswer.toLowerCase()  
  }

  if (yearToday - dataToParse.birthYear < 18) {
    return response.status(403).json({ error: "You must be at least 18 years old to register a local community." })
  }
  
  const parsedData = communityRegistrationSchema.parse(dataToParse)
  const { username, email, password, communityName, communityDescription, chosenSecurityQuestion, securityAnswer } = parsedData

  const communityExists = await Community.findOne({ name: communityName })

  if (communityExists) {
    return response.status(400).json({ error: 'Community already exists' })
  }
 
/* REVISIT - flow for existing user creating a new community

  const userExists = await User.findOne({ username })
  const emailExists = await User.findOne({ email })

  if (userExists || emailExists)

  */

  if (!password || password.length < 5) {
    return response.status(400).json({ error: 'Password length should be at least 5 characters'})
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const securityAnswerHash = await bcrypt.hash(securityAnswer, saltRounds)

  // if from a non-existing user. If a user exists and registered a community, need to have a separate checker here. Example if (user) { await user.findOne({}) } -- need to push or concat community IDs and managedcommunity

  const user = new User({
    username,
    email,
    passwordHash,
    isAdmin: true,
    managedCommunity: [],
    community: [],
    securityQuestion: chosenSecurityQuestion,
    securityAnswerHash
  })

  const savedUser = await user.save()

  const community = new Community({
    name: communityName,
    description: communityDescription,
    admin: savedUser._id,
    additionalAdmins: [savedUser._id],
    communityUsers: [savedUser._id],
    isApproved: true
  })
  
  const savedCommunity = await community.save()

  savedUser.managedCommunity = savedUser.managedCommunity.concat(savedCommunity._id)
  savedUser.community = savedUser.community.concat(savedCommunity._id)
  await savedUser.save()

  response.status(201).json({ user: savedUser, community: savedCommunity, message: 'Community and admin user created successfully' })
  
})

module.exports = communityRouter

/*

To add on later:

1. PUT request (adding in or removing additional admins)
2. Each community can only have one communityAdmin (the main one). If need to change to another user, need a route for this also - might need to delete the original community admin with the update
3. DELETE request for an entire community? - need poll from its userbase/community members - at least 80% agree
4. Error handling - there's a middleware for this also for overall error handling



*/