import '@/utils/polyfills'
import { Tabs } from 'expo-router';
import { Platform, useColorScheme } from 'react-native';
import { Provider } from 'react-redux'
import { store } from '@/store';
import { AuthProvider, getItem } from '@/components/AuthProvider';
import { useState, useEffect } from 'react';
import { getColorScheme } from '@/utils/getColorScheme';
import { getThemeStyle } from '@/utils/getThemeStyle';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import globalStyles from '@/styles/GlobalStyles'

export default function TabLayout() {
  const [sessionStatus, setSessionStatus] = useState<"unauthenticated"|"authenticated">("unauthenticated")
  const [colorScheme, setColorScheme] = useState<"light"|"dark">("dark")
  const systemColorScheme = useColorScheme()
  useEffect(() => {
    const getSessionStatus = async (): Promise<void> => {
      const jwt = await getItem("jwt");
      const calculatedSessionStatus = (jwt === "" || jwt === null) ? "unauthenticated" : "authenticated";
      setSessionStatus(calculatedSessionStatus)
      setColorScheme(getColorScheme(jwt, systemColorScheme))
    } 
    getSessionStatus();
  }, [])

  const themeBackgroundStyle = getThemeStyle(colorScheme, globalStyles, "Background") 
  const tabBarIconColor = colorScheme === "light" ? 'black' : 'white'

  return (
    <Provider store={store}>
      <AuthProvider>
        <Tabs screenOptions={{
          tabBarPosition: Platform.OS === "web" ? "left" : "bottom",
          tabBarActiveTintColor: 'blue', 
          headerShown: false,
          tabBarStyle: [themeBackgroundStyle],
          tabBarInactiveTintColor: colorScheme === "light" ? 'black' : 'white',
          tabBarActiveBackgroundColor: colorScheme === "light" ? '#007aff' : 'goldenrod'
        }}>
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              tabBarIcon: () => <FontAwesome name="home" size={24} color={tabBarIconColor} />
            }}
          />
          <Tabs.Screen
            name="interviews"
            options={{
              title: "Interviews",
              tabBarIcon: () => <FontAwesome5 name="clipboard-list" size={24} color={tabBarIconColor} />
            }}
          />

          <Tabs.Screen
            name="signin"
            options={{
              href: sessionStatus==="authenticated" ? null : "/signin",
              title: "Sign In",
              tabBarIcon: () => <AntDesign name="user" size={24} color={tabBarIconColor} />,
              tabBarItemStyle: {marginTop: 'auto'}
            }}
          />

          <Tabs.Screen
            name="profile"
            options={{
              href: sessionStatus==="unauthenticated" ? null : "/profile",
              title: "Profile",
              tabBarIcon: () => <AntDesign name="user" size={24} color={tabBarIconColor} />,
              tabBarItemStyle: {marginTop: 'auto'}
            }}
          />
          
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
