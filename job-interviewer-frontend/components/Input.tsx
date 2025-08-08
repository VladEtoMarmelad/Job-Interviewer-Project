import { Controller } from "react-hook-form"
import { TextInput } from "react-native"
import globalStyles from "@/styles/GlobalStyles"

interface Props {
  name: string
  placeholder: string
  control: any
  rules: any
  type?: "text" | "number" | "textarea"
}

export const Input: React.FC<Props> = ({name, placeholder, control, rules, type="text"}) => {
  return (
    <Controller
			name={name}
			control={control}
			rules={rules}
			render={({field: { onChange, onBlur, value }}) => (
				<TextInput
					placeholder={placeholder}
					onBlur={onBlur}
					onChangeText={onChange}
					value={value}
					style={[globalStyles.input, globalStyles.lightThemeInput]}
  				keyboardType={type==="number" ? "number-pad" : "default"}
					multiline={type==="textarea" ? true : false}
          numberOfLines={type==="textarea" ? 3 : 1}
				/>
			)}
    />
  )
}