import { createSlice } from '@reduxjs/toolkit'

const errorSlice = createSlice({
  name: 'error',
  initialState: null,
  reducers: {
    setErrorMessage(_state, action) {
      return action.payload
    },
    resetErrorMessage(_state, _action) {
      return null
    }
  }
})

export const { setErrorMessage, resetErrorMessage } = errorSlice.actions

export const notifyError = (errorMessage, time) => {
  return async (dispatch) => {
    dispatch(setErrorMessage(errorMessage))
    setTimeout(() => {
      dispatch(resetErrorMessage())
    }, time * 1000)

  }
}

export default errorSlice.reducer