import { createSlice } from "@reduxjs/toolkit"

const postSlice = createSlice({
  name: 'posts',
  initialState: [],
  reducers: {
    setPosts(state, action) {
      return action.payload
    },
    addPost(state, action) {
      return state.concat(action.payload)
    }
  }
})

export const { setPosts, addPost } = postSlice.actions

export default postSlice.reducer