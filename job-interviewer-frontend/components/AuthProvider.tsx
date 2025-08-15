import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Platform } from 'react-native';
import { decodeJWT } from '@/utils/decodeJWT';
import { AppDispatch } from '@/store';
import { setUser } from '@/features/sessionSlice';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const getItem = async (key: string): Promise<string|null> => {
  if (Platform.OS === "web") {
    try {
      const token = await axios.get(`http://${process.env.EXPO_PUBLIC_IP}:3000/auth/findJWTCookie`, {withCredentials: true})
      return token.data
    } catch (error) {
      console.error("JWT cookie is unavailable:", error);
      return null;
    }
  } else {
    return await SecureStore.getItemAsync(key);
  }
}

export const AuthProvider = ({children}: any) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const loadUser = async () => {
      const token: string|null = await getItem("jwt");
      console.log(token)
      if (token) {
        dispatch(setUser(decodeJWT(token)));
      }
    };
    loadUser();
  }, [])

  return (
    {children}
  );
}
