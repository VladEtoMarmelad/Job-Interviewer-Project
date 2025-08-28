import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

interface InterviewState {
  interview: any;

  //ChatSettings
  showChat: boolean;
  disableChat: boolean;
  chatHeight: number;
}

interface ChangeStatePayload {
  fieldName: keyof InterviewState; 
  fieldValue: any;
}

const initialState: InterviewState = {
  interview: null,
  showChat: true,
  disableChat: false,
  chatHeight: 100
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
    changeInitialState: (state: any, action: PayloadAction<ChangeStatePayload>): void => {
      const { fieldName, fieldValue } = action.payload
      state[fieldName] = fieldValue 
    }
  },
  extraReducers: (builder) => {
    builder
  
    .addCase(getInterviewById.fulfilled, (state, action) => {
      state.interview=action.payload
    })
  }
})

export const { changeInitialState } = interviewSlice.actions
export default interviewSlice.reducer