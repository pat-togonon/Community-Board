// view all posts OKs
// view one post Oks
// view all post in a subcategory OK
// edit or delete YOUR post ==> update need validators: true OK except validators
// create posts OK
const Post = require('../models/Post')
const User = require('../models/User')
const Community = require('../models/Community')
const { validSubcategories } = require('../utils/helper')
const { newPostSchema } = require('../validators/content')

const viewAll = async (request, response) => {
  const { communityId, mainCategory } = request.params

  const isCommunityIdValid = await Community.findById(communityId)

  //console.log('request user is', request.user)

  const isCommunityUser = isCommunityIdValid.communityUsers.find(user => user.toString() === request.user._id.toString())

  // need to validate if community includes that user

  if (!isCommunityUser) {
    return response.status(401).json({ error: "Can't view posts outside of your community" })
  }
  
  if (mainCategory === 'home') {
    const homeAllPosts = await Post.find({ community: communityId })
    console.log('home', mainCategory)
    return response.json(homeAllPosts)
  }

  const isMainCategoryValid = Post.schema.path('mainCategory').enumValues.includes(mainCategory)

  if (!isCommunityIdValid || !isMainCategoryValid) {
    return response.status(404).json({ error: 'Oops! Invalid url' })
  }

  const allPosts = await Post.find({ 
    community: communityId,
    mainCategory
  })

  return response.json(allPosts.map(post => post.toJSON()))

}

/*

const viewAllInSubCategory = async (request, response) => {
  const { communityId, mainCategory, subCategory } = request.params

  const isCommunityIdValid = await Community.findById(communityId)
  
  const isMainCategoryValid = Post.schema.path('mainCategory').enumValues.includes(mainCategory)
  
  if (subCategory === 'All') {
    const posts = await Post.find({ mainCategory })
    return response.json(posts)
  }
  
  const isSubCategoryValid = validSubcategories[mainCategory].includes(subCategory)

  if (!isCommunityIdValid || !isMainCategoryValid || !isSubCategoryValid) {
    return response.status(404).json({ error: 'Yaa! Invalid url' })
  }

  const allPostsInCategory = await Post.find({
    mainCategory,
    subCategory
  })

  return response.json(allPostsInCategory)
}
*/
const viewOnePost = async (request, response) => {
  const { communityId, mainCategory, subCategory, postId } = request.params

  const isCommunityIdValid = await Community.findById(communityId)
  
  const isMainCategoryValid = Post.schema.path('mainCategory').enumValues.includes(mainCategory)

  const isSubCategoryValid = validSubcategories[mainCategory].includes(subCategory)

  const list = validSubcategories[mainCategory]

  console.log('subcategory valid?', isSubCategoryValid, 'list', list)

  const post = await Post.findById(postId)

  if (!isCommunityIdValid || !isMainCategoryValid || !isSubCategoryValid || !post) {
    return response.status(404).json({ error: 'Yaa! Invalid url' })
  }

  return response.json(post)

}

const createPost = async (request, response) => {

  const parsedData = newPostSchema.parse(request.body)
  const { communityId, mainCategory, subCategory, title, description, author, startDate, endDate, isFound  } = parsedData

  const communityExists = await Community.findById(communityId)
  const isCommunityActive = communityExists.isApproved

  const validUser = communityExists.communityUsers.find(user => user.toString() === request.user._id.toString())

  console.log('valid user is', validUser)

  if (!communityExists || !isCommunityActive) {
    return response.status(404).json({ error: "Oops! Can't post to an invalid community" })
  }

  if (!validUser) {
    return response.status(401).json({ error: "Oops, invalid! Log in to your community first to post" })
  }

  console.log('community', communityId, 'mainCategory', mainCategory, 'sub category', subCategory, 'title', title, 'author', author)

  if (mainCategory === 'announcement') {
    const validPoster = communityExists.additionalAdmins.includes(request.user._id)
    console.log('valid admin poster?', validPoster)

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
    comments: []
  })

  const savedPost = await post.save() 
  request.user.createdPosts = request.user.createdPosts.concat(savedPost._id)
  await request.user.save()

  console.log('saved user', request.user)

  return response.status(201).json(savedPost.toJSON())
}

const deletePost = async (request, response) => {
  const { communityId, id } = request.params // should I validate via zod?

  const communityValid = await Community.findById(communityId)
  const postToDelete = await Post.findById(id)
  const isPostInTheSameCommunity = postToDelete.community.toString() === communityValid._id.toString()
  const isUserTheAuthor = postToDelete.author.toString() === request.user._id.toString()
  
  if (!communityValid) {
    return response.status(404).json({ error: 'Invalid community' })
  }

  if (!postToDelete) {
    return response.status(204).end()
  }

  if (!isPostInTheSameCommunity || !isUserTheAuthor) {
    return response.status(400).json({ error: "Cannot delete post. Please check if you're the post author or in the correct community" })
  }

  await Comment.deleteMany({ post: postToDelete._id })

  await postToDelete.deleteOne()
  request.user.createdPosts = request.user.createdPosts.filter(post => post.toString() !== postToDelete._id.toString())

  await request.user.save()
  response.status(204).end()

}

const editPost = async (request, response) => {
  const { communityId, id } = request.params // should I validate via zod?
  const editedPost = request.body // validate via zod

  const communityValid = await Community.findById(communityId)
  const postToEdit = await Post.findById(id)
  const isPostInTheSameCommunity = postToEdit.community.toString() === communityValid._id.toString()
  const isUserTheAuthor = postToEdit.author.toString() === request.user._id.toString()
  
  if (!communityValid) {
    return response.status(404).json({ error: 'Invalid community' })
  }

  if (!postToEdit) {
    return response.status(400).json({ error: 'Invalid post' })
  }

  if (!isPostInTheSameCommunity || !isUserTheAuthor) {
    return response.status(400).json({ error: "Cannot edit post. Please check if you're the post author or in the correct community" })
  }

  const postForUpdate = {
    isFound: editedPost.isFound ? editedPost.isFound : false,
    description: editedPost.description ? editedPost.description : postToEdit.description
  }
  const updatedPost = await Post.findByIdAndUpdate(id, postForUpdate, { new: true })

  response.status(200).json(updatedPost)
  
}
module.exports = { viewAll, createPost, viewOnePost, deletePost, editPost }