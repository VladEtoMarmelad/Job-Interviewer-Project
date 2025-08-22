import { View, Text } from "react-native"
import { Input } from "./Input"
import { pickerItem } from "./Input";
import { useAppSelector } from "@/store";

interface Props {
  name: string;
  placeholder: string;
  control: any;
  rules: any;
  inputType?: "text" | "number" | "textarea" | "select";
  labelPostion?: "left"|"top";
  inputStyles?: any;

  pickerItemsList?: pickerItem[]; //only for "select" type
}

export const InputAndLabel: React.FC<Props> = ({name, placeholder, control, rules, inputType="text", labelPostion="left", inputStyles={}, pickerItemsList}) => {
  const colorScheme = useAppSelector(state => state.sessions.colorScheme)
	const placeholderTextColor = colorScheme === "light" ? 'black' : 'white'
  return (
    <View style={{flexDirection: labelPostion==="left" ? 'row' : 'column'}}>
      <Text style={{fontWeight: 'bold', fontSize: 18, color: placeholderTextColor}}>{placeholder}</Text>
      <Input 
        name={name}
        placeholder={`${placeholder}...`}
        control={control}
        rules={rules}
        type={inputType}
        styles={inputStyles}

        pickerItemsList={pickerItemsList}
      />
    </View>
  )
}