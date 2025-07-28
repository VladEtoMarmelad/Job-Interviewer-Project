import { TouchableOpacity, View, Text } from "react-native"
import { useState } from "react";
import axios from "axios";
import globalStyles from "@/styles/GlobalStyles"

const InterviewChatScreen = () => {
    const [messages, setMessages] = useState("")

    const testAI = async () => {
		// const res = await axios.post("http://localhost:3000/interview/testAI")
		// console.log(res)

        // setMessages(res.data)

        const response = await fetch("http://localhost:3000/interview/testAI", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.body) {
            console.warn("Stream not supported");
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        let done = false;
        let partial = "";

        while (!done) {
            const { value, done: streamDone } = await reader.read();
            done = streamDone;

            if (value) {
                partial += decoder.decode(value, { stream: true });
                setMessages((prev) => prev + partial);
                partial = "";
            }
        }
	}

    return (
        <View
            style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: '#f2f2f2'
			}}
        >
            <TouchableOpacity
			    onPress={testAI}
			    style={[globalStyles.button, globalStyles.lightThemeButton]}
		    ><Text style={{color: 'white'}}>Test AI</Text></TouchableOpacity>

            <Text>
                AI Message: {messages}
            </Text>
        </View>
    )
}

export default InterviewChatScreen;