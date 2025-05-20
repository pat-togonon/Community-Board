const userRouter = require("express").Router()
const { addToFavorites, viewAllFavoritePosts, removeFromFavorites} = require('../controllers/user')

userRouter.put('/favorites', addToFavorites)
userRouter.get('/favorites/:communityId', viewAllFavoritePosts)
userRouter.delete('/favorites/:postId', removeFromFavorites)

module.exports = userRouter