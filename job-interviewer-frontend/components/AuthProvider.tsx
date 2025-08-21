import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Platform, useColorScheme } from 'react-native';
import { decodeJWT } from '@/utils/decodeJWT';
import { AppDispatch } from '@/store';
import { changeSessionState } from '@/features/sessionSlice';
import { View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export const getItem = async (key: string): Promise<string|null> => {
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
  const systemColorScheme = useColorScheme();

  const getColorScheme = (token: string) => {
    const JWTColorTheme = decodeJWT(token).colorTheme
    if (JWTColorTheme === "system") {
      return systemColorScheme
    } else {
      return JWTColorTheme
    }
  }

  useEffect(() => {
    const loadUser = async () => {
      const token: string|null = await getItem("jwt");
      console.log(token === null)
      if (token && token!==null) {
        dispatch(changeSessionState({fieldName: "user", fieldValue: decodeJWT(token)}))
        dispatch(changeSessionState({fieldName: "colorScheme", fieldValue: getColorScheme(token)}))
        dispatch(changeSessionState({fieldName: "status", fieldValue: "authenticated"}))
      }
    };
    loadUser();
  }, [])

  return (
    <View style={{flex: 1}}>{children}</View>
  );
}
