import { View, TouchableOpacity } from "react-native";
import { useAppSelector } from "@/store";
import { useState } from "react";
import { getThemeStyle } from "@/utils/getThemeStyle";
import { InterviewAddByForm } from "@/components/InterviewAddByForm";
import { InterviewAddByURL } from "@/components/InterviewAddByURL";
import { InterviewAddByImage } from "@/components/InterviewAddByImage";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import globalStyles from "@/styles/GlobalStyles";

export default function Index() {
	const [addMethod, setAddMethod] = useState<"form"|"url"|"image">("form")
	const colorScheme = useAppSelector(state => state.sessions.colorScheme)

	const themeBackgroundStyle = getThemeStyle(colorScheme, globalStyles, "Background")
	const themeButtonStyle = getThemeStyle(colorScheme, globalStyles, "Button")
	const themeBorderColor = colorScheme === "light" ? 'black' : 'white'

	return (
		<View style={[globalStyles.background, themeBackgroundStyle, {justifyContent: "center",alignItems: "center"}]}>

		<View style={{position: 'absolute', top: 0, flexDirection: 'row', marginTop: 25, zIndex: 1}}>
			<TouchableOpacity
				onPress={() => setAddMethod("form")}
				style={[globalStyles.button, themeButtonStyle, {marginHorizontal: 5, borderWidth: addMethod === "form" ? 3 : 0.25, borderColor: themeBorderColor}]}
			><AntDesign name="form" size={24} color="white"/></TouchableOpacity>
			<TouchableOpacity
				onPress={() => setAddMethod("url")}
				style={[globalStyles.button, themeButtonStyle, {marginHorizontal: 5, borderWidth: addMethod === "url" ? 3 : 1, borderColor: themeBorderColor}]}
			><AntDesign name="link" size={24} color="white"/></TouchableOpacity>
			<TouchableOpacity
				onPress={() => setAddMethod("image")}
				style={[globalStyles.button, themeButtonStyle, {marginHorizontal: 5, borderWidth: addMethod === "image" ? 3 : 1, borderColor: themeBorderColor}]}
			><Entypo name="images" size={24} color="white"/></TouchableOpacity>
		</View>

		{addMethod === "form" && <InterviewAddByForm />}

		{addMethod === "url" && <InterviewAddByURL />}

		{addMethod === "image" && <InterviewAddByImage />}

		</View>
	);
}
