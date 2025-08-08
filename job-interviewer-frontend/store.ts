import { configureStore } from '@reduxjs/toolkit'
import questionsReducer from '@/features/questionSlice'
import interviewsReducer from '@/features/interviewSlice'

export const store = configureStore({
  reducer: {
    questions: questionsReducer,
    interviews: interviewsReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch