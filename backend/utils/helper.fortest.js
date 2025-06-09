// sign up with
// login with
// register community with
// create post with
// create comment with

const User = require('../models/User')
const Community = require('../models/Community')
const RefreshToken = require('../models/RefreshToken')
const PasswordResetAttempt = require('../models/PasswordResetAttempt')
const Post = require('../models/Post')
const Comment = require('../models/Comment')


const createCommunityData = {
  communityName: "Test City",
  communityDescription: "The Community for Testing Only",
  username: "testAdmin",
  password: "secret123",
  email: "testAdmin@gmail.com",
  birthYear: "1994",
  chosenSecurityQuestion: "in-what-city-were-you-born",
  securityAnswer: "bulacan"
}

const createCommunityData2 = {
  communityName: "Test City 2",
  communityDescription: "The Community for Testing Only",
  username: "testAdmin02",
  password: "secret123",
  email: "testAdmin02@gmail.com",
  birthYear: "1994",
  chosenSecurityQuestion: "in-what-city-were-you-born",
  securityAnswer: "bulacan"
}

const loginAdminData2 = {
  username: "testAdmin02",
  password: "secret123"
}

const signUpData = {
  username: "testUser1",
  password: "secretUser1",
  email: "testUser1@gmail.com",
  birthYear: "1994",
  chosenSecurityQuestion: "in-what-city-were-you-born",
  securityAnswer: "bulacan"
} // need to spread and add in communitySaved._id oks?

const signUpData2 = {
  username: "testUser2",
  password: "secretUser2",
  email: "testUser2@gmail.com",
  birthYear: "1994",
  chosenSecurityQuestion: "in-what-city-were-you-born",
  securityAnswer: "bulacan"
} 

const loginAdminData = {
  username: "testAdmin",
  password: "secret123"
} // need to spread and add in communitySaved._id oks?

const communityListInDb = async () => {
 return await Community.find({})
}

const usersInDb = async () => {
  return await User.find({})
}

const refreshTokenInDb = async () => {
  return await RefreshToken.find({})
}

const passwordResetAttemptInDb = async () => {
  return await PasswordResetAttempt.find({})
}

const postsInDb = async () => {
  return await Post.find({})
}

const newPost = {
  mainCategory: 'lost-and-found',
  subCategory: 'lost',
  title: 'Lost my tissue pack yesterday',
  description: 'Hey everyone! Have you seen a pink tissue pack nearby 12 Test St?'
}

const editedPostDescription = {
  description: 'Hey everyone! Have you seen a pink tissue pack nearby 12 Test St? Edit: Please please please'
}

const newComment1 = {
  comment: "Hope to find it soonest!",
  parentComment: null
}
const newComment2 = {
  comment: "I'm from another community",
  parentComment: null
}

const commentsInDb = async () => {
  return await Comment.find({})
}





module.exports = {
  createCommunityData,
  createCommunityData2,
  signUpData,
  signUpData2,
  loginAdminData,
  loginAdminData2,
  communityListInDb,
  usersInDb,
  refreshTokenInDb,
  passwordResetAttemptInDb,
  postsInDb,
  newPost,
  editedPostDescription,
  newComment1,
  newComment2,
  commentsInDb
}