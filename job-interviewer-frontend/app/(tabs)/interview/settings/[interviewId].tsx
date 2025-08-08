import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useLocalSearchParams } from "expo-router";
import { getInterviewById, deleteInterview } from "@/features/interviewSlice";
import { useForm } from "react-hook-form";
import { InputAndLabel } from "@/components/InputAndLabel";
import styles from "@/styles/InterviewSettingsScreenStyles";

const InterviewSettingsScreen = () => {
	const searchParams = useLocalSearchParams();
  const interviewId: number = Number(Array.isArray(searchParams.interviewId) ? searchParams.interviewId[0] : searchParams.interviewId);
  const [showDeleteScreen, setShowDeleteScreen] = useState<boolean>(true)
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
		<ScrollView>
			<View style={[styles.zone]}>
        <InputAndLabel 
          name="jobTitle"
          placeholder="Название должности"
          control={control}
          rules={{required: true}}
          labelPostion="top"
        />
        <InputAndLabel 
          name="requiredKnowledge"
          placeholder="Требования вакансии"
          control={control}
          rules={{required: true}}
          labelPostion="top"
        />
        <InputAndLabel 
          name="questionsAmount"
          placeholder="Количество вопросов"
          control={control}
          rules={{required: true}}
          inputType="number"
          labelPostion="top"
        />
			</View>

			<View style={[styles.zone, styles.dangerZone]}>
				<View style={{flexDirection: 'row', alignItems: 'center'}}>
					<Text>Удалить интервью "{interview.jobTitle}"</Text>
          <TouchableOpacity 
            onPress={() => dispatch(deleteInterview(interviewId))}
            style={{borderWidth: 1, borderColor: 'red', borderRadius: 10, padding: 5, marginLeft: 'auto'}}
          >
            <Text style={{color: 'red'}}>Удалить интервью</Text>
          </TouchableOpacity>
				</View>
			</View>
      {showDeleteScreen &&
        <View 
          style={[styles.zone, styles.confirmZone, styles.lightThemeConfirmZone]}
        >
          <Text>Вы уверены, что хотите удалить интервью "{interview.jobTitle}"?</Text>

          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={{}}>
              <Text>Удалить</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text>Назад</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
		</ScrollView>
	)
}

export default InterviewSettingsScreen;