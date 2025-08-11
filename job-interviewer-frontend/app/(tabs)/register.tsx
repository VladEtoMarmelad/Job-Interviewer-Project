import { TouchableOpacity, View, Text } from "react-native"
import { useAuth } from "@/components/AuthProvider"
import { useForm } from "react-hook-form";
import { Input } from "@/components/Input";
import globalStyles from "@/styles/GlobalStyles"

interface FormData {
  name: string;
  password: string;
  repetPassword: string;
}

const RegisterScreen: React.FC = () => {
  const { register } = useAuth();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: "",
      password: "",
      repetPassword: ""
    },
  })

  const registerHandler = (userData: FormData) => {
    register && register(userData)
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
      
      <Input 
        name="repetPassword"
        placeholder="Повторите пароль..."
        control={control}
        rules={{required: true}}
      />
      {errors.repetPassword && <Text>This is required.</Text>}

      <TouchableOpacity
        onPress={handleSubmit(registerHandler)}
        style={[globalStyles.button, globalStyles.lightThemeButton]}
		  ><Text style={{color: 'white'}}>Зарегестрироваться</Text></TouchableOpacity>
    </View>
  )
}

export default RegisterScreen;