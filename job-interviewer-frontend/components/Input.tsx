import { Controller } from "react-hook-form"
import { TextInput, Platform, Text } from "react-native"
import { Picker } from "@react-native-picker/picker"
import { useAppSelector } from "@/store";
import { getThemeStyle } from "@/utils/getThemeStyle";
import globalStyles from "@/styles/GlobalStyles"


export interface pickerItem {
	label: string;
	value: string|null;
}

interface Props {
  name: string
  placeholder: string
  control: any
  rules: any
  type?: "text" | "number" | "textarea" | "select"
	styles?: any

	pickerItemsList?: pickerItem[]; //only for "select" type
}

const textTypes = ["text", "number", "textarea"]

export const Input: React.FC<Props> = ({name, placeholder, control, rules, type="text", styles={}, pickerItemsList}) => {
	const colorScheme = useAppSelector(state => state.sessions.colorScheme)
	const themeInputStyle = getThemeStyle(colorScheme, globalStyles, "Input")
	const placeholderTextColor = colorScheme === "light" ? 'black' : 'white'
  return (
    <Controller
			name={name}
			control={control}
			rules={rules}
			render={({field: { onChange, onBlur, value }}) => {
				if (textTypes.includes(type)) return (
					<TextInput
						placeholder={placeholder}
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
						style={[globalStyles.input, themeInputStyle, styles]}
						placeholderTextColor={placeholderTextColor}
						keyboardType={type==="number" ? "number-pad" : "default"}
						multiline={type==="textarea" ? true : false}
						numberOfLines={type==="textarea" ? 3 : 1}
					/>
				)
				if (type==="select") return (
					<Picker 
        		mode="dropdown"
        		style={[
							globalStyles.input, 
							Platform.OS === "web" && themeInputStyle,
							{width: '100%', borderWidth: 0},
							styles
        		]}
						onBlur={onBlur}
						onValueChange={onChange}
        	>
						{pickerItemsList?.map((pickerItem, index) => 
							<Picker.Item 
								key={index}
								label={pickerItem.label} 
								value={pickerItem.value}
							/>
						)}
      		</Picker>
				)
				return <Text>Type was not provided</Text>;
			}}
    />
  )
}