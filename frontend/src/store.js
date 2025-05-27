import { configureStore } from "@reduxjs/toolkit"
import communityIdReducer from './reducer/communityIdReducer'
import userReducer from "./reducer/userReducer"
import mainCategoryReducer from './reducer/mainCategoryReducer'
import subCategoryReducer from './reducer/subCategoryReducer'
import postReducer from './reducer/postReducer'
import favoriteReducer from './reducer/favoriteReducer'
import commentReducer from './reducer/commentsReducer'
import errorReducer from './reducer/errorReducer'
import confirmationReducer from './reducer/confirmationReducer'


const store = configureStore({
  reducer: {
    communityId: communityIdReducer,
    user: userReducer,
    mainCategory: mainCategoryReducer,
    subCategory: subCategoryReducer,
    posts: postReducer,
    favorites: favoriteReducer,
    comments: commentReducer,
    error: errorReducer,
    confirmation: confirmationReducer
  }
})

export default store