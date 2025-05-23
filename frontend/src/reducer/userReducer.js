import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  accessToken: null,
  username: null,
  name: null,
  id: null,
  community: null,
  communityList: [],
  communityName: [],
  managedCommunity: [],
  isLoggedIn: false
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      return { ...action.payload, isLoggedIn: true }
    },
    logout(state, action) {
      return {}
    },
    setNewAccessToken(state, action) {
      return { ...state, accessToken: action.payload }
    }, 
    setName(state, action) {
      return { ... state, name: action.payload}
    },
    isLoggedIn(state, action) {
      return action.payload
    }
  }
})

export const { setUser, logout, setNewAccessToken, setName, isLoggedIn } = userSlice.actions

export default userSlice.reducer
