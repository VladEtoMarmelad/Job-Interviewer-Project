import { Text, View, TouchableOpacity, Platform } from "react-native";
import { useForm } from "react-hook-form"
import { Input }  from "@/components/Input";
import { useRouter } from "expo-router";
import { InterviewAIModelPicker } from "@/components/InterviewAIModelPicker";
import { useAppSelector } from "@/store";
import { getThemeStyle } from "@/utils/getThemeStyle";
import axios from "axios"
import globalStyles from "@/styles/GlobalStyles";

export default function Index() {
	interface FormData {
		jobTitle: string
		requiredKnowledge: string
		aiModel: string,
		questionsAmount: number

		user?: number
	}
	
	const user = useAppSelector(state => state.sessions.user)
	const colorScheme = useAppSelector(state => state.sessions.colorScheme)
	const sessionStatus = useAppSelector(state => state.sessions.status)
	const router = useRouter()
	const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
		defaultValues: {
			jobTitle: "",
			requiredKnowledge: "",
			aiModel: "",
			questionsAmount: 30,
		},
	})

	const addInterview = async (data: FormData): Promise<void> => {
		if (sessionStatus==="authenticated") {
			data.user=user.sub
		}
		console.log(data)
		const res = await axios.post(`http://${process.env.EXPO_PUBLIC_IP}:3000/interview/add`, data)
		console.log(res)
		if (res.status===201) {
			router.replace({
				pathname: "/interview/[interviewId]",
				params: {interviewId: res.data.id}
			})
		}
	}

	const themeBackgroundStyle = getThemeStyle(colorScheme, globalStyles, "Background")
	const themeButtonStyle = getThemeStyle(colorScheme, globalStyles, "Button")

	return (
		<View style={[globalStyles.background, themeBackgroundStyle, {justifyContent: "center",alignItems: "center"}]}>

		<Input 
			name="jobTitle"
			placeholder="Название должности..."
			control={control}
			rules={{required: true}}
		/>
    {errors.jobTitle && <Text>This is required.</Text>}

		<Input 
			name="requiredKnowledge"
			placeholder="Требования вакансии..."
			control={control}
			rules={{required: true}}
			type="textarea"
		/>
		{errors.requiredKnowledge && <Text>This is required.</Text>}

		<Input 
			name="questionsAmount"
			placeholder="Количество вопросов..."
			control={control}
			rules={{required: true}}
			type="number"
		/>

		<InterviewAIModelPicker 
			control={control}
			styles={{width: Platform.OS === "web" ? '25%' : '75%'}}
		/>

		<TouchableOpacity
			onPress={handleSubmit(addInterview)}
			style={[globalStyles.button, themeButtonStyle]}
		><Text style={{color: 'white'}}>Начать собеседование</Text></TouchableOpacity>
		</View>
	);
}
