import { View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { useLocalSearchParams } from "expo-router";
import { getInterviewById, deleteInterview, putInterview } from "@/features/interviewSlice";
import { useForm } from "react-hook-form";
import { InputAndLabel } from "@/components/InputAndLabel";
import { BlurView } from 'expo-blur';
import { InterviewAIModelPicker } from "@/components/InterviewAIModelPicker";
import { getThemeStyle } from "@/utils/getThemeStyle";
import globalStyles from "@/styles/GlobalStyles"
import settingsStyles from "@/styles/SettingsScreenStyles";


const InterviewSettingsScreen = () => {
	const searchParams = useLocalSearchParams();
  const interviewId: number = Number(Array.isArray(searchParams.interviewId) ? searchParams.interviewId[0] : searchParams.interviewId);
  const [showDeleteScreen, setShowDeleteScreen] = useState<boolean>(false)
  const interview: any = useAppSelector(state => state.interviews.interview)
  const colorScheme = useAppSelector(state => state.sessions.colorScheme)
	const dispatch = useAppDispatch();

  interface FormData {
		jobTitle: string
		requiredKnowledge: string
		questionsAmount: number
    aiModel: string
	}

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      jobTitle: "",
      requiredKnowledge: "",
      questionsAmount: 30,
      aiModel: ""
    }
  })

	useEffect(() => {
    dispatch(getInterviewById(interviewId))
	}, [interviewId])

  useEffect(() => {
    if (interview) {
      reset({
        jobTitle: interview.jobTitle,
        requiredKnowledge: interview.requiredKnowledge,
        questionsAmount: interview.questionsAmount,
        aiModel: interview.aiModel
      })
    }
  }, [interview])

  const putInterviewHandler = (interviewData: any) => {
    interviewData.id = interviewId
    dispatch(putInterview(interviewData))
  }

  const themeBackgroundStyle = getThemeStyle(colorScheme, globalStyles, "Background")
  const themeButtonStyle = getThemeStyle(colorScheme, globalStyles, "Button")
  const themeTextStyle = getThemeStyle(colorScheme, globalStyles, "Text")
  const themeZoneStyle = getThemeStyle(colorScheme, settingsStyles, "Zone")
  const themeConfirmZoneStyle= getThemeStyle(colorScheme, settingsStyles, "ConfirmZone")

  if (!interview) return <Text>Загрузка...</Text>

	return (
    <View style={[globalStyles.background, themeBackgroundStyle]}>
      {showDeleteScreen &&
        <BlurView intensity={10} style={settingsStyles.blurContainer}>
          <View style={[settingsStyles.zone, settingsStyles.confirmZone, themeConfirmZoneStyle]}>
            <Text style={[themeTextStyle, {alignSelf: 'center'}]}>Вы уверены, что хотите удалить интервью "{interview.jobTitle}"?</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <TouchableOpacity 
                onPress={() => dispatch(deleteInterview(interviewId))}
                style={[globalStyles.button, {backgroundColor: 'red'}]}
              >
                <Text style={{color: 'white'}}>Удалить</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => setShowDeleteScreen(false)}
                style={[globalStyles.button, themeButtonStyle]}
              >
                <Text style={{color: 'white'}}>Назад</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      }
      <ScrollView>
        <View style={[settingsStyles.zone, themeZoneStyle]}>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: Platform.OS === "web" ? '49%': '100%'}}>
              <InputAndLabel 
                name="jobTitle"
                placeholder="Название должности"
                control={control}
                rules={{required: true}}
                labelPostion="top"
                inputStyles={{width: '100%'}}
              />
              <InputAndLabel 
                name="requiredKnowledge"
                placeholder="Требования вакансии"
                control={control}
                rules={{required: true}}
                labelPostion="top"
                inputStyles={{width: '100%'}}
              />
              <InputAndLabel 
                name="questionsAmount"
                placeholder="Количество вопросов"
                control={control}
                rules={{required: true}}
                inputType="number"
                labelPostion="top"
                inputStyles={{width: '100%'}}
              />
              {Platform.OS !== "web" && 
                <View>
                  {/* Horizontal line */}
                  <View style={{height: 1, width: '100%', margin: 15, backgroundColor: '#d8d8d8', alignSelf: 'center'}}/>

                  <InterviewAIModelPicker control={control} label/>
                  <Text style={[themeTextStyle, {padding: 5, fontSize: 18, fontWeight: 600}]}>Используемая модель: {interview.aiModel}</Text>
                </View>
              }
            </View>

            {Platform.OS === "web" &&
              <View style={{flex: 1}}>
                {/* Vertical line between Views */}
                <View style={{width: 1, height: '100%', marginHorizontal: 15, backgroundColor: '#d8d8d8', position: 'absolute'}}/> 

                <View style={{width: '100%', marginLeft: 15, paddingHorizontal: 15}}>
                  <InterviewAIModelPicker 
                    control={control} 
                    label 
                    styles={{width: '100%'}}
                  />
                  <Text style={[themeTextStyle, {padding: 5, fontSize: 18, fontWeight: 600}]}>Используемая модель: {interview.aiModel}</Text>
                </View>
              </View>
            }
          </View>
          <TouchableOpacity 
             onPress={handleSubmit(putInterviewHandler)}
            style={[globalStyles.button, themeButtonStyle, {alignSelf: 'center'}]}
          >
            <Text style={{color: 'white'}}>Сохранить изменения</Text>
          </TouchableOpacity>
        </View>

        <View style={[settingsStyles.zone, settingsStyles.dangerZone]}>
          <View style={settingsStyles.dangerZoneElement}>
            <Text style={themeTextStyle}>Удалить интервью</Text>
            <TouchableOpacity 
              onPress={() => setShowDeleteScreen(true)}
              style={{borderWidth: 1, borderColor: 'red', borderRadius: 10, padding: 5, marginLeft: 'auto'}}
            >
              <Text style={{color: 'red'}}>Удалить интервью</Text>
            </TouchableOpacity>
          </View>
        </View>
        
      </ScrollView>
    </View>
	)
}

export default InterviewSettingsScreen;