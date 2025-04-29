import { configureStore } from "@reduxjs/toolkit"
import communityIdReducer from './reducer/communityIdReducer'
import userReducer from "./reducer/userReducer"

const store = configureStore({
  reducer: {
    communityId: communityIdReducer,
    user: userReducer
  }
})

export default store