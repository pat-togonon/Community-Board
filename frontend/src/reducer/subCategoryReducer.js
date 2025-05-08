import { createSlice } from "@reduxjs/toolkit"

const subCategorySlice = createSlice({
  name: 'subCategory',
  initialState: 'All',
  reducers: {
    setSubCategory(state, action) {
      return action.payload
    },
    resetSubCategory(state, action) {
      return 'All'
    }
  }
})

export const { setSubCategory, resetSubCategory } = subCategorySlice.actions

export default subCategorySlice.reducer