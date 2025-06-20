import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  accessToken: null,
  username: null,
  name: null,
  id: null,
  community: null,
  communityList: [],
  communityName: [],
  managedCommunity: []
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(_state, action) {
      return action.payload
    },
    logout(_state, _action) {
      return {}
    },
    setNewAccessToken(state, action) {
      return { ...state, accessToken: action.payload }
    }, 
    setName(state, action) {
      return { ... state, name: action.payload}
    },
    isLoggedIn(_state, action) {
      return action.payload
    }
  }
})

export const { setUser, logout, setNewAccessToken, setName } = userSlice.actions

export default userSlice.reducer
