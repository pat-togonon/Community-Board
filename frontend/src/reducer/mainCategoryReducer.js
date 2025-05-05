import { createSlice } from "@reduxjs/toolkit"

const mainCategorySlice = createSlice({
  name: 'mainCategory',
  initialState: '',
  reducers: {
    setMainCategory(state, action) {
      return action.payload
    }
  }
})

export const { setMainCategory } = mainCategorySlice.actions

export default mainCategorySlice.reducer