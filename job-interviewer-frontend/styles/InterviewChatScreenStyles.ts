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
    backgroundColor: '#151922'
  },

  assistantMessage: {
    marginRight: Platform.OS === "web" ? 100 : 50,
    marginLeft: 15,
  },
  lightThemeAssistantMessage: {
    backgroundColor: '#faf5ef'
  },
  darkThemeAssistantMessage: {
    backgroundColor: '#27292b'
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
  },

  chatSettingSection: {
    height: '100%', 
    width: '15%', 
    borderLeftWidth: 1
  },
  lightThemeChatSettingSection: {
    backgroundColor: 'white', 
    borderColor: '#d8d8d8'
  },
  darkThemeChatSettingSection: {
    backgroundColor: 'black',
    borderColor: 'gray'
  }
})

export default styles;