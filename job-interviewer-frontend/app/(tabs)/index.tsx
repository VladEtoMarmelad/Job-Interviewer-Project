import { View, TouchableOpacity } from "react-native";
import { useAppSelector } from "@/store";
import { useState } from "react";
import { getThemeStyle } from "@/utils/getThemeStyle";
import { InterviewAddByForm } from "@/components/InterviewAddByForm";
import { InterviewAddByURL } from "@/components/InterviewAddByURL";
import AntDesign from '@expo/vector-icons/AntDesign';
import globalStyles from "@/styles/GlobalStyles";

export default function Index() {
	const [addMethod, setAddMethod] = useState<"form"|"url">("form")
	const colorScheme = useAppSelector(state => state.sessions.colorScheme)

	const themeBackgroundStyle = getThemeStyle(colorScheme, globalStyles, "Background")
	const themeButtonStyle = getThemeStyle(colorScheme, globalStyles, "Button")

	return (
		<View style={[globalStyles.background, themeBackgroundStyle, {justifyContent: "center",alignItems: "center"}]}>

		<View style={{flexDirection: 'row'}}>
			<TouchableOpacity
				onPress={() => setAddMethod("form")}
				style={[globalStyles.button, themeButtonStyle, {margin: 5}]}
			><AntDesign name="form" size={24} color="white"/></TouchableOpacity>
			<TouchableOpacity
				onPress={() => setAddMethod("url")}
				style={[globalStyles.button, themeButtonStyle, {margin: 5}]}
			><AntDesign name="link" size={24} color="white"/></TouchableOpacity>
		</View>

		{addMethod === "form" && <InterviewAddByForm />}

		{addMethod === "url" && <InterviewAddByURL />}

		</View>
	);
}
