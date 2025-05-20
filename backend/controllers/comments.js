const Post = require('../models/Post')
const Community = require('../models/Community')
const Comment = require('../models/Comment')
const User = require('../models/User')

/*
POST comment

user should be in that community
post the user comments to should be in that community
user should be logged in - so request.user presence which is OK cos of the middleware

*/

const viewAll = async (request, response) => {
  const { communityId } = request.params

  console.log('request user', request.user)

  const communityValid = await Community.findById(communityId)
  console.log('comm valid?', communityValid)

  const isUserPartOfCommunity = communityValid.communityUsers.includes(request.user._id)

  if (!communityValid) {
    return response.status(400).json({ error: 'Invalid community' })
  }

  if (!isUserPartOfCommunity) {
    return response.status(401).json({ error: "You can't view comments outside of your community" })
  }

  const comments = await Comment.find({
    community: communityValid._id
  }).populate('post', { mainCategory: 1, subCategory: 1, id: 1, title: 1, description: 1, community: 1 })

  return response.json(comments)
  

}


const postComment = async (request, response) => {
  const { parentComment, comment } = request.body // Zod validate please
  const { communityId, postId } = request.params

  const communityValid = await Community.findById(communityId)

  const isUserPartOfCommunity = communityValid.communityUsers.includes(request.user._id)

  const post = await Post.findById(postId)

  const isPostInThisCommunity = post.community.toString() === communityId

  if (!communityValid) {
    return response.status(400).json({ error: 'Invalid community' })
  }

  if (!isUserPartOfCommunity || !isPostInThisCommunity) {
    return response.status(401).json({ error: "You can't comment on posts outside of your community" })
  }

  if (!post) {
    return response.status(400).json({ error: 'Invalid post' })
  }

  const newComment = new Comment({
    community: communityValid._id,
    post: post._id,
    comment,
    commenter: request.user._id,
    parentComment,
  })

  const savedComment = await newComment.save()

  request.user.comments = request.user.comments.concat(savedComment._id)
  await request.user.save()

  post.comments = post.comments.concat(savedComment._id)
  await post.save()

  return response.status(201).json(savedComment.toJSON())


}

const viewAllPostComments = async (request, response) => {
  const { communityId, postId } = request.params

  const communityValid = await Community.findById(communityId)

  const isUserPartOfCommunity = communityValid.communityUsers.includes(request.user._id)

  const post = await Post.findById(postId)

  const isPostInThisCommunity = post.community.toString() === communityId

  if (!communityValid) {
    return response.status(400).json({ error: 'Invalid community' })
  }

  if (!isUserPartOfCommunity || !isPostInThisCommunity) {
    return response.status(401).json({ error: "You can't view comments and posts outside of your community" })
  }

  if (!post) {
    return response.status(400).json({ error: 'Invalid post' })
  }
  // top level comments only
  const comments = await Comment.find({ 
    post: postId,
    parentComment: null }).populate('commenter', { _id: 1, username: 1 })
    

  return response.json(comments)
}

module.exports = {
  viewAll,
  postComment,
  viewAllPostComments
}