import { TouchableOpacity, View, Text, FlatList } from "react-native"
import { useForm } from "react-hook-form";
import { useState } from "react"
import { Input } from "@/components/Input";
import { User } from "@/schemas/user";
import { catchValidationErrors } from "@/utils/catchValidationErrors";
import { Link } from "expo-router";
import { register } from "@/features/sessionSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import globalStyles from "@/styles/GlobalStyles"

interface FormData {
  name: string;
  password: string;
  repeatPassword: string;
}

const RegisterScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [validationErrors, setValidationErrors] = useState<any>([]);
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: "",
      password: "",
      repeatPassword: ""
    },
  })

  const registerHandler = async (userData: FormData) => {
    try {
      await User.parseAsync(userData)
      dispatch(register(userData))
    } catch (error: any) {
      setValidationErrors(catchValidationErrors(error))
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
      
      <Input 
        name="repeatPassword"
        placeholder="Повторите пароль..."
        control={control}
        rules={{required: true}}
      />
      {errors.repeatPassword && <Text>This is required.</Text>}

      <TouchableOpacity
        onPress={handleSubmit(registerHandler)}
        style={[globalStyles.button, globalStyles.lightThemeButton]}
		  ><Text style={{color: 'white'}}>Зарегестрироваться</Text></TouchableOpacity>

      {validationErrors.length > 0 &&
        <View style={globalStyles.validationErrorsSection}>
          <FlatList
            data={validationErrors}
            renderItem={({item: error, index}) => 
              <Text key={index}>{error}</Text>
            }
          />
        </View>
      }

      <Link href="/signin" style={{marginTop: 15}}>Уже есть аккаунт? Войти...</Link>
    </View>
  )
}

export default RegisterScreen;