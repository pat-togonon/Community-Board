import { configureStore } from "@reduxjs/toolkit"
import communityIdReducer from './reducer/communityIdReducer'
import userReducer from "./reducer/userReducer"
import mainCategoryReducer from './reducer/mainCategoryReducer'


const store = configureStore({
  reducer: {
    communityId: communityIdReducer,
    user: userReducer,
    mainCategory: mainCategoryReducer
  }
})

export default store