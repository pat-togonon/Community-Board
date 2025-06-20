import { createSlice } from "@reduxjs/toolkit"

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState: [],
  reducers: {
    setFavoritePosts(_state, action) {
      return action.payload
    },
    clearFavoritePosts(_state, _action) {
      return []
    }
  }
})

export const { setFavoritePosts, clearFavoritePosts } = favoriteSlice.actions

export default favoriteSlice.reducer