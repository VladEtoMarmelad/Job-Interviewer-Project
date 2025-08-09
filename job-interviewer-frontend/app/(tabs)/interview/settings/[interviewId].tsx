import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useLocalSearchParams } from "expo-router";
import { getInterviewById, deleteInterview, putInterview } from "@/features/interviewSlice";
import { useForm } from "react-hook-form";
import { InputAndLabel } from "@/components/InputAndLabel";
import { BlurView } from 'expo-blur';
import globalStyles from "@/styles/GlobalStyles"
import styles from "@/styles/InterviewSettingsScreenStyles";

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
	}

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      jobTitle: "",
      requiredKnowledge: "",
      questionsAmount: 30
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
        questionsAmount: interview.questionsAmount
      })
    }
  }, [interview])

  if (!interview) return <Text>Загрузка...</Text>

	return (
    <View style={{flex: 1}}>
      {showDeleteScreen &&
        <BlurView intensity={10} style={styles.blurContainer}>
          <View style={[styles.zone, styles.confirmZone, styles.lightThemeConfirmZone]}>
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
        <View style={styles.zone}>
          <View style={{flexDirection: 'row'}}>
            <View style={{width: '49%'}}>
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

            <View style={{width: 1, height: '100%', marginHorizontal: 15, backgroundColor: '#d8d8d8'}}/> {/*Vertical line between Views*/}

            <View style={{width: '49%'}}>

            </View>
          </View>
          <TouchableOpacity 
            // onPress={handleSubmit(() => dispatch(putInterview({
              
            // })))}
            style={[globalStyles.button, globalStyles.lightThemeButton, {alignSelf: 'center'}]}
          >
            <Text style={{color: 'white'}}>Сохранить изменения</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.zone, styles.dangerZone]}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text>Удалить интервью "{interview.jobTitle}"</Text>
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