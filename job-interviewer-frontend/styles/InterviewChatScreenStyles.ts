import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
  message: {
    padding: 15,
    marginTop: 10,
    borderRadius: 15
  },

  userMessage: {
    marginLeft: Platform.OS === "web" ? 100 : 50,
    marginRight: 15
  },
  lightThemeUserMessage: {
    backgroundColor: '#e7decc'
  },
  darkThemeUserMessage: {

  },

  assistantMessage: {
    marginRight: Platform.OS === "web" ? 100 : 50,
    marginLeft: 15,
  },
  lightThemeAssistantMessage: {
    backgroundColor: '#faf5ef'
  },
  darkThemeAssistantMessage: {

  }
})

export default styles;