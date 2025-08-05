import { View, Text, FlatList, TextInput, TouchableOpacity } from "react-native"
import { useChat } from '@ai-sdk/react'
import { useEffect, useState, useRef } from "react";
import { useLocalSearchParams } from 'expo-router';
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { addQuestion, changeNextColumnUpdate, patchLastQuestion, getPrevQuestions } from "@/features/questionSlice";
import Slider from '@react-native-community/slider';
import globalStyles from "@/styles/GlobalStyles"
import axios from "axios";

const InterviewChatScreen = () => {
  const searchParams = useLocalSearchParams();
  const [interview, setInterview] = useState<any>(null)
  const [chatHeight, setChatHeight] = useState<number>(100)
  let startInterview = useRef<boolean>(false)  

  const prevQuestions: any = useSelector<RootState>(state => state.questions.prevQuestions)
  const dispatch = useDispatch<AppDispatch>();

  const { messages, input, setInput, handleInputChange, handleSubmit } = useChat({
    api: `http://${process.env.EXPO_PUBLIC_IP}:3000/interview/chatAI`,
    onError: error => console.error(error, "ERROR"),
    body: {
      interviewId: searchParams.interviewId,
      jobTitle: interview?.jobTitle,
      requiredKnowledge: interview?.requiredKnowledge
    },
    onFinish: async (lastAIMessage) => {
      console.log("Finish!")
      console.log("lastAIMessage:", JSON.stringify(lastAIMessage, null, 4))
      dispatch(patchLastQuestion({
        columnValue: lastAIMessage.content
      }))
    }
  });

  useEffect(() => { //onMount
    const mountHandler = async (): Promise<void> => {
      const res = await axios.get(`http://${process.env.EXPO_PUBLIC_IP}:3000/interview/findOne`, {
        params: {interviewId: searchParams.interviewId}
      })

      dispatch(getPrevQuestions(Array.isArray(searchParams.interviewId) ? searchParams.interviewId[0] : searchParams.interviewId)).unwrap().then(prevQuestions => {
        console.log("prevQuestions:", prevQuestions)

        if (prevQuestions.length>0) {
          if (prevQuestions[prevQuestions.length-1].aiQuestion==="") {
            dispatch(changeNextColumnUpdate("aiQuestion"))
          } else if (prevQuestions[prevQuestions.length-1].userAnswer==="") {
            dispatch(changeNextColumnUpdate("userAnswer"))
          } else if (prevQuestions[prevQuestions.length-1].aiSummary==="") {
            dispatch(changeNextColumnUpdate("aiSummary"))
          }
        }
      })
      
      if (res.status===200) {
        setInterview(res.data)
      }
    }

    mountHandler()
  }, [searchParams.interviewId]) //onMount

  useEffect(() => {
    if (startInterview.current && input!=="") {
      handleSubmit(new Event("submit"))
      startInterview.current=false
      dispatch(addQuestion(Array.isArray(searchParams.interviewId) ? searchParams.interviewId[0] : searchParams.interviewId)) //searchParams.interviewId: string|string[]
    }
  }, [input, startInterview])

  const startInterviewHanler = (): void => {
    startInterview.current=true
    dispatch(changeNextColumnUpdate("aiQuestion"))
    setInput("Давай начнём собеседование")
  }

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
        renderItem={({item: question}) => 
          <Text>
            {question.aiQuestion}
          </Text>
        }
      />

      <View style={{flexDirection: 'row'}}>
        {/* {
          <TouchableOpacity
            onPress={() => {
              handleSubmit(new Event("submit"))
            }}
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
        } */}

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
          onSubmitEditing={e => {
            handleSubmit(e);
            e.preventDefault();
          }}
          autoFocus={true}
          multiline
          style={[globalStyles.input, globalStyles.lightThemeInput, {width: '100%', height: chatHeight}]}
        />

        <TouchableOpacity
          onPress={() => {
            handleSubmit(new Event("submit"))
            dispatch(patchLastQuestion({
              columnValue: input
            }))
          }}
          style={[globalStyles.button, globalStyles.lightThemeButton, {marginLeft: 25, height: 50, alignSelf: 'flex-end'}]}
        ><Text style={{color: 'white'}}>Отправить ответ</Text></TouchableOpacity>
      </View>

      <FlatList 
        data={messages} 
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        renderItem={({item: message, index}) => 
          <Text key={index}>
            {message.content}
          </Text>
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