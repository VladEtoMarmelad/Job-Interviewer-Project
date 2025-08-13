import { createSlice } from '@reduxjs/toolkit'

export interface SessionState {
  user: any;
  status: "authenticated"|"unauthenticated"|"loading"
}

const initialState: SessionState = {
  user: null,
  status: "loading"
}

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    }
  }
})

export const { setUser } = sessionSlice.actions
export default sessionSlice.reducer