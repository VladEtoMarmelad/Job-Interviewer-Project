import { Input } from "./Input";
import { InputAndLabel } from "./InputAndLabel";

interface Props {
  label?: boolean;
  control: any;
  styles?: any
}

const pickerItemsList = [
  {label: "Выберите ИИ модель", value: null},
  {label: "Gemini-2.5 Flash", value: "gemini-2.5-flash"},
  {label: "Gemini-2 Flash", value: "gemini-2.0-flash"},
  {label: "Gemini-2 Flash Lite", value: "gemini-2.0-flash-lite"},
]

export const InterviewAIModelPicker: React.FC<Props> = ({label=false, control, styles}) => {
  const sameProps = {
    name: "aiModel",
    placeholder: "Название модели",
    control: control,
    rules: { required: true },
    pickerItemsList: pickerItemsList,
  };

  const differentProps = label ? {
    inputType: "select" as const, 
    labelPostion: "top" as const,
    inputStyles: styles,
  } : {
    type: "select" as const,
    styles: styles,
  };

  const InputComponent = label ? InputAndLabel : Input
  
  return <InputComponent 
    {...sameProps}
    {...differentProps}
  />
}