import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useAppDispatch, useAppSelector } from "@/store";
import { useState, useEffect } from "react";
import { InputAndLabel } from "@/components/InputAndLabel";
import { useForm } from "react-hook-form";
import { Redirect, useRouter } from "expo-router";
import { signOut, changeJWT, changeSessionState } from "@/features/sessionSlice";
import { BlurView } from "expo-blur";
import { getThemeStyle } from "@/utils/getThemeStyle";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import settingsStyles from "@/styles/SettingsScreenStyles";
import globalStyles from "@/styles/GlobalStyles";
import axios from "axios";

const ProfileScreen = () => {
  const [showDeleteScreen, setShowDeleteScreen] = useState(false);
  const [JWTColorScheme, setJWTColorScheme] = useState<"light"|"dark"|"system"|null>(null)
  const router = useRouter();

  const user = useAppSelector(state => state.sessions.user)
  const colorScheme = useAppSelector(state => state.sessions.colorScheme)
  const sessionStatus = useAppSelector(state => state.sessions.status)
  const dispatch = useAppDispatch();
  
  interface FormData {
		name: string;
	}

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: ""
    }
  })

  useEffect(() => {
    if (user) {
      reset({
        name: user.name
      })
    }
  }, [user])

  const patchUserHanlder = (userData: FormData): void => {
    axios.patch(`http://${process.env.EXPO_PUBLIC_IP}:3000/user/patch`, {
      id: user.sub,
      ...userData
    }, {withCredentials: true})
  }

  const deleteUserHandler = (): void => {
    dispatch(signOut())
    axios.delete(`http://${process.env.EXPO_PUBLIC_IP}:3000/user/delete`, {params: {id: user.sub}})
    router.replace("/")
  }

  const changeColorScheme = (colorScheme: "light"|"dark"|"system"): void => {
    dispatch(changeJWT({
      sub: user.sub,
      name: user.name,
      colorScheme: colorScheme
    }))
    dispatch(changeSessionState({fieldName: "colorScheme", fieldValue: colorScheme}))
    setJWTColorScheme(colorScheme)
  }

  const themeBackgroundStyle = getThemeStyle(colorScheme, globalStyles, "Background")
  const themeButtonStyle = getThemeStyle(colorScheme, globalStyles, "Button")
  const themeTextStyle = getThemeStyle(colorScheme, globalStyles, "Text")
  const themeZoneStyle = getThemeStyle(colorScheme, settingsStyles, "Zone")
  const themeConfirmZoneStyle = getThemeStyle(colorScheme, settingsStyles, "ConfirmZone")

  if (sessionStatus==="loading") return <Text>Загрузка...</Text>
  if (sessionStatus==="unauthenticated") return <Redirect href="/signin" />

  return (
    <View style={[globalStyles.background, themeBackgroundStyle]}>
      {showDeleteScreen &&
        <BlurView intensity={10} style={settingsStyles.blurContainer}>
          <View style={[settingsStyles.zone, settingsStyles.confirmZone, themeConfirmZoneStyle]}>
            <Text style={[themeTextStyle, {alignSelf: 'center'}]}>Вы уверены, что хотите удалить свой аккаунт?</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <TouchableOpacity 
                onPress={deleteUserHandler}
                style={[globalStyles.button, {backgroundColor: 'red'}]}
              >
                <Text style={{color: 'white'}}>Удалить</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => setShowDeleteScreen(false)}
                style={[globalStyles.button, themeButtonStyle]}
              >
                <Text style={{color: 'white'}}>Назад</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      }
      <ScrollView>
        <View style={[settingsStyles.zone, themeZoneStyle]}>
          <InputAndLabel 
            name="name"
            placeholder="Имя пользователя"
            control={control}
            rules={{required: true}}
            labelPostion="top"
            inputStyles={{width: '75%'}}
          />
          <TouchableOpacity 
            onPress={handleSubmit(patchUserHanlder)}
            style={[globalStyles.button, themeButtonStyle, {alignSelf: 'center'}]}
          >
            <Text style={{color: 'white'}}>Сохранить изменения</Text>
          </TouchableOpacity>
        </View>

        <View style={[settingsStyles.zone, themeZoneStyle, {flexDirection: 'row'}]}>
          <Text style={[themeTextStyle, {alignSelf: 'center', fontWeight: 'bold', fontSize: 18, marginRight: '2.5%'}]}>Выбрать цветовую тему:</Text>
          <TouchableOpacity 
            onPress={() => changeColorScheme("light")}
            style={{borderRadius: 10, padding: 5, backgroundColor: JWTColorScheme==="light" ? '#808588' : '#ffffff00'}}
          >
            <Ionicons name="sunny" size={24} color={colorScheme === "light" ? 'black' : 'white'} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => changeColorScheme("dark")}
            style={{borderRadius: 10, padding: 5, backgroundColor: JWTColorScheme==="dark" ? '#808588' : '#ffffff00'}}
          >
            <Ionicons name="moon" size={24} color={colorScheme === "light" ? 'black' : 'white'} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => changeColorScheme("system")}
            style={{borderRadius: 10, padding: 5, backgroundColor: JWTColorScheme==="system" ? '#808588' : '#ffffff00'}}
          >
            <FontAwesome6 name="computer" size={24} color={colorScheme === "light" ? 'black' : 'white'} />
          </TouchableOpacity>
        </View>

        <View style={[settingsStyles.zone, settingsStyles.dangerZone]}>
          <View style={settingsStyles.dangerZoneElement}>
            <Text style={themeTextStyle}>Выйти из аккаунта</Text>
            <TouchableOpacity 
              onPress={() => dispatch(signOut())}
              style={{borderWidth: 1, borderColor: 'black', borderRadius: 10, padding: 5, marginLeft: 'auto'}}
            >
              <Text style={themeTextStyle}>Выйти из аккаунта</Text>
            </TouchableOpacity>
          </View>

          <View style={{width: '100%', height: 1, marginHorizontal: 15, backgroundColor: colorScheme === "light" ? '#d8d8d8': 'gray', alignSelf: 'center'}}/> 

          <View style={settingsStyles.dangerZoneElement}>
            <Text style={themeTextStyle}>Удалить аккаунт</Text>
            <TouchableOpacity 
              onPress={() => setShowDeleteScreen(true)}
              style={{borderWidth: 1, borderColor: 'red', borderRadius: 10, padding: 5, marginLeft: 'auto'}}
            >
              <Text style={{color: 'red'}}>Удалить аккаунт</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default ProfileScreen;