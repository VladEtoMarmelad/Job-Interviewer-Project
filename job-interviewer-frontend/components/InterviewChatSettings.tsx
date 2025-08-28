import { View, TouchableOpacity, Text } from "react-native"
import { useAppSelector, useAppDispatch } from "@/store";
import { changeInitialState } from "@/features/interviewSlice";
import { getThemeStyle } from "@/utils/getThemeStyle";
import Slider from '@react-native-community/slider';
import globalStyles from "@/styles/GlobalStyles";
import styles from '@/styles/InterviewChatScreenStyles';

export const InterviewChatSettings = () => {
  const disableChat = useAppSelector(state => state.interviews.disableChat)
  const showChat = useAppSelector(state => state.interviews.showChat)
  const chatHeight = useAppSelector(state => state.interviews.chatHeight)
  const colorScheme = useAppSelector(state => state.sessions.colorScheme)
  const dispatch = useAppDispatch()

  const themeChatSettingSectionStyle = getThemeStyle(colorScheme, styles, "ChatSettingSection")
  const themeButtonStyle = getThemeStyle(colorScheme, globalStyles, "Button")
  const themeTextStyle = getThemeStyle(colorScheme, globalStyles, "Text")
  return (
    <View style={[styles.chatSettingSection, themeChatSettingSectionStyle]}>
      <Text style={[themeTextStyle, {alignSelf: 'center', fontSize: 14, fontWeight: 'bold'}]}>Размер текстового окна:</Text>
      <Slider 
        style={{width: '90%', height: 40, alignSelf: 'center'}}
        value={chatHeight}
        onValueChange={e => dispatch(changeInitialState({fieldName: "chatHeight", fieldValue: e}))}
        step={10}
        minimumValue={100}
        maximumValue={750}
        minimumTrackTintColor={colorScheme === "light" ? 'black' : 'white'}
        maximumTrackTintColor={colorScheme === "light" ? 'gray' : '#27292b'}
        thumbTintColor={colorScheme === "light" ? 'blue' : 'goldenrod'}
      />
      <TouchableOpacity 
        onPress={() => dispatch(changeInitialState({fieldName: "showChat", fieldValue: !showChat}))}
        disabled={disableChat}
        style={[globalStyles.button, themeButtonStyle, disableChat ? {backgroundColor: '#525252'} : {}]}
      ><Text style={{color: 'white'}}>{showChat ? "Скрыть чат" : "Показть чат"}</Text></TouchableOpacity>
    </View>
  )
}