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
  let nextCoulmnUpdate = useRef<"aiQuestion"|"userAnswer"|"aiSummary"|null>(null) //which question column will be updated next

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
      patchLastQuestion(lastAIMessage.content)
    }
  });

  useEffect(() => { //onMount
    const mountHandler = async (): Promise<void> => {
      const res = await axios.get(`http://${process.env.EXPO_PUBLIC_IP}:3000/interview/findOne`, {
        params: {interviewId: searchParams.interviewId}
      })

      const questions = await axios.get(`http://${process.env.EXPO_PUBLIC_IP}:3000/question/findByInterview`, {
        params: {interviewId: searchParams.interviewId}
      })
      setPrevQuestions(questions.data)
      console.log("questions:", questions)

      if (questions.data.length>0) {
        if (questions.data[questions.data.length-1].aiQuestion==="") {
          nextCoulmnUpdate.current="aiQuestion"
        } else if (questions.data[questions.data.length-1].userAnswer==="") {
          nextCoulmnUpdate.current="userAnswer"
        } else if (questions.data[questions.data.length-1].aiSummary==="") {
          nextCoulmnUpdate.current="aiSummary"
        } 
      }

      console.log("nextColumnUpdate:", nextCoulmnUpdate.current)

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
      addQuestion()
    }
  }, [input, startInterview])

  //there almost 40 lines of functions. Maybe I should move them to Redux reducers
  //also this will make structure of component easier to read and implement new functional
  const startInterviewHanler = (): void => {
    startInterview.current=true
    nextCoulmnUpdate.current="aiQuestion"
    setInput("Давай начнём собеседование")
  }

  const addQuestion = async (): Promise<void> => {
    const newQuestion = await axios.post(`http://${process.env.EXPO_PUBLIC_IP}:3000/question/add`, {
      aiQuestion: "",
      userAnswer: "",
      aiSummary: "",
      interviewId: searchParams.interviewId,
    })
    console.log("newQuestion:", newQuestion)
    setPrevQuestions((prevValue: any) => [...prevValue, newQuestion])
  }

  const changeNextCoulmnUpdate = async (): Promise<void> => {
    if (nextCoulmnUpdate.current==="aiQuestion") {
      nextCoulmnUpdate.current="userAnswer"
    } else if (nextCoulmnUpdate.current==="userAnswer") {
      nextCoulmnUpdate.current="aiSummary"
    } else {
      addQuestion()
      nextCoulmnUpdate.current="aiQuestion" 
    } 
  }

  const patchLastQuestion = async (columnValue: string): Promise<void> => {
    console.log("prevQuestion from patch func:", prevQuestions)
    const res = await axios.patch(`http://${process.env.EXPO_PUBLIC_IP}:3000/question/update`, {
      questionId: prevQuestions[prevQuestions.length-1].id,
      columnName: nextCoulmnUpdate.current,
      columnValue
    })
    console.log("patchRes:", res)
    if (res.status===200) {
      changeNextCoulmnUpdate()
    }
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
            patchLastQuestion(input)
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