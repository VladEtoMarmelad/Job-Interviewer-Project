import { View, Text, TextInput, Platform, Touchable, TouchableOpacity } from "react-native"
import { useAppDispatch, useAppSelector } from "@/store";
import { getThemeStyle } from "@/utils/getThemeStyle";
import { patchLastQuestion, changeInitialState } from "@/features/questionSlice";
import globalStyles from "@/styles/GlobalStyles";
import styles from '@/styles/InterviewChatScreenStyles';

export const InterviewChat = ({handleSubmitWrapper, handleInputChange, setInput, input}: any) => {
  const showChat = useAppSelector(state => state.interviews.showChat)
  const chatHeight = useAppSelector(state => state.interviews.chatHeight)
  const showContinueButton = useAppSelector(state => state.questions.showContinueButton)
  const colorScheme = useAppSelector(state => state.sessions.colorScheme)
  const dispatch = useAppDispatch()

  const continueInterviewHanler = (): void => {
    dispatch(changeInitialState({fieldName: "nextColumnUpdate", fieldValue: "aiQuestion"}))
    setInput("Давай продолжим собеседование")
  }

  const themeInputStyle = getThemeStyle(colorScheme, globalStyles, "Input")
  const themeButtonStyle = getThemeStyle(colorScheme, globalStyles, "Button")

  if (showChat) return (
    <View style={styles.chat}>
      {showContinueButton &&
        <TouchableOpacity
          onPress={continueInterviewHanler}
          style={[globalStyles.button, themeButtonStyle, {
            position: 'absolute', 
            top: 0, 
            right: 0, 
            bottom: 0, 
            left: 0, 
            margin: 'auto', 
            width: 125, 
            height: 50
          }]}
        ><Text style={{color: 'white', textAlign: 'center'}}>Продолжить</Text></TouchableOpacity>
      }

      <TextInput
        placeholder="Скажите что-то..."
        value={input}
        onChange={e =>
          handleInputChange({
            ...e,
            target: {
              ...e.target,
              value: e.nativeEvent.text,
            }
          } as unknown as React.ChangeEvent<HTMLInputElement>)
        }
        autoFocus={true}
        multiline
        style={[globalStyles.input, themeInputStyle, {width: '100%', height: chatHeight}]}
      />

      <TouchableOpacity
        onPress={() => {
          if (input!=="") {
            handleSubmitWrapper()
            dispatch(patchLastQuestion({
              columnValue: input
            }))
          }
        }}
        style={[globalStyles.button, themeButtonStyle, {marginLeft: 25, height: 50, alignSelf: Platform.OS === "web" ? 'flex-end' : 'center'}]}
      ><Text style={{color: 'white'}}>Отправить ответ</Text></TouchableOpacity>
    </View>
  )
}