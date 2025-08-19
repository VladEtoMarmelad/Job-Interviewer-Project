import { View, Text, FlatList, TextInput, TouchableOpacity } from "react-native"
import { useChat } from '@ai-sdk/react'
import { useEffect, useState, useRef } from "react";
import { useLocalSearchParams } from 'expo-router';
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { addQuestion, patchLastQuestion, getPrevQuestions, changeInitialState } from "@/features/questionSlice";
import { fetch as expoFetch } from 'expo/fetch';
import Slider from '@react-native-community/slider';
import globalStyles from "@/styles/GlobalStyles";
import styles from '@/styles/InterviewChatScreenStyles';
import axios from "axios";

const InterviewChatScreen = () => {
  const searchParams = useLocalSearchParams();
  const interviewId = Array.isArray(searchParams.interviewId) ? searchParams.interviewId[0] : searchParams.interviewId; //searchParams.interviewId: string|string[]
  const [interview, setInterview] = useState<any>(null)
  const [chatHeight, setChatHeight] = useState<number>(100)
  let startInterview = useRef<boolean>(false)  

  const prevQuestions: any = useSelector<RootState>(state => state.questions.prevQuestions)
  const showContinueButton: any = useSelector<RootState>(state => state.questions.showContinueButton)
  const dispatch = useDispatch<AppDispatch>();

  const { messages, input, setInput, handleInputChange, handleSubmit } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: `http://${process.env.EXPO_PUBLIC_IP}:3000/interview/chatAI`,
    onError: error => console.error(error, "ERROR"),
    body: {
      interviewId: interviewId,
      jobTitle: interview?.jobTitle,
      requiredKnowledge: interview?.requiredKnowledge,
      aiModel: interview?.aiModel,
      prevQuestions: prevQuestions
    },
    onFinish: async (lastAIMessage) => {
      console.log("lastAIMessage.content:", lastAIMessage.content)
      console.log("interviewId:", interviewId)
      dispatch(patchLastQuestion({
        columnValue: lastAIMessage.content,
        interviewId: interviewId
      }))
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
        setInterview(res.data)
      }
    }

    mountHandler()

    return (): void => {
      dispatch(changeInitialState({fieldName: "showContinueButton", fieldValue: false}))
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

  const startInterviewHanler = (): void => {
    startInterview.current=true
    dispatch(changeInitialState({fieldName: "nextColumnUpdate", fieldValue: "aiQuestion"}))
    setInput("Давай начнём собеседование")
  }

  const continueInterviewHanler = (): void => {
    dispatch(changeInitialState({fieldName: "nextColumnUpdate", fieldValue: "aiQuestion"}))
    setInput("Давай продолжим собеседование")
  }

  const handleSubmitWrapper = (): void => {
  const mockEvent = {
    preventDefault: () => {},
  };
  handleSubmit(mockEvent);
};

  if (!interview || !prevQuestions) return <Text>Загрузка...</Text>;
  if (prevQuestions.length===0 && messages.length===0) return (
    <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        flexDirection: 'row'
		}}>
      <TouchableOpacity
        onPress={startInterviewHanler}
        style={[globalStyles.button, globalStyles.lightThemeButton, {alignSelf: 'center'}]}
      ><Text style={{color: 'white'}}>Начать собеседование</Text></TouchableOpacity>
    </View>
  )

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#f2f2f2',
        flexDirection: 'row'
			}}
    >
    <View style={{height: '100%', flexDirection: 'column', width: '85%', padding: 5}}>
      <FlatList 
        data={prevQuestions}
        showsVerticalScrollIndicator={false}
        keyExtractor={question => question.id}
        style={{maxHeight: '45%'}}
        renderItem={({item: question}) => 
          <View>
            {question.aiQuestion !== "" && <View style={[styles.message, styles.assistantMessage, styles.lightThemeAssistantMessage]}><Text>{question.aiQuestion}</Text></View>}
            {question.userAnswer !== "" && <View style={[styles.message, styles.userMessage, styles.lightThemeUserMessage]}><Text>{question.userAnswer}</Text></View>}
            {question.aiSummary !== "" && <View style={[styles.message, styles.assistantMessage, styles.lightThemeAssistantMessage]}><Text>{question.aiSummary}</Text></View>}
          </View>
        }
      />

      <View style={{flexDirection: 'row'}}>
        {showContinueButton &&
          <TouchableOpacity
            onPress={continueInterviewHanler}
            style={[
              globalStyles.button, 
              globalStyles.lightThemeButton, 
              {
                position: 'absolute', 
                top: 0, 
                right: 0, 
                bottom: 0, 
                left: 0, 
                margin: 'auto', 
                width: 125, 
                height: 50
              }
            ]}
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
              },
            } as unknown as React.ChangeEvent<HTMLInputElement>)
          }
          autoFocus={true}
          multiline
          style={[globalStyles.input, globalStyles.lightThemeInput, {width: '100%', height: chatHeight}]}
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
          style={[globalStyles.button, globalStyles.lightThemeButton, {marginLeft: 25, height: 50, alignSelf: 'flex-end'}]}
        ><Text style={{color: 'white'}}>Отправить ответ</Text></TouchableOpacity>
      </View>

      <FlatList 
        data={messages} 
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        renderItem={({item: message, index}) => 
          <View 
            key={index}
            style={[
              styles.message, 
              message.role==="user" ? styles.userMessage: styles.assistantMessage,
              message.role==="user" ? styles.lightThemeUserMessage: styles.lightThemeAssistantMessage
            ]}
          >
            <Text>{message.content}</Text>
          </View>
        }
      />
    </View>

    <View style={{height: '100%', width: '15%', backgroundColor: 'white', borderLeftWidth: 1, borderColor: '#d8d8d8'}}>
      <Text style={{alignSelf: 'center', fontSize: 14, fontWeight: 'bold'}}>Размер текстового окна:</Text>
      <Text>Interview jobTitle: {interview.jobTitle}</Text>
      <Slider 
        style={{width: '90%', height: 40, alignSelf: 'center'}}
        value={chatHeight}
        onValueChange={e => setChatHeight(e)}
        step={10}
        minimumValue={100}
        maximumValue={750}
        minimumTrackTintColor="black"
        maximumTrackTintColor="gray"
        thumbTintColor="blue"
      />
    </View>
  </View>
  )
}

export default InterviewChatScreen;