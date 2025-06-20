const Post = require('../models/Post')
const Community = require('../models/Community')
const Comment = require('../models/Comment')
const { newCommentSchema, editCommentSchema } = require('../validators/comment')

const viewAll = async (request, response) => {
  const { communityId } = request.params

  const communityValid = await Community.findById(communityId)
  
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
    .populate('commenter', { id: 1, username: 1 })

  return response.json(comments)

}

const postComment = async (request, response) => {
  
  const parsedData = newCommentSchema.parse(request.body)
  const { parentComment, comment } = parsedData
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

const editComment = async (request, response) => {
  const { commentId } = request.params

  const parsedData = editCommentSchema.parse(request.body)
  const { comment } = parsedData

  const commentToUpdate = await Comment.findOne({
    _id: commentId,
    commenter: request.user._id, // is user the commenter
    community: { $in: request.user.community } // is it inside user's community
  })  

  if (!commentToUpdate) {
    return response.status(404).json({ error: "Comment not found or you don't have permission to edit it" })
  }

  const updatedComment = await Comment.findByIdAndUpdate(commentToUpdate._id, { comment }, { new: true, runValidators: true })

  return response.status(200).json(updatedComment)

}

const deleteComment = async (request, response) => {
  const { commentId } = request.params

  const commentToDelete = await Comment.findOne({
    _id: commentId,
    commenter: request.user._id,
    community: { $in: request.user.community }
  })

  if (!commentToDelete) {
    return response.status(410).json({ error: "Comment not found, already deleted or you're forbidden to delete this comment." })
  }

  await Comment.findByIdAndDelete(commentToDelete._id)

  return response.status(204).end()

}

module.exports = {
  viewAll,
  postComment,
  viewAllPostComments, 
  editComment,
  deleteComment
}