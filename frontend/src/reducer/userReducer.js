import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  accessToken: null,
  username: null,
  name: null,
  id: null,
  community: null,
  communityName: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    logout(state, action) {
      return {}
    },
    setNewAccessToken(state, action) {
      return { ...state, accessToken: action.payload }
    }
  }
})

export const { setUser, logout, setNewAccessToken } = userSlice.actions

export default userSlice.reducer
