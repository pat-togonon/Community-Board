import { createSlice } from "@reduxjs/toolkit"

const mainCategorySlice = createSlice({
  name: 'mainCategory',
  initialState: 'home',
  reducers: {
    setMainCategory(state, action) {
      return action.payload
    },
    clearMainCategory(state, action) {
      return 'home'
    }
  }
})

export const { setMainCategory, clearMainCategory } = mainCategorySlice.actions

export default mainCategorySlice.reducer