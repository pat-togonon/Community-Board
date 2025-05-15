const { viewAll, viewOnePost, createPost } = require('../controllers/posts')
const postRouter = require('express').Router()

postRouter.get('/:communityId/:mainCategory', viewAll)
//postRouter.get('/:communityId/:mainCategory/:subCategory', viewAllInSubCategory)
postRouter.get('/:communityId/:mainCategory/:subCategory/:postId', viewOnePost)
postRouter.post('/:communityId/:mainCategory/:subCategory', createPost)

module.exports = postRouter


