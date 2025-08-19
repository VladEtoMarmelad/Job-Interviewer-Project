import { View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useLocalSearchParams } from "expo-router";
import { getInterviewById, deleteInterview, putInterview } from "@/features/interviewSlice";
import { useForm } from "react-hook-form";
import { InputAndLabel } from "@/components/InputAndLabel";
import { BlurView } from 'expo-blur';
import globalStyles from "@/styles/GlobalStyles"
import settingsStyles from "@/styles/SettingsScreenStyles";

const BonusInterviewParams = ({control}: any) => {
  return (
    <InputAndLabel 
      name="aiModel"
      inputType="select"
      pickerItemsList={[
        {label: "Gemini-2.5 Flash", value: "gemini-2.5-flash"},
        {label: "Gemini-2 Flash", value: "gemini-2.0-flash"},
        {label: "Gemini-2 Flash Lite", value: "gemini-2.0-flash-lite"},
      ]}
      placeholder="Название модели"
      control={control}
      rules={{required: true}}
      labelPostion="top"
      inputStyles={{width: '100%'}}
    />
  )
}

const InterviewSettingsScreen = () => {
	const searchParams = useLocalSearchParams();
  const interviewId: number = Number(Array.isArray(searchParams.interviewId) ? searchParams.interviewId[0] : searchParams.interviewId);
  const [showDeleteScreen, setShowDeleteScreen] = useState<boolean>(false)
  const interview: any = useSelector<RootState>(state => state.interviews.interview)
	const dispatch = useDispatch<AppDispatch>();

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

  if (!interview) return <Text>Загрузка...</Text>

	return (
    <View style={{flex: 1, marginTop: 25}}>
      {showDeleteScreen &&
        <BlurView intensity={10} style={settingsStyles.blurContainer}>
          <View style={[settingsStyles.zone, settingsStyles.confirmZone, settingsStyles.lightThemeConfirmZone]}>
            <Text style={{alignSelf: 'center'}}>Вы уверены, что хотите удалить интервью "{interview.jobTitle}"?</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
              <TouchableOpacity 
                onPress={() => dispatch(deleteInterview(interviewId))}
                style={[globalStyles.button, {backgroundColor: 'red'}]}
              >
                <Text style={{color: 'white'}}>Удалить</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => setShowDeleteScreen(false)}
                style={[globalStyles.button, globalStyles.lightThemeButton]}
              >
                <Text style={{color: 'white'}}>Назад</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      }
      <ScrollView>
        <View style={settingsStyles.zone}>
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
            </View>

            {Platform.OS === "web" &&
              <View style={{flex: 1}}>
                {/* Vertical line between Views */}
                <View style={{width: 1, height: '100%', marginHorizontal: 15, backgroundColor: '#d8d8d8', position: 'absolute'}}/> 

                <View style={{width: '100%', marginLeft: 15, paddingHorizontal: 15}}>
                  <BonusInterviewParams control={control}/>
                </View>
              </View>
            }
          </View>
          <TouchableOpacity 
             onPress={handleSubmit(putInterviewHandler)}
            style={[globalStyles.button, globalStyles.lightThemeButton, {alignSelf: 'center'}]}
          >
            <Text style={{color: 'white'}}>Сохранить изменения</Text>
          </TouchableOpacity>
        </View>

        {Platform.OS !== "web" &&
          <View style={settingsStyles.zone}>
            <BonusInterviewParams control={control}/>
          </View>
        }

        <View style={[settingsStyles.zone, settingsStyles.dangerZone]}>
          <View style={settingsStyles.dangerZoneElement}>
            <Text>Удалить интервью</Text>
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