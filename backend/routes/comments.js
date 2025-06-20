const commentRouter = require('express').Router()
const { viewAll, viewAllPostComments, postComment, editComment, deleteComment } = require('../controllers/comments')

commentRouter.get('/:communityId/all', viewAll)
commentRouter.get('/:communityId/:mainCategory/:subCategory/:postId/all', viewAllPostComments)
commentRouter.post('/:communityId/:mainCategory/:subCategory/:postId/comment', postComment)
commentRouter.put('/:commentId', editComment)
commentRouter.delete('/:commentId', deleteComment)


module.exports = commentRouter

