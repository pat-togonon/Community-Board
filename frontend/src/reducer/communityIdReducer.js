import { createSlice } from "@reduxjs/toolkit"

const communityIdSlice = createSlice({
  name: 'communityId',
  initialState: '',
  reducers: {
    setCommunityId(state, action) {
      return action.payload      
    }
  }
})

export const { setCommunityId } = communityIdSlice.actions

export default communityIdSlice.reducer