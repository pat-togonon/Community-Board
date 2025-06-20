import { createSlice } from "@reduxjs/toolkit"

const mainCategorySlice = createSlice({
  name: 'mainCategory',
  initialState: 'home',
  reducers: {
    setMainCategory(_state, action) {
      return action.payload
    },
    clearMainCategory(_state, _action) {
      return 'home'
    }
  }
})

export const { setMainCategory, clearMainCategory } = mainCategorySlice.actions

export default mainCategorySlice.reducer