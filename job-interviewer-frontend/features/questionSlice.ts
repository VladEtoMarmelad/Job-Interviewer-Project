import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const addQuestionFunction = async (interviewId: number|string): Promise<any> => {
  try {
    const newQuestion = await axios.post(`http://${process.env.EXPO_PUBLIC_IP}:3000/question/add`, {
      aiQuestion: "",
      userAnswer: "",
      aiSummary: "",
      interviewId
    })
    console.log("newQuestion:", newQuestion)
    return newQuestion
  } catch (error) {
    console.error(error)
  }
}

export const addQuestion = createAsyncThunk("question/add", async (interviewId: number|string) => {
  return addQuestionFunction(interviewId)
})

export const patchLastQuestion = createAsyncThunk("question/patch", async (data: any, {getState}): Promise<"aiQuestion"|"userAnswer"|"aiSummary"|null> => {
  const state: any = getState();
  const { nextColumnUpdate, lastQuestionId } = state.questions
  console.log("patchData:")
  console.log({
    questionId: lastQuestionId,
    columnName: nextColumnUpdate,
    columnValue: data.columnValue
  })
  const res = await axios.patch(`http://${process.env.EXPO_PUBLIC_IP}:3000/question/update`, {
    questionId: lastQuestionId,
    columnName: nextColumnUpdate,
    columnValue: data.columnValue
  })
  console.log("patchRes:", res)
  if (res.status===200) {
    if (nextColumnUpdate==="aiQuestion") {
      return "userAnswer"
    } else if (nextColumnUpdate==="userAnswer") {
      return "aiSummary"
    } else {
      addQuestionFunction(data.interviewId)
      return "aiQuestion"
    } 
  }
  return null
})

export const getPrevQuestions = createAsyncThunk("question/get", async (interviewId: number|string) => {
  const prevQuestions = await axios.get(`http://${process.env.EXPO_PUBLIC_IP}:3000/question/findByInterview`, {
    params: {interviewId: interviewId}
  })

  return prevQuestions.data
})

export interface QuestionState {
  lastQuestionId: number|null
  prevQuestions: any,
  nextColumnUpdate: "aiQuestion"|"userAnswer"|"aiSummary"|null,
  showContinueButton: boolean //show button, that appears between questions or no
}

const initialState: QuestionState = {
  lastQuestionId: null,
  prevQuestions: [],
  nextColumnUpdate: "aiQuestion",
  showContinueButton: false
}

export const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    changeNextColumnUpdate: (state, action): void => {
      state.nextColumnUpdate=action.payload
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(addQuestion.fulfilled, (state, action) => {
      state.lastQuestionId=action.payload.data.id
    })

    .addCase(patchLastQuestion.fulfilled, (state, action) => {
      state.nextColumnUpdate=action.payload
    })

    .addCase(getPrevQuestions.fulfilled, (state, action) => {
      state.prevQuestions=action.payload
      if (action.payload.length>0) {
        state.lastQuestionId=action.payload[action.payload.length-1].id
      }
    })
  }
})

export const { changeNextColumnUpdate } = questionSlice.actions
export default questionSlice.reducer