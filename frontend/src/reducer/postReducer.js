import { createSlice } from "@reduxjs/toolkit"

const postSlice = createSlice({
  name: 'posts',
  initialState: [],
  reducers: {
    setPosts(_state, action) {
      return action.payload
    },
    addPost(state, action) {
      return state.concat(action.payload)
    },
    clearPosts(_state, _action) {
      return []
    }
  }
})

export const { setPosts, addPost, clearPosts } = postSlice.actions

export default postSlice.reducer