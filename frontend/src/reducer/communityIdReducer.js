import { createSlice } from "@reduxjs/toolkit"

const communityIdSlice = createSlice({
  name: 'communityId',
  initialState: '',
  reducers: {
    setCommunityId(state, action) {
      return action.payload      
    },
    clearCommunityId(state, action) {
      return ''
    }
  }
})

export const { setCommunityId, clearCommunityId } = communityIdSlice.actions

export default communityIdSlice.reducer