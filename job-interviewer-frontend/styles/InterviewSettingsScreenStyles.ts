import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  zone: {
    borderWidth: 1,
    borderRadius: 15,
    marginTop: 15,
    padding: 15,
    width: '75%',
    alignSelf: 'center'
  },
  
  dangerZone: {
    borderColor: 'red',
  },

  confirmZone: {
    zIndex: 100,
    padding: 25,
    width: '75%',
    position: 'absolute', 
    top: 0, 
    left: '12.5%', 
    right: 0,
    bottom: 0, 
    borderWidth: 2, 
    borderColor: 'black'
  },
  lightThemeConfirmZone: {
    backgroundColor: 'white'
  }
})

export default styles;