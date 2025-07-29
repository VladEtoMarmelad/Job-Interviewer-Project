import { View, Text, FlatList, TextInput } from "react-native"
import { useChat } from '@ai-sdk/react'
import { useEffect, useState } from "react";
import { useLocalSearchParams } from 'expo-router';
import globalStyles from "@/styles/GlobalStyles"
import axios from "axios";

const InterviewChatScreen = () => {
    const searchParams = useLocalSearchParams();
    const [interview, setInterview] = useState<any>(null)

    const { messages, input, handleInputChange, handleSubmit } = useChat({
        api: "http://localhost:3000/interview/chatAI",
        onError: error => console.error(error, "ERROR"),
        body: {
            interviewId: searchParams.interviewId,
            jobTitle: interview?.jobTitle,
            requiredKnowledge: interview?.requiredKnowledge
        }
    });

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

    if (!interview) return <Text>Загрузка...</Text>;

    return (
        <View
            style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: '#f2f2f2'
			}}
        >

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
                style={[globalStyles.input, globalStyles.lightThemeInput]}
			/>

            <FlatList 
                data={messages} 
                renderItem={({item: message, index}) => 
                    <Text key={index}>
                        {message.content}
                    </Text>
                }
            />
        </View>
    )
}

export default InterviewChatScreen;