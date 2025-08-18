import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useAppDispatch, useAppSelector } from "@/store";
import { useState, useEffect } from "react";
import { InputAndLabel } from "@/components/InputAndLabel";
import { useForm } from "react-hook-form";
import { Redirect, useRouter } from "expo-router";
import { signOut } from "@/features/sessionSlice";
import { BlurView } from "expo-blur";
import settingsStyles from "@/styles/SettingsScreenStyles";
import globalStyles from "@/styles/GlobalStyles";
import axios from "axios";


const ProfileScreen = () => {
  const [showDeleteScreen, setShowDeleteScreen] = useState(false);
  const router = useRouter();

  const user = useAppSelector(state => state.sessions.user)
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

  if (sessionStatus==="loading") return <Text>Загрузка...</Text>
  if (sessionStatus==="unauthenticated") return <Redirect href="/signin" />

  return (
    <View>
      {showDeleteScreen &&
        <BlurView intensity={10} style={settingsStyles.blurContainer}>
          <View style={[settingsStyles.zone, settingsStyles.confirmZone, settingsStyles.lightThemeConfirmZone]}>
            <Text style={{alignSelf: 'center'}}>Вы уверены, что хотите удалить свой аккаунт?</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <TouchableOpacity 
                onPress={deleteUserHandler}
                style={[globalStyles.button, {backgroundColor: 'red'}]}
              >
                <Text style={{color: 'white'}}>Удалить</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => setShowDeleteScreen(false)}
                style={[globalStyles.button, globalStyles.lightThemeButton]}
              >
                <Text style={{color: 'white'}}>Назад</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      }
      <ScrollView>
        <View style={settingsStyles.zone}>
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
            style={[globalStyles.button, globalStyles.lightThemeButton, {alignSelf: 'center'}]}
          >
            <Text style={{color: 'white'}}>Сохранить изменения</Text>
          </TouchableOpacity>
        </View>

        <View style={settingsStyles.zone}></View>

        <View style={[settingsStyles.zone, settingsStyles.dangerZone]}>
          <View style={settingsStyles.dangerZoneElement}>
            <Text>Выйти из аккаунта</Text>
            <TouchableOpacity 
              onPress={() => dispatch(signOut())}
              style={{borderWidth: 1, borderColor: 'black', borderRadius: 10, padding: 5, marginLeft: 'auto'}}
            >
              <Text style={{color: 'black'}}>Выйти из аккаунта</Text>
            </TouchableOpacity>
          </View>

          <View style={{width: '100%', height: 1, marginHorizontal: 15, backgroundColor: '#d8d8d8', alignSelf: 'center'}}/> 

          <View style={settingsStyles.dangerZoneElement}>
            <Text>Удалить аккаунт</Text>
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