import { View, TouchableOpacity, Text } from "react-native"
import { Input } from "./Input"
import { useAppSelector } from "@/store";
import { getThemeStyle } from "@/utils/getThemeStyle";
import { useForm } from "react-hook-form";
import { useRouter } from "expo-router";
import { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import globalStyles from "@/styles/GlobalStyles";
import settingsStyles from "@/styles/SettingsScreenStyles";
import axios from "axios";

export const InterviewAddByURL = () => {
	const [showInfo, setShowInfo] = useState<boolean>(false)
	const router = useRouter()
	const user = useAppSelector(state => state.sessions.user)
	const sessionStatus = useAppSelector(state => state.sessions.status)
	const colorScheme = useAppSelector(state => state.sessions.colorScheme)

	const themeTextStyle = getThemeStyle(colorScheme, globalStyles, "Text")
	const themeButtonStyle = getThemeStyle(colorScheme, globalStyles, "Button")
	const themeZoneStyle = getThemeStyle(colorScheme, settingsStyles, "Zone")

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
    <View style={{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
			<TouchableOpacity
				onPress={() => setShowInfo(!showInfo)}
				style={[globalStyles.button, themeButtonStyle, {position: 'absolute', top: 0, right: 0, marginRight: 15}]}
			><FontAwesome name="info-circle" size={18} color="white"/></TouchableOpacity>

			<Input 
				name="vacancyURL"
				placeholder="Ссылка на вакансию..."
				control={control}
				rules={{required: true}}
				type="number"
				styles={{width: '75%'}}
			/>
			<TouchableOpacity
				onPress={handleSubmit(addInterviewByURL)}
				style={[globalStyles.button, themeButtonStyle]}
			><Text style={{color: 'white'}}>Начать собеседование</Text></TouchableOpacity>

			{showInfo &&
				<View style={[settingsStyles.zone, themeZoneStyle, {position: 'absolute', bottom: '5%'}]}>
					<Text style={themeTextStyle}>
						P.S Добавления интервью с помощьюю ссылки на вакансию пока-что является эксперементальным и может не работь на некоторых URL
					</Text>
				</View>
			}
		</View>
  )
}