import { createSlice } from "@reduxjs/toolkit"

const commentSlice = createSlice({
  name: 'comments',
  initialState: [],
  reducers: {
    setComments(state, action) {
      return action.payload
    },
    clearComments(state, action) {
      return []
    }
  }
})

export const { setComments, clearComments } = commentSlice.actions

export default commentSlice.reducer