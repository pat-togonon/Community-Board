import { createSlice } from "@reduxjs/toolkit"

const subCategorySlice = createSlice({
  name: 'subCategory',
  initialState: 'All',
  reducers: {
    setSubCategory(_state, action) {
      return action.payload
    },
    resetSubCategory(_state, _action) {
      return 'All'
    }
  }
})

export const { setSubCategory, resetSubCategory } = subCategorySlice.actions

export default subCategorySlice.reducer