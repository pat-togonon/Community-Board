const authRouter = require('express').Router()
const { createAccount, login, getRefreshToken, logout, updatePassword, passwordReset } = require('../controllers/auth')
const middleware = require('../utils/middleware')

// user registration and details
authRouter.post('/users', createAccount)
//authRouter.get('/users/:id', middleware.tokenExtractor, middleware.userExtractor, viewOneUser) in public url list on frontend

//user login
authRouter.post('/login', login)

// get refresh token
authRouter.post('/refresh', getRefreshToken)

//log out
authRouter.post('/logout', middleware.tokenExtractor, middleware.userExtractor, logout)

//update password
authRouter.put('/password-update/:userId', middleware.tokenExtractor, middleware.userExtractor, updatePassword)

//forgot password
authRouter.put('/password-reset', passwordReset)

module.exports = authRouter
