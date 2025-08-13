import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
  input: {
    width: Platform.OS === "web" ? '25%' : '75%',
    padding: 15,
    borderRadius: 10,
    marginTop: 10
  },
  lightThemeInput: {
    backgroundColor: '#fef9f3'
  },

  button: {
    padding: 15,
    borderRadius: 15,
    marginTop: 15
  },
  lightThemeButton: {
    backgroundColor: 'black',
  },
  darkThemeButton: {

  },

  validationErrorsSection: {
    marginTop: 15,
    padding: 25,
    backgroundColor: '#ffcccb',
    borderColor: 'darkred',
    borderWidth: 1,
    borderRadius: 15,
  }
})

export default styles;