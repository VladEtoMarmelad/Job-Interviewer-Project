import { View, Text, FlatList, TextInput, TouchableOpacity } from "react-native"
import { useChat } from '@ai-sdk/react'
import { useEffect, useState, useRef } from "react";
import { useLocalSearchParams } from 'expo-router';
import Slider from '@react-native-community/slider';
import globalStyles from "@/styles/GlobalStyles"
import axios from "axios";

const InterviewChatScreen = () => {
  const searchParams = useLocalSearchParams();
  const [interview, setInterview] = useState<any>(null)
  const [prevQuestions, setPrevQuestions] = useState<any>(null)
  const [chatHeight, setChatHeight] = useState<number>(100)
  let startInterview = useRef<boolean>(false)  

  const { messages, input, setInput, handleInputChange, handleSubmit } = useChat({
    api: `http://${process.env.EXPO_PUBLIC_IP}:3000/interview/chatAI`,
    onError: error => console.error(error, "ERROR"),
    body: {
      interviewId: searchParams.interviewId,
      jobTitle: interview?.jobTitle,
      requiredKnowledge: interview?.requiredKnowledge
    }
  });

  useEffect(() => {
    const mountHandler = async (): Promise<void> => {
      const res = await axios.get(`http://${process.env.EXPO_PUBLIC_IP}:3000/interview/findOne`, {
        params: {interviewId: searchParams.interviewId}
      })

      const questions = await axios.get(`http://${process.env.EXPO_PUBLIC_IP}:3000/question/findByInterview`, {
        params: {interviewId: searchParams.interviewId}
      })
      setPrevQuestions(questions.data)
      console.log("questions:", questions)

      if (res.status===200) {
        setInterview(res.data)
      }
    }

    mountHandler()
  }, [searchParams.interviewId])

  useEffect(() => {
    console.log("startInterview:", startInterview)
    console.log("input", input)
    if (startInterview.current && input!=="") {
      handleSubmit(new Event("submit"))
      startInterview.current=false
    }
  }, [input, startInterview])

  const startInterviewHanler = (): void => {
    console.log("gdflgkj")
    startInterview.current=true
    setInput("Давай начнём собеседование")
    
  }

  if (!interview || !prevQuestions) return <Text>Загрузка...</Text>;
  if (prevQuestions.length===0) return (
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
      
    <View style={{flexDirection: 'column', width: '85%', padding: 5}}>
      <View style={{flexDirection: 'row'}}>
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
          onPress={() => handleSubmit(new Event("submit"))}
          style={[globalStyles.button, globalStyles.lightThemeButton, {marginLeft: 25, height: 50, alignSelf: 'flex-end'}]}
        ><Text style={{color: 'white'}}>Отправить ответ</Text></TouchableOpacity>
      </View>

      <FlatList 
        data={messages} 
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