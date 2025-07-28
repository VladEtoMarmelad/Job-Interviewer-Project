import { Text, View, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form"
import { Input }  from "@/components/Input";
import axios from "axios"
import globalStyles from "@/styles/GlobalStyles"

export default function Index() {

	interface FormData {
		interviewName: string
		requiredKnowledge: string

		questionsAmount: number
	}

	const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
		defaultValues: {
			interviewName: "",
			requiredKnowledge: "",

			questionsAmount: 30
		},
	})

	const addInterview = async (data: FormData): Promise<void> => {
		console.log(data)
		const res = await axios.post("http://localhost:3000/interview/add", data)
		console.log(res)
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
			name="interviewName"
			placeholder="Название должности..."
			control={control}
			rules={{required: true}}
		/>
      	{errors.interviewName && <Text>This is required.</Text>}

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
