import { useForm } from "react-hook-form";
import { Input } from "@/components/Input";
import { View, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { signIn, signOut } from "@/features/sessionSlice";
import globalStyles from "@/styles/GlobalStyles"

interface FormData {
  name: string;
  password: string;
}

const SignInScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: "",
      password: ""
    },
  })

  const signInHandler = (userData: FormData) => {
    try {
      dispatch(signIn(userData))
    } catch (error: any) {
      //setValidationErrors(catchValidationErrors(error))
    }    
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Input 
        name="name"
        placeholder="Имя пользователя..."
        control={control}
        rules={{required: true}}
      />
      {errors.name && <Text>This is required.</Text>}

      <Input 
        name="password"
        placeholder="Пароль..."
        control={control}
        rules={{required: true}}
      />
      {errors.password && <Text>This is required.</Text>}

      <TouchableOpacity
        onPress={handleSubmit(signInHandler)}
        style={[globalStyles.button, globalStyles.lightThemeButton]}
		  ><Text style={{color: 'white'}}>Войти в аккаунт</Text></TouchableOpacity>

      <TouchableOpacity
        onPress={() => dispatch(signOut())}
        style={[globalStyles.button, globalStyles.lightThemeButton]}
		  ><Text style={{color: 'white'}}>Выйти из аккаунта</Text></TouchableOpacity>

      <Link href="/register" style={{marginTop: 15}}>Нету аккаунта? Зарегестрируйтесь!</Link>
    </View>
  )
}

export default SignInScreen;