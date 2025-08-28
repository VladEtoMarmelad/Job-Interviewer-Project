import { View, Text, FlatList, TouchableOpacity } from "react-native"
import { useEffect, useRef, useMemo } from "react";
import { useLocalSearchParams } from 'expo-router';
import { useAppDispatch, useAppSelector } from "@/store";
import { addQuestion, getPrevQuestions, changeInitialState, patchLastQuestion } from "@/features/questionSlice";
import { changeInitialState as changeInterviewState } from "@/features/interviewSlice";
import { concatQuestions } from "@/utils/concatQuestions";
import { getThemeStyle } from "@/utils/getThemeStyle";
import { InterviewChat } from "@/components/InterviewChat";
import { InterviewChatSettings } from "@/components/InterviewChatSettings";
import { useChat } from "@ai-sdk/react";
import { fetch as expoFetch } from 'expo/fetch';
import globalStyles from "@/styles/GlobalStyles";
import styles from '@/styles/InterviewChatScreenStyles';
import axios from "axios";

const InterviewChatScreen = () => {
  const searchParams = useLocalSearchParams();
  const interviewId = Array.isArray(searchParams.interviewId) ? searchParams.interviewId[0] : searchParams.interviewId; //searchParams.interviewId: string|string[]
  let startInterview = useRef<boolean>(false)  

  const interview = useAppSelector(state => state.interviews.interview)
  const prevQuestions: any = useAppSelector(state => state.questions.prevQuestions)
  const showContinueButton: any = useAppSelector(state => state.questions.showContinueButton)
  const colorScheme = useAppSelector(state => state.sessions.colorScheme)
  const dispatch = useAppDispatch();

  const { messages, input, setInput, handleInputChange, handleSubmit } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: `http://${process.env.EXPO_PUBLIC_IP}:3000/interview/chatAI`,
    onError: error => console.error(error, "ERROR"),
    body: {
      interviewId: interviewId,
      jobTitle: interview?.jobTitle,
      requiredKnowledge: interview?.requiredKnowledge,
      aiModel: interview?.aiModel,
      prevQuestions: prevQuestions,
    },
    onFinish: async (lastAIMessage) => {
      console.log("lastAIMessage.content:", lastAIMessage.content)
      console.log("interviewId:", interviewId)
      dispatch(patchLastQuestion({
        columnValue: lastAIMessage.content,
        interviewId: interviewId
      }))
      console.log("allMessages", messages)
    }
  });

  useEffect(() => { //onMount
    const mountHandler = async (): Promise<void> => {
      const res = await axios.get(`http://${process.env.EXPO_PUBLIC_IP}:3000/interview/findOne`, {
        params: {interviewId: interviewId}
      })

      dispatch(getPrevQuestions(interviewId)).unwrap().then(prevQuestions => {
        if (prevQuestions.length>0) {
          if (
            prevQuestions[prevQuestions.length-1].aiQuestion==="" && 
            prevQuestions[prevQuestions.length-1].userAnswer==="" && 
            prevQuestions[prevQuestions.length-1].aiSummary===""
          ) {
            dispatch(changeInitialState({
              fieldName: "showContinueButton",
              fieldValue: true
            }))
          }

          if (prevQuestions[prevQuestions.length-1].aiQuestion==="") {
            dispatch(changeInitialState({fieldName: "nextColumnUpdate", fieldValue: "aiQuestion"}))
          } else if (prevQuestions[prevQuestions.length-1].userAnswer==="") {
            dispatch(changeInitialState({fieldName: "nextColumnUpdate", fieldValue: "userAnswer"}))
          } else if (prevQuestions[prevQuestions.length-1].aiSummary==="") {
            dispatch(changeInitialState({fieldName: "nextColumnUpdate", fieldValue: "aiSummary"}))
          }
        }
      })
      
      if (res.status===200) {
        dispatch(changeInterviewState({fieldName: "interview", fieldValue: res.data}))
      }
    }

    mountHandler()

    return (): void => {
      dispatch(changeInitialState({fieldName: "showContinueButton", fieldValue: false}))
      dispatch(changeInitialState({fieldName: "lastQuestionId", fieldValue: null}))
      dispatch(changeInitialState({fieldName: "prevQuestions", fieldValue: []}))
      dispatch(changeInterviewState({fieldName: "disableChat", fieldValue: false}))
      dispatch(changeInterviewState({fieldName: "showChat", fieldValue: true}))
    }
  }, [interviewId]) //onMount

  useEffect(() => {
    if (startInterview.current && input!=="") {
      handleSubmitWrapper()
      startInterview.current=false
      dispatch(addQuestion(interviewId)) 
    }
    if (showContinueButton && input!=="") {
      handleSubmitWrapper()
      dispatch(changeInitialState({
        fieldName: "showContinueButton",
        fieldValue: false
      }))
    }
  }, [input, startInterview, showContinueButton])

  const handleSubmitWrapper = (): void => {
    const mockEvent = {preventDefault: () => {}};
    handleSubmit(mockEvent);
  };

  const startInterviewHanler = (): void => {
    startInterview.current=true
    dispatch(changeInitialState({fieldName: "nextColumnUpdate", fieldValue: "aiQuestion"}))
    setInput("Давай начнём собеседование")
  }

  const questionsList = useMemo(() => concatQuestions(prevQuestions, messages), [prevQuestions, messages])

  useEffect(() => {
    if (questionsList.length>0 && interview) {
      const filteredQuestionsList = questionsList.filter((question: any) => question.content!=="Давай начнём собеседование" && question.content!=="Давай продолжим собеседование")
      if (interview.questionsAmount<=filteredQuestionsList.length/3) {
        console.log("Конец интервью")
        dispatch(changeInterviewState({fieldName: "disableChat", fieldValue: true}))
        dispatch(changeInterviewState({fieldName: "showChat", fieldValue: false}))
      }
    }
  }, [interview, questionsList])

  const themeBackgroundStyle = getThemeStyle(colorScheme, globalStyles, "Background")
  const themeButtonStyle = getThemeStyle(colorScheme, globalStyles, "Button")
  const themeUserMessageStyle = getThemeStyle(colorScheme, styles, "UserMessage")
  const themeAssistantMessageStyle = getThemeStyle(colorScheme, styles, "AssistantMessage")
  const themeTextStyle = getThemeStyle(colorScheme, globalStyles, "Text")

  if (!interview || !prevQuestions) return <Text>Загрузка...</Text>;
  if (prevQuestions.length===0 && messages.length===0) return (
    <View style={[globalStyles.background, themeBackgroundStyle, {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
		}]}>
      <TouchableOpacity
        onPress={startInterviewHanler}
        style={[globalStyles.button, themeButtonStyle, {alignSelf: 'center'}]}
      ><Text style={{color: 'white'}}>Начать собеседование</Text></TouchableOpacity>
    </View>
  )

  return (
    <View style={[globalStyles.background, themeBackgroundStyle, {justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}]}>
      <View style={styles.chatSection}>
        <InterviewChat 
          handleSubmitWrapper={handleSubmitWrapper}
          handleInputChange={handleInputChange}
          setInput={setInput}
          input={input}
        />

        <FlatList 
          data={questionsList} 
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          renderItem={({item: message, index}) => 
            <View 
              key={index}
              style={[
                styles.message, 
                message.role==="user" ? styles.userMessage : styles.assistantMessage,
                message.role==="user" ? themeUserMessageStyle : themeAssistantMessageStyle
              ]}
            >
              <Text style={themeTextStyle}>{message.content}</Text>
            </View>
          }
        />
      </View>

      <InterviewChatSettings />
    </View>
  )
}

export default InterviewChatScreen;