import { configureStore } from '@reduxjs/toolkit'
import questionsReducer from '@/features/questionSlice'
import interviewsReducer from '@/features/interviewSlice'
import sessionsReducer from '@/features/sessionSlice'

export const store = configureStore({
  reducer: {
    questions: questionsReducer,
    interviews: interviewsReducer,
    session: sessionsReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch