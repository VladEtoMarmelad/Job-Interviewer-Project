import { View, TouchableOpacity, Text } from "react-native"
import { Input } from "./Input";
import { useState } from "react";
import { useAppSelector } from "@/store";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { getThemeStyle } from "@/utils/getThemeStyle";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import globalStyles from "@/styles/GlobalStyles";
import settingsStyles from "@/styles/SettingsScreenStyles";
import axios from "axios";
import * as DocumentPicker from "expo-document-picker";

interface FormData {scanItem: null|"vacancy"|"CV"}

export const InterviewAddByImage = () => {
	const router = useRouter()
  const [showInfo, setShowInfo] = useState<boolean>(false)
	const [selectedImage, setSelectedImage] = useState<any>(null)

  const user = useAppSelector(state => state.sessions.user)
	const colorScheme = useAppSelector(state => state.sessions.colorScheme)

	const { control, handleSubmit, formState: { errors } } = useForm<FormData>({defaultValues: {scanItem: null}})

	const pickDocument = async (): Promise<void> => {
    const result: DocumentPicker.DocumentPickerResult = await DocumentPicker.getDocumentAsync({
      type: "image/*"
    });

    if (!result.canceled && result.output) {
			setSelectedImage(result.output[0])
    } else {
      console.log("Document picking cancelled or failed.");
    }
  };

	const addInterviewByImage = async (interviewData: any) => {
		const formData = new FormData();
		formData.append("user", user.sub); 
		formData.append("scanItem", interviewData.scanItem)
		formData.append("image", selectedImage);

		const res = await axios.post(`http://${process.env.EXPO_PUBLIC_IP}:3000/interview/addByImage`, formData, {headers: {"Accept": "application/json"}})
		console.log("res:", res)
		if (res.status===201) {
			router.replace("/interviews")
		}
	}

  const themeTextStyle = getThemeStyle(colorScheme, globalStyles, "Text")
	const themeButtonStyle = getThemeStyle(colorScheme, globalStyles, "Button")
	const themeZoneStyle = getThemeStyle(colorScheme, settingsStyles, "Zone")
  
  return (
    <View style={{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
			<TouchableOpacity
				onPress={() => setShowInfo(!showInfo)}
				style={[globalStyles.button, themeButtonStyle, {position: 'absolute', top: 0, right: 0, marginRight: 15}]}
			><FontAwesome name="info-circle" size={18} color="white"/></TouchableOpacity>

			<Input 
				name="aiModel"
				type="select"
				placeholder="Название модели"
				control={control}
				rules={{required: true}}
				pickerItemsList={[
					{label: "Выберите предмет анализа", value: null},
					{label: "Вакансия", value: "vacancy"},
					{label: "Резюме", value: "CV"},
				]}
				styles={{width: '75%'}}
			/>

			<View style={[settingsStyles.zone, themeZoneStyle, {flexDirection: 'row', alignItems: 'center'}]}>
				<TouchableOpacity
					onPress={pickDocument}
					style={[globalStyles.button, themeButtonStyle, {marginTop: 0}]}
				><Text style={{color: 'white'}}>Выбрать файл</Text></TouchableOpacity>
				{selectedImage &&
					<Text style={[themeTextStyle, {marginLeft: 15}]}>
						"{selectedImage.name}" {selectedImage.size} байтов
					</Text>
				}
			</View>

			<TouchableOpacity
				onPress={handleSubmit(addInterviewByImage)}
				style={[globalStyles.button, themeButtonStyle]}
			><Text style={{color: 'white'}}>Начать собеседование</Text></TouchableOpacity>

			{showInfo &&
				<View style={[settingsStyles.zone, themeZoneStyle, {position: 'absolute', bottom: '5%'}]}>
					<Text style={themeTextStyle}>
						P.S Добавления интервью с помощьюю картинки пока-что является эксперементальным и может не работь на некоторых картинках
					</Text>
				</View>
			}
		</View>
  )
}