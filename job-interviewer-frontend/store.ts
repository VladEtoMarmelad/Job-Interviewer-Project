import { configureStore } from '@reduxjs/toolkit'
import { useSelector, useDispatch } from 'react-redux'
import questionsReducer from '@/features/questionSlice'
import interviewsReducer from '@/features/interviewSlice'
import sessionsReducer from '@/features/sessionSlice'

export const store = configureStore({
  reducer: {
    questions: questionsReducer,
    interviews: interviewsReducer,
    sessions: sessionsReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export const useAppSelector = useSelector.withTypes<RootState>()

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()