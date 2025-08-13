import { Text, View, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form"
import { Input }  from "@/components/Input";
import { useRouter } from "expo-router";
import axios from "axios"
import globalStyles from "@/styles/GlobalStyles"

export default function Index() {
	interface FormData {
		jobTitle: string
		requiredKnowledge: string

		questionsAmount: number
	}

	const router = useRouter()
	const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
		defaultValues: {
			jobTitle: "",
			requiredKnowledge: "",

			questionsAmount: 30
		},
	})

	const addInterview = async (data: FormData): Promise<void> => {
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

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: '#f2f2f2'
			}}
		>

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

		<TouchableOpacity
			onPress={handleSubmit(addInterview)}
			style={[globalStyles.button, globalStyles.lightThemeButton]}
		><Text style={{color: 'white'}}>Начать собеседование</Text></TouchableOpacity>
		</View>
	);
}
