import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Provider } from 'react-redux'
import { store } from '@/store';
import { AuthProvider, getItem } from '@/components/AuthProvider';
import { useState, useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function TabLayout() {
  const [sessionStatus, setSessionStatus] = useState<"unauthenticated"|"authenticated">("unauthenticated")
  useEffect(() => {
    const getSessionStatus = async (): Promise<void> => {
      const calculatedSessionStatus = await getItem("jwt") === "" ? "unauthenticated" : "authenticated"
      setSessionStatus(calculatedSessionStatus)
    } 
    getSessionStatus();
  }, [])

  return (
    <Provider store={store}>
      <AuthProvider>
        <Tabs screenOptions={{
          tabBarPosition: Platform.OS === "web" ? "left" : "bottom",
          tabBarActiveTintColor: 'blue', 
          headerShown: false
        }}>
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              tabBarIcon: () => <FontAwesome name="home" size={24} color="black" />
            }}
          />
          <Tabs.Screen
            name="interviews"
            options={{
              title: "Interviews",
              tabBarIcon: () => <FontAwesome5 name="clipboard-list" size={24} color="black" />
            }}
          />

          <Tabs.Screen
            name="signin"
            options={{
              href: sessionStatus==="authenticated" ? null : "/signin",
              title: "Sign In",
              tabBarIcon: () => <AntDesign name="user" size={24} color="black" />,
              tabBarItemStyle: {marginTop: 'auto'}
            }}
          />

          <Tabs.Protected guard={sessionStatus==="authenticated" ? true : false}>
            <Tabs.Screen
              name="profile"
              options={{
                href: sessionStatus==="unauthenticated" ? null : "/profile",
                title: "Profile",
                tabBarIcon: () => <AntDesign name="user" size={24} color="black" />,
                tabBarItemStyle: {marginTop: 'auto'}
              }}
            />
          </Tabs.Protected>
          
          <Tabs.Screen
            name="register"
            options={{
              href: null
            }}
          />
          <Tabs.Screen
            name="interview/[interviewId]"
            options={{
              href: null
            }}
          />
          <Tabs.Screen
            name="interview/settings/[interviewId]"
            options={{
              href: null
            }}
          />
        </Tabs>
      </AuthProvider>
    </Provider>
  );
}
