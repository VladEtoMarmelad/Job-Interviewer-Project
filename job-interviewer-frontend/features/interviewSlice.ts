import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export interface InterviewState {
  interview: any;
}

const initialState: InterviewState = {
  interview: null
}

export const getInterviewById = createAsyncThunk("interview/findOne", async (interviewId: number) => {
  const interview = await axios.get(`http://${process.env.EXPO_PUBLIC_IP}:3000/interview/findOne`, {
    params: {interviewId}
  })
  return interview.data
})

export const deleteInterview = createAsyncThunk("interview/delete", async (interviewId: number) => {
  const deleteRes = await axios.delete(`http://${process.env.EXPO_PUBLIC_IP}:3000/interview/delete`, {
    params: {interviewId}
  })
  console.log("deleteRes:", deleteRes)
  return deleteRes
})

export const putInterview = createAsyncThunk("interview/put", async (interviewData: any) => {
  const putRes = await axios.put(`http://${process.env.EXPO_PUBLIC_IP}:3000/interview/put`, interviewData)
  console.log("putRes:", putRes)
  return putRes
})

export const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
  
    .addCase(getInterviewById.fulfilled, (state, action) => {
      state.interview=action.payload
    })
  }
})

export const {  } = interviewSlice.actions
export default interviewSlice.reducer