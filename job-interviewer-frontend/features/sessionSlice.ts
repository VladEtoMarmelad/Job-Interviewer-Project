import { createSlice, createAsyncThunk, isAnyOf, PayloadAction } from '@reduxjs/toolkit'
import { Platform } from 'react-native';
import { decodeJWT } from '@/utils/decodeJWT';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export interface SessionState {
  user: any;
  status: "authenticated"|"unauthenticated"|"loading"
}

const initialState: SessionState = {
  user: null,
  status: "loading"
}

interface ChangeStatePayload {
  fieldName: keyof SessionState; 
  fieldValue: any;
}

export const register = createAsyncThunk("auth/register", async (userData: any) => {
  try {
    const newUserToken = await axios.post(`http://${process.env.EXPO_PUBLIC_IP}:3000/auth/register`, userData, {withCredentials: true})
    if (Platform.OS !== "web") {
      await SecureStore.setItemAsync("jwt", newUserToken.data); //using secure storage insead of http only cookies if platform !== "web"
    }
    return newUserToken.data
  } catch (error) {
    console.error("Error occured while registering new user:", error)
  }
})

export const signIn = createAsyncThunk("auth/signIn", async (userData: any) => {
  const { name, password } = userData;
  const userToken = await axios.post(`http://${process.env.EXPO_PUBLIC_IP}:3000/auth/signin`, {username: name, password}, {withCredentials: true})
  if (Platform.OS !== "web") {
    await SecureStore.setItemAsync("jwt", userToken.data); //using secure storage insead of http only cookies if platform !== "web"
  }
  return userToken.data
})

export const signOut = createAsyncThunk("auth/signOut", async () => {
  if (Platform.OS === "web") {
    try {
      axios.delete(`http://${process.env.EXPO_PUBLIC_IP}:3000/auth/deleteJWTCookie`, {withCredentials: true})
    } catch (error) {
      console.error("JWT cookie is unavailable:", error);
    }
  } else {
    await SecureStore.deleteItemAsync("jwt");
  }
  return;
})

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    changeSessionState: (state, action: PayloadAction<ChangeStatePayload>) => {
      const { fieldName, fieldValue } = action.payload
      state[fieldName] = fieldValue
    }
  },
  extraReducers: (builder) => {
    builder

    .addCase(signOut.fulfilled, (state) => {
      state.user=null
      state.status="unauthenticated"
    })

    .addMatcher(isAnyOf(register.fulfilled, signIn.fulfilled), (state, action) => {
      state.user=decodeJWT(action.payload)
      state.status="authenticated"
    })
  }
})

export const { setUser, changeSessionState } = sessionSlice.actions
export default sessionSlice.reducer