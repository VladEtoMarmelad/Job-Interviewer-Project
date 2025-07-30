import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarPosition: Platform.OS === "web" ? "left" : "bottom",
      tabBarActiveTintColor: 'blue', 
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: () => <FontAwesome name="home" size={24} color="black" />
        }}
      />
      <Tabs.Screen
        name="interview/[interviewId]"
        options={{
          href: null, 
          headerShown: false
        }}
      />
    </Tabs>
  );
}