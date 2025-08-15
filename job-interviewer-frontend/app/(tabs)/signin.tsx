import { useForm } from "react-hook-form";
import { Input } from "@/components/Input";
import { View, Text, TouchableOpacity } from "react-native";
import globalStyles from "@/styles/GlobalStyles"
import { Link } from "expo-router";

interface FormData {
  name: string;
  password: string;
}

const SignInScreen = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: "",
      password: ""
    },
  })
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
        onPress={() => {}}
        style={[globalStyles.button, globalStyles.lightThemeButton]}
		  ><Text style={{color: 'white'}}>Войти в аккаунт</Text></TouchableOpacity>

      <Link href="/register">Нету аккаунта? Зарегестрируйтесь!</Link>
    </View>
  )
}

export default SignInScreen;