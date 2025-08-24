import { View, TouchableOpacity, Text } from "react-native"
import { Input } from "./Input"
import { useAppSelector } from "@/store";
import { getThemeStyle } from "@/utils/getThemeStyle";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import globalStyles from "@/styles/GlobalStyles";
import axios from "axios";

export const InterviewAddByURL = () => {
	const router = useRouter()
	const user = useAppSelector(state => state.sessions.user)
	const sessionStatus = useAppSelector(state => state.sessions.status)
	const colorScheme = useAppSelector(state => state.sessions.colorScheme)

	const themeTextStyle = getThemeStyle(colorScheme, globalStyles, "Text")
	const themeButtonStyle = getThemeStyle(colorScheme, globalStyles, "Button")

  interface FormData {
    vacancyURL: string;

		user?: number;
	}

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      vacancyURL: ""
    }
  })

	const addInterviewByURL = async (data: FormData): Promise<void> => {
		if (sessionStatus==="authenticated") {data.user=user.sub}
		const res = await axios.post(`http://${process.env.EXPO_PUBLIC_IP}:3000/interview/addByURL`, data)
		console.log("interview data from URL:", res.data)
		if (res.status===201) {
			router.replace({
				pathname: "/interview/[interviewId]",
				params: {interviewId: res.data.id}
			})
		}
	}

  return (
    <View style={{alignItems: 'center'}}>
			<Text style={[themeTextStyle, {fontWeight: 'bold', fontSize: 18}]}>
				Начать интервью используя URL вакансии 
				<FontAwesome6 name="flask" size={18} style={{marginLeft: 10}}/>
			</Text>
			<Input 
				name="vacancyURL"
				placeholder="Ссылка на вакансию..."
				control={control}
				rules={{required: true}}
				type="number"
				styles={{width: '100%'}}
			/>
			<TouchableOpacity
				onPress={handleSubmit(addInterviewByURL)}
				style={[globalStyles.button, themeButtonStyle]}
			><Text style={{color: 'white'}}>Начать собеседование используя URL</Text></TouchableOpacity>

			<Text style={[themeTextStyle, {marginTop: 100}]}>(P.S Этот способ добавления интервью пока-что является эксперементальным и может не работь на некоторых URL)</Text>
		</View>
  )
}