import { createContext, useState, useEffect, useContext } from 'react';
import { Platform } from 'react-native';
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
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const loadUser = async () => {
      const token: string|null = await getItem("userToken");
      if (token) {
        setUser(token);
      }
    };
    loadUser();
  }, [])

  const register = async (userData: any): Promise<any> => {
    try {
      const newUserToken = await axios.post(`http://${process.env.EXPO_PUBLIC_IP}:3000/auth/register`, userData) //user object instead of token right now
      console.log("newUserToken:", newUserToken)
      setUser(newUserToken.data);
      //await setItem("userToken", newUserToken.data);
    } catch (error) {
      console.error("Error occured while registering new user:", error)
    }
  }

  const signIn = async (username: string, password: string) => {
    const userToken = await axios.post(`http://${process.env.EXPO_PUBLIC_IP}:3000/auth/signin`, {username, password})
    setUser(userToken.data);
    await setItem("userToken", userToken.data);
  }

  const signOut = async () => {
    setUser(null);
    await deleteItem("userToken");
  };

  const value: any = { user, register, signIn, signOut }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};