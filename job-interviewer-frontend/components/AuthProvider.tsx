import { createContext, useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { Platform } from 'react-native';
import { decodeJWT } from '@/utils/decodeJWT';
import { AppDispatch } from '@/store';
import { setUser } from '@/features/sessionSlice';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';


interface AuthContextInterface {
  user?: any;
  register?: (userData: any) => Promise<void>;
  signIn?: (username: string, password: string) => Promise<void>;
  signOut?: () => Promise<void>;
}

const AuthContext = createContext<AuthContextInterface>({});

const setItem = async (key: string, value: string): Promise<void> => {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

const getItem = async (key: string): Promise<string|null> => {
  if (Platform.OS === "web") {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error("Local storage is unavailable:", error);
      return null;
    }
  } else {
    return await SecureStore.getItemAsync(key);
  }
}

const deleteItem = async (key: string): Promise<void> => {
  if (Platform.OS === "web") {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Local storage is unavailable:", error);
    }
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

export const AuthProvider = ({children}: any) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const loadUser = async () => {
      const token: string|null = await getItem("userToken");
      if (token) {
        dispatch(setUser(decodeJWT(token)));
      }
    };
    loadUser();
  }, [])

  const register = async (userData: any): Promise<void> => {
    try {
      const newUserToken = await axios.post(`http://${process.env.EXPO_PUBLIC_IP}:3000/auth/register`, userData)
      console.log("newUserToken:", newUserToken)
      dispatch(setUser(decodeJWT(newUserToken.data)));
      await setItem("userToken", newUserToken.data);
    } catch (error) {
      console.error("Error occured while registering new user:", error)
    }
  }

  const signIn = async (username: string, password: string): Promise<void> => {
    const userToken = await axios.post(`http://${process.env.EXPO_PUBLIC_IP}:3000/auth/signin`, {username, password})
    dispatch(setUser(decodeJWT(userToken.data)));
    await setItem("userToken", userToken.data);
  }

  const signOut = async () => {
    dispatch(setUser(null));
    await deleteItem("userToken");
  };

  const value: any = { register, signIn, signOut }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};