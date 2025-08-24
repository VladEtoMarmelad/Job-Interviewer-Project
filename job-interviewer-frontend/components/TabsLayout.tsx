import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useAppSelector } from '@/store';
import { getThemeStyle } from '@/utils/getThemeStyle';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';
import globalStyles from '@/styles/GlobalStyles'

export const TabsLayout = () => {
  const sessionStatus = useAppSelector(state => state.sessions.status)
  const colorScheme = useAppSelector(state => state.sessions.colorScheme)

  const themeBackgroundStyle = getThemeStyle(colorScheme, globalStyles, "Background") 
  const tabBarIconColor = colorScheme === "light" ? 'black' : 'white'
  return (
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
  )
}