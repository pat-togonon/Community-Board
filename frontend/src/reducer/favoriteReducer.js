import { createSlice } from "@reduxjs/toolkit"

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState: [],
  reducers: {
    setFavoritePosts(state, action) {
      return action.payload
    },
    clearFavoritePosts(state, action) {
      return []
    }
  }
})

export const { setFavoritePosts, clearFavoritePosts } = favoriteSlice.actions

export default favoriteSlice.reducer