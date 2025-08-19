import { Controller } from "react-hook-form"
import { TextInput, Platform, Text } from "react-native"
import { Picker } from "@react-native-picker/picker"
import globalStyles from "@/styles/GlobalStyles"

export interface pickerItem {
	label: string;
	value: string;
}

interface Props {
  name: string
  placeholder: string
  control: any
  rules: any
  type?: "text" | "number" | "textarea" | "select"
	pickerItemsList?: pickerItem[]
	styles?: any
}

const textTypes = ["text", "number", "textarea"]

export const Input: React.FC<Props> = ({name, placeholder, control, rules, type="text", pickerItemsList, styles={}}) => {
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
						style={[globalStyles.input, globalStyles.lightThemeInput, styles]}
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
							Platform.OS === "web" && globalStyles.lightThemeInput,
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