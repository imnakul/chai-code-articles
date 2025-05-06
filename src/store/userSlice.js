import { createSlice } from '@reduxjs/toolkit'

const initialState = {
   loggedIn: false,
   userInfo: {},
   userToken: null,
}

const userSlice = createSlice({
   name: 'user',
   initialState,
   reducers: {
      login(state, action) {
         state.loggedIn = true
         state.userInfo = action.payload.userInfo
         state.userToken = action.payload.userToken
      },
      logout(state) {
         state.loggedIn = false
         state.userInfo = null
         state.userToken = null
      },
   },
})

export const { login, logout } = userSlice.actions
export default userSlice.reducer
