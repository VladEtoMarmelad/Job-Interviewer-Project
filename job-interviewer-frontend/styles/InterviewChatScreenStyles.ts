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

  },

  chatSection: {
    height: '100%', 
    flexDirection: 'column', 
    width: '85%', 
    padding: 5
  },
  chat: {
    width: '100%', 
    flexDirection: Platform.OS === "web" ? 'row': 'column',
    position: 'absolute', 
    top: '50%', 
    left: '50%', 
    transform: 'translate(-50%, -50%)', 
    zIndex: 5
  }
})

export default styles;