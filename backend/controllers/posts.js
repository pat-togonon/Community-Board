const Post = require('../models/Post')
const Comment = require('../models/Comment')
const Community = require('../models/Community')
const { validSubcategories } = require('../utils/helper')
const { newPostSchema, editedPostSchema } = require('../validators/content')

const viewAll = async (request, response) => {
  const { communityId, mainCategory } = request.params

  const isCommunityIdValid = await Community.findById(communityId)

  const isCommunityUser = isCommunityIdValid.communityUsers.find(user => user.toString() === request.user._id.toString())

  // need to validate if community includes that user

  if (!isCommunityUser) {
    return response.status(401).json({ error: "Can't view posts outside of your community" })
  }
  
  if (mainCategory === 'home') {
    const homeAllPosts = await Post.find({ community: communityId })
    return response.json(homeAllPosts.map(post => post.toJSON()))
  }

  const isMainCategoryValid = Post.schema.path('mainCategory').enumValues.includes(mainCategory)

  if (!isCommunityIdValid || !isMainCategoryValid) {
    return response.status(404).json({ error: 'Oops! Invalid url' })
  }

  const allPosts = await Post.find({ 
    community: communityId,
    mainCategory
  }).populate('author', { id: 1, username: 1 })

  return response.json(allPosts.map(post => post.toJSON()))

}

const viewOnePost = async (request, response) => {
  const { communityId, mainCategory, subCategory, postId } = request.params

  const isCommunityIdValid = await Community.findById(communityId)
  
  const isMainCategoryValid = Post.schema.path('mainCategory').enumValues.includes(mainCategory)

  const isSubCategoryValid = validSubcategories[mainCategory].includes(subCategory)

  const post = await Post.findById(postId)

  if (!isCommunityIdValid || !isMainCategoryValid || !isSubCategoryValid || !post) {
    return response.status(404).json({ error: 'Invalid post or url.' })
  }

  return response.json(post)

}

const createPost = async (request, response) => {

  const parsedData = newPostSchema.parse(request.body)
  const { communityId, mainCategory, subCategory, title, description, author, startDate, endDate } = parsedData

  const communityExists = await Community.findById(communityId)

  const isCommunityActive = communityExists.isApproved

  const validUser = communityExists.communityUsers.find(user => user.toString() === request.user._id.toString())

  if (!communityExists || !isCommunityActive) {
    return response.status(404).json({ error: "Oops! Can't post to an invalid community" })
  }

  if (!validUser) {
    return response.status(401).json({ error: "Oops, invalid! Log in to your community first to post" })
  }

  if (mainCategory === 'announcement') {
    const validPoster = communityExists.additionalAdmins.includes(request.user._id)

    if (!validPoster) {
      return response.status(401).json({ error: 'Only community admins can post announcements'
      })
    }
  }

  const post = new Post({
    community: communityExists._id,
    mainCategory,
    subCategory,
    title,
    description,
    author,
    startDate: startDate ? new Date(startDate) : null,
    endDate: endDate ? new Date(endDate) : null,
    comments: [],
    isFound: false
  })

  const savedPost = await post.save() 
  request.user.createdPosts = request.user.createdPosts.concat(savedPost._id)
  await request.user.save()

  return response.status(201).json(savedPost.toJSON())
}

const deletePost = async (request, response) => {
  const { communityId, id } = request.params

  const postToDelete = await Post.findOne({
    _id: id,
    community: communityId,
    author: request.user._id
  })  

  if (!postToDelete) {
    return response.status(410).json({ error: "Post not found, already deleted or you're forbidden to delete this post." })
  }

  await Comment.deleteMany({ post: postToDelete._id })

  await postToDelete.deleteOne()

  request.user.createdPosts = request.user.createdPosts.filter(post => post.toString() !== postToDelete._id.toString())

  await request.user.save()

  response.status(204).end()
}

const editPost = async (request, response) => {
  const { communityId, id } = request.params
  const editedPost = editedPostSchema.parse(request.body)

  const postToEdit = await Post.findOne({
    _id: id,
    community: communityId,
    author: request.user._id
  })
  

  if (!postToEdit) {
    return response.status(410).json({ error: "Post not found or invalid author or community." })
  }
  
  const postForUpdate = {
    isFound: editedPost.isFound ? editedPost.isFound : postToEdit.isFound,
    description: editedPost.description ? editedPost.description : postToEdit.description
  }
  const updatedPost = await Post.findByIdAndUpdate(id, postForUpdate, { new: true })

  response.status(200).json(updatedPost)
  
  }

module.exports = { viewAll, createPost, viewOnePost, deletePost, editPost }