import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
  interviewElement: {
    width: '80%', 
    minHeight: 75, 
    flexDirection: 'row', 
    backgroundColor: 'lightgray', 
    alignSelf: 'center', 
    borderRadius: 10, 
    marginTop: 5,

    borderWidth: 1,
    borderColor: 'black'
  },
  interviewElementLink: {
    width: Platform.OS === "web" ? '100%' : '87%', 
    backgroundColor: 'lightgray', 
    alignSelf: 'center', 
    borderRadius: 10, 
    marginTop: 5
  },
  interviewElementLinkSettings: {
    height: '100%',
    borderLeftColor: 'black', 
    borderLeftWidth: 1, 
    justifyContent: 'center', 
    padding: 10
  }
})

export default styles;