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
  const [chatHeight, setChatHeight] = useState<number>(100)
  let continueInterview = useRef<boolean>(false)
    
  const { messages, input, setInput, handleInputChange, handleSubmit } = useChat({
    api: "http://localhost:3000/interview/chatAI",
    onError: error => console.error(error, "ERROR"),
    body: {
      interviewId: searchParams.interviewId,
      jobTitle: interview?.jobTitle,
      requiredKnowledge: interview?.requiredKnowledge
    }
  });

  const handleButtonClick = () => {
    continueInterview.current = true
    setInput("Давай продолжим интервью")
  };

  useEffect(() => {
    const mountHandler = async (): Promise<void> => {
      const res = await axios.get("http://localhost:3000/interview/findOne", {
        params: {interviewId: searchParams.interviewId}
      })
      if (res.status===200) {
        setInterview(res.data)
      }
    }

    mountHandler()
  }, [])

  useEffect(() => {
    if (continueInterview.current) { //this condition happens after pressing "Continue interview" button
      handleSubmit(new Event("submit"))
      continueInterview.current = false
    }
  }, [input, continueInterview])

  if (!interview) return <Text>Загрузка...</Text>;

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

    <View style={{flexDirection: 'row', width: '85%', padding: 5}}>
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
        onPress={handleButtonClick}
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
    <View style={{height: '100%', width: '15%', backgroundColor: 'white', borderLeftWidth: 1, borderColor: '#d8d8d8'}}>
      <Text style={{alignSelf: 'center', fontSize: 14, fontWeight: 'bold'}}>Размер текстового окна:</Text>
      <Slider 
        style={{width: '90%', height: 40, alignSelf: 'center'}}
        value={chatHeight}
        onValueChange={e => setChatHeight(e)}
        minimumValue={100}
        maximumValue={750}
        minimumTrackTintColor="black"
        maximumTrackTintColor="gray"
        thumbTintColor="goldenrod"
      />
    </View>
  </View>
  )
}

export default InterviewChatScreen;