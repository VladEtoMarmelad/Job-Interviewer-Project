import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
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

interface PatchLastQuestionRes {
  nextColumnUpdate: "aiQuestion"|"userAnswer"|"aiSummary"|null;
  lastQuestionId: number|null
}

export const patchLastQuestion = createAsyncThunk("question/patch", async (data: any, {getState}): Promise<PatchLastQuestionRes> => {
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
      return {
        nextColumnUpdate: "userAnswer",
        lastQuestionId: null
      }
    } else if (nextColumnUpdate==="userAnswer") {
      return {
        nextColumnUpdate: "aiSummary",
        lastQuestionId: null
      }
    } else {
      const newQuestion = await addQuestionFunction(data.interviewId)
      return {
        nextColumnUpdate: "aiQuestion",
        lastQuestionId: newQuestion.data.id
      }
    } 
  }
  return {
    nextColumnUpdate: null,
    lastQuestionId: null
  }
})

export const getPrevQuestions = createAsyncThunk("question/get", async (interviewId: number|string) => {
  const prevQuestions = await axios.get(`http://${process.env.EXPO_PUBLIC_IP}:3000/question/findByInterview`, {
    params: {interviewId: interviewId}
  })
  console.log("prevQuestions:", prevQuestions.data)
  console.log("prevQuestionsSorted:", prevQuestions.data.sort((firstQuestion: any, secondQuestion: any) => firstQuestion.id - secondQuestion.id))
  return prevQuestions.data.sort((firstQuestion: any, secondQuestion: any) => firstQuestion.id - secondQuestion.id)
})

export interface QuestionState {
  lastQuestionId: number|null;
  prevQuestions: any;
  nextColumnUpdate: "aiQuestion"|"userAnswer"|"aiSummary"|null;
  showContinueButton: boolean; //show button, that appears between questions
}

interface ChangeStatePayload {
  fieldName: keyof QuestionState; 
  fieldValue: any;
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
    changeInitialState: (state, action: PayloadAction<ChangeStatePayload>): void => {
      const { fieldName, fieldValue } = action.payload
      state[fieldName] = fieldValue
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(addQuestion.fulfilled, (state, action) => {
      console.log(`state.lastQuestionId: ${state.lastQuestionId}`)
      if (state.lastQuestionId!==null) { //if added question wasn't first
        state.showContinueButton=true
      }
      state.lastQuestionId=action.payload.data.id
    })

    .addCase(patchLastQuestion.fulfilled, (state, action) => {
      state.nextColumnUpdate=action.payload.nextColumnUpdate
      if (action.payload.nextColumnUpdate==="aiQuestion" && state.lastQuestionId!==null) { //if new question was created
        state.showContinueButton=true
        state.lastQuestionId=action.payload.lastQuestionId
      }
    })

    .addCase(getPrevQuestions.fulfilled, (state, action) => {
      state.prevQuestions=action.payload
      if (action.payload.length>0) {
        state.lastQuestionId=action.payload[action.payload.length-1].id
      }
    })
  }
})

export const { changeInitialState } = questionSlice.actions
export default questionSlice.reducer