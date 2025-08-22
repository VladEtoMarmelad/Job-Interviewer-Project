import { StyleSheet, Platform } from "react-native";

const styles = StyleSheet.create({
  zone: {
    borderWidth: 1,
    borderRadius: 15,
    marginTop: 15,
    padding: 15,
    width: Platform.OS === "web" ? '75%' : '90%', 
    alignSelf: 'center'
  },
  lightThemeZone: {
    borderColor: 'black',
  },
  darkThemeZone: {
    borderColor: 'gray',
  },
  
  dangerZone: {
    borderColor: 'red',
    padding: 0
  },

  dangerZoneElement: {
    padding: 15,
    flexDirection: 'row', 
    alignItems: 'center'
  },

  blurContainer: {
    zIndex: 150,
    position: 'absolute',
    width: '100%',
    height: '100%'
  },

  confirmZone: {
    zIndex: 100,
    padding: 25,
    width: Platform.OS === "web" ? '50%' : '75%',
    position: 'absolute', 
    top: 0, 
    left: Platform.OS === "web" ? '25%' : '12.5%', 
    right: 0,
    bottom: 0, 
    borderWidth: 2, 
    borderColor: 'black'
  },
  lightThemeConfirmZone: {
    backgroundColor: 'white'
  },
  darkThemeConfirmZone: {
    backgroundColor: 'black'
  }
})

export default styles;