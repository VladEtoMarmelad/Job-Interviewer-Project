import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Provider } from 'react-redux'
import { store } from '@/store';
import { AuthProvider } from '@/components/AuthProvider';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function TabLayout() {
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
            name="register"
            options={{
              title: "Register",
              tabBarIcon: () => <AntDesign name="adduser" size={24} color="black" />
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
