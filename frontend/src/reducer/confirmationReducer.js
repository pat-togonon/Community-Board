import { createSlice } from "@reduxjs/toolkit"

const confirmationSlice = createSlice({
  name: 'confirmation',
  initialState: null,
  reducers: {
    setConfirmationMessage(_state, action) {
      return action.payload
    },
    resetConfirmationMessage(_state, _action) {
      return null
    }
  }
})

export const { setConfirmationMessage, resetConfirmationMessage } = confirmationSlice.actions

export const notifyConfirmation = (confirmationMessage, time) => {
  return async dispatch => {
    dispatch(setConfirmationMessage(confirmationMessage))
    setTimeout(() => {
      dispatch(resetConfirmationMessage())
    }, time * 1000)
  }
}

export default confirmationSlice.reducer