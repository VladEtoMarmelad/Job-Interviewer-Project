import { View, Text } from "react-native"
import { Input } from "./Input"

interface Props {
  name: string;
  placeholder: string;
  control: any;
  rules: any;
  inputType?: "text" | "number" | "textarea";
  labelPostion?: "left"|"top";

  inputStyles?: any;
}

export const InputAndLabel: React.FC<Props> = ({name, placeholder, control, rules, inputType="text", labelPostion="left", inputStyles={}}) => {
  return (
    <View style={{flexDirection: labelPostion==="left" ? 'row' : 'column'}}>
      <Text style={{fontWeight: 'bold', fontSize: 18}}>{placeholder}</Text>
      <Input 
        name={name}
        placeholder={`${placeholder}...`}
        control={control}
        rules={rules}
        type={inputType}
        styles={inputStyles}
      />
    </View>
  )
}