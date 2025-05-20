const commentRouter = require('express').Router()
const { viewAll, viewAllPostComments, postComment } = require('../controllers/comments')

commentRouter.get('/:communityId/comments/all', viewAll)
commentRouter.get('/:communityId/:mainCategory/:subCategory/:postId/comments', viewAllPostComments)
commentRouter.post('/:communityId/:mainCategory/:subCategory/:postId/comments', postComment)


module.exports = commentRouter