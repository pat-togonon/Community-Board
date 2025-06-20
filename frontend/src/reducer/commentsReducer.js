import { createSlice } from "@reduxjs/toolkit"

const commentSlice = createSlice({
  name: 'comments',
  initialState: [],
  reducers: {
    setComments(_state, action) {
      return action.payload
    },
    clearComments(_state, _action) {
      return []
    }
  }
})

export const { setComments, clearComments } = commentSlice.actions

export default commentSlice.reducer