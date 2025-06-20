import { createSlice } from "@reduxjs/toolkit"

const communityIdSlice = createSlice({
  name: 'communityId',
  initialState: '',
  reducers: {
    setCommunityId(_state, action) {
      return action.payload      
    },
    clearCommunityId(_state, _action) {
      return ''
    }
  }
})

export const { setCommunityId, clearCommunityId } = communityIdSlice.actions

export default communityIdSlice.reducer