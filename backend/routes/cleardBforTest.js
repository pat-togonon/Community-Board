const clearDbTestRouter = require('express').Router()
const Comment = require('../models/Comment')
const User = require('../models/User')
const Community = require('../models/Community')
const Post = require('../models/Post')
const RefreshToken = require('../models/RefreshToken')
const PasswordResetAttempt = require('../models/PasswordResetAttempt')


clearDbTestRouter.post('/reset', async (_request, response) => {
  await Community.deleteMany({})
  await User.deleteMany({})
  await Post.deleteMany({})
  await Comment.deleteMany({})
  await RefreshToken.deleteMany({})
  await PasswordResetAttempt.deleteMany({})

  response.status(204).end()
})
  

module.exports = clearDbTestRouter