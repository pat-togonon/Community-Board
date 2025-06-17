const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
//const mongoose = require('mongoose')
const User = require('../models/User')
//const Post = require('../models/Post')
const Community = require('../models/Community')
//const Comment = require('../models/Comment')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const { userRegistrationSchema, loginSchema, updatePasswordSchema, passwordResetSchema } = require('../validators/auth')
const RefreshToken = require('../models/RefreshToken')
const PasswordResetAttempt = require('../models/PasswordResetAttempt')

//user sign up
const createAccount = async (request, response) => {

  const receivedData = request.body

  const dataToParse = {
    username: receivedData.username,
    password: receivedData.password,
    email: receivedData.email,
    communityId: receivedData.communityId,
    birthYear: Number(receivedData.birthYear.trim()),
    chosenSecurityQuestion: receivedData.chosenSecurityQuestion,
    securityAnswer: receivedData.securityAnswer.trim().toLowerCase()  
  }

  const parsedData = userRegistrationSchema.parse(dataToParse)
  const { username, password, email, communityId, birthYear, chosenSecurityQuestion, securityAnswer } = parsedData

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

  const isSecurityQuestionValid = User.schema.path('securityQuestion').enumValues.includes(chosenSecurityQuestion)

  if (!isSecurityQuestionValid) {
    return response.status(403).json({ error: 'Invalid security question. Please choose from valid ones' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const securityAnswerHash = await bcrypt.hash(securityAnswer, saltRounds)

  const user = new User({
    username,
    password,
    email,
    passwordHash,
    community: [communityExists._id],
    isAdmin: false,
    birthYear,
    securityAnswerHash,
    securityQuestion: chosenSecurityQuestion
  })

  const savedUser = await user.save()
  
  communityExists.communityUsers = communityExists.communityUsers.concat(savedUser._id)

  await communityExists.save()
  return response.status(201).json(savedUser)
}

//for user page / profile

// get individual user - but needs validation - community exists and user is part of that community
/*
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
*/
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

  if (!request.body.community && !request.body.username && !request.body.password) {
    return response.status(401).json({
      error: 'Please enter your login details.'
    })
  }
  
  const parsedData = loginSchema.parse(request.body)
  const { username, password, communityId } = parsedData
  
  const user = await User.findOne({ 
    username,
    community: { $in: [communityId] }
     })
    .populate('community', { _id: 1, name: 1 })
    .populate('managedCommunity', { _id: 1, name: 1, communityUsers: 1, description: 1, additionalAdmins: 1 })

  if (!user) {
    return response.status(401).json({
      error: "User is not found or not a member of this community."
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
  
  const userCommunity = await Community.findById(communityId)

  const userForToken = {
    username: user.username,
    id: user._id,
    community: userCommunity._id
  }
  
  const accessToken = jwt.sign(userForToken, process.env.ACCESS_SECRET, { expiresIn: '15m' })
  
  const refreshToken = jwt.sign(userForToken, process.env.REFRESH_SECRET, { expiresIn: '30d'})
  
  response.cookie('jwt', refreshToken, {
    httpOnly: true,
    sameSite: 'Lax', // set to none upon deployment/production
    secure: false, // set to true upon deployment / production
    maxAge: 30 * 24 * 60 * 60 * 1000
  })
  
  //save refreshToken on database

  const saltRounds = 10
  const refreshTokenHash = await bcrypt.hash(refreshToken, saltRounds)

  const newRefreshToken = new RefreshToken({
    user: user._id,
    tokenHash: refreshTokenHash
  })

  await newRefreshToken.save()

  response
    .status(200)
    .send({ 
      accessToken, 
      username: user.username, 
      name: user.name, 
      id: user._id.toString(), 
      communityList: user.community.map(comm => comm._id), 
      community: userCommunity._id,
      communityName: userCommunity.name,
      managedCommunity: user.managedCommunity
    })  
    
  }


// REFRESH token

const getRefreshToken = async (request, response) => {
  const existingRefreshToken = request.cookies.jwt
  
  if (!existingRefreshToken) {
    return response.status(401).json({ error: 'Unauthorized' })
  }

  const decoded = jwt.verify(existingRefreshToken, process.env.REFRESH_SECRET)

  const storedRefreshToken = await RefreshToken.find({ user: decoded.id })

  if (!storedRefreshToken || storedRefreshToken.length === 0) {
    return response.status(403).json({ error: `No refresh token found in database for user ${decoded.id}` })
  }

  // iterate through storedRefreshToken array 
  let foundMatch = false
  let matchedRefreshToken = null

  for (const tokendoc of storedRefreshToken) {
    const isMatch = await bcrypt.compare(existingRefreshToken, tokendoc.tokenHash)

    if (isMatch) {
      foundMatch = true
      matchedRefreshToken = tokendoc
      break
    }
  }

  if (!foundMatch) {
    return response.status(403).json({ error: "Forbidden: Refresh token did not match any stored hashes. Try logging in again" })
  }
  // delete existing and generate new one for better security

  await matchedRefreshToken.deleteOne()
    
  const userForToken = {
    username: decoded.username,
    id: decoded.id,
    community: decoded.community
  }

  const accessToken = jwt.sign(userForToken, process.env.ACCESS_SECRET, { expiresIn: '5m' })
  
  const refreshToken = jwt.sign(userForToken, process.env.REFRESH_SECRET, { expiresIn: '30d' })

  // save to database as hash
  const saltRounds = 10
  const tokenHash = await bcrypt.hash(refreshToken, saltRounds)

  const newRefreshToken = new RefreshToken({
    user: decoded.id,
    tokenHash
  })

  await newRefreshToken.save()

  // then save to cookie

  response.cookie('jwt', refreshToken, {
    httpOnly: true,
    sameSite: 'Lax', // set to none upon deployment/production
    secure: false, // set to true upon deployment / production
    maxAge: 30 * 24 * 60 * 60 * 1000
  })

  const decodedUser = await User.findById(userForToken.id)
    .populate('community', { name: 1, _id: 1 })
    .populate('managedCommunity', { _id: 1, name: 1, communityUsers: 1, description: 1, additionalAdmins: 1 })

  const decodedCommunity = await Community.findById(decoded.community)

  const userFrontend = {
    username: decodedUser.username,
    name: decodedUser.name,
    id: decodedUser._id.toString(),
    community: decodedCommunity._id.toString(),
    communityList: decodedUser.community.map(c => c._id.toString()),
    communityName: decodedCommunity.name,
    managedCommunity: decodedUser.managedCommunity
  }

  return response.status(200).json({ accessToken, userFrontend })

}

// User log out

const logout = async (request, response) => {
  response.clearCookie('jwt', {
    httpOnly: true,
    secure: false, //set to true on production /deployment
    sameSite: 'Lax'
  })

  await RefreshToken.deleteMany({ user: request.user._id })

  return response.status(204).end()
}

// while logged in - need extractor middlewares

const updatePassword = async (request, response) => {

  const { userId } = request.params
  
  const parsedData = updatePasswordSchema.parse(request.body)
  const { oldPassword, newPassword } = parsedData

  const isRequesterTheUser = request.user._id.toString() === userId

  if (!isRequesterTheUser) {
    return response.status(403).json({ error: "Forbidden: Can't update account password you don't own" })
  }

  // identification verification
  const isOldPasswordCorrect = await bcrypt.compare(oldPassword, request.user.passwordHash)

  if (!isOldPasswordCorrect) {
    return response.status(401).json({ error: "Forbidden: Wrong password" })
  }
  
  const saltRounds = 10
  const newPasswordHash = await bcrypt.hash(newPassword, saltRounds)

  await User.findByIdAndUpdate(request.user._id, { passwordHash: newPasswordHash }, {new: true, runValidators: true })

  // delete the refresh cookie
  response.clearCookie('jwt', {
    httpOnly: true,
    secure: false, //set to true on production /deployment
    sameSite: 'Lax'
  })

  // delete the refreshTokenHash on database

  await RefreshToken.deleteMany({ user: request.user._id })

  return response.status(204).end()

}

const passwordReset = async (request, response) => {
  
  if (!request.body.username && !request.body.newPassword && !request.body.securityAnswer && !request.body.securityQuestion) {
    return response.status(401).json({
      error: 'Please fill in all details'
    })
  }
  
  const parsedData = passwordResetSchema.parse(request.body)

  const { username, newPassword, securityQuestion, securityAnswer } = parsedData
  // check number of attempts

  const maxAttemptsPerDay = 3
  const attemptWindow = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  const recentAttempts = await PasswordResetAttempt.countDocuments({ 
    user: username,
    timestamp: { $gte: new Date(Date.now() - attemptWindow)}
  })

  if (recentAttempts >= maxAttemptsPerDay) {
    return response.status(429).json({ error: 'Too many password reset requests. Please try again later' })
  }

  // check if username is valid and existing

  const validUser = await User.findOne({ username })

  if (!validUser) {

    const newAttempt = new PasswordResetAttempt({
      user: username,
      timestamp: new Date()
    })
  
    await newAttempt.save()

    return response.status(401).json({ error: 'Invalid username or security questions or answer. Please try again later' })
  }

  const newAttempt = new PasswordResetAttempt({
    user: validUser.username,
    timestamp: new Date()
  })

  await newAttempt.save()

  const isSecurityQuestionCorrect = validUser.securityQuestion === securityQuestion

  const isSecurityAnswerCorrect = await bcrypt.compare(securityAnswer.toLowerCase(), validUser.securityAnswerHash)

  if (!(isSecurityQuestionCorrect && isSecurityAnswerCorrect)) {
    return response.status(403).json({ error: 'Invalid username or security questions or answer. Please try again later' })
  }

  const saltRounds = 10
  const newPasswordHash = await bcrypt.hash(newPassword, saltRounds)

  await User.findByIdAndUpdate(validUser._id, { passwordHash: newPasswordHash }, { new: true, runValidators: true })

  await RefreshToken.deleteMany({ user: validUser._id })

  await PasswordResetAttempt.deleteMany({ user: username })

  return response.status(200).json({ message: 'Password reset successfully. Please log in again with your new password' })

}


module.exports = {
    createAccount,
    login,
    //viewOneUser,
    getRefreshToken,
    logout,
    updatePassword,
    passwordReset
}