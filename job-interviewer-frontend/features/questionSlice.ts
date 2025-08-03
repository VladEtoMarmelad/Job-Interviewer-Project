import { createSlice } from '@reduxjs/toolkit'

export interface QuestionState {
  value: number
}

const initialState: QuestionState = {
  value: 0,
}

export const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {

  },
})

export const {  } = questionSlice.actions
export default questionSlice.reducer