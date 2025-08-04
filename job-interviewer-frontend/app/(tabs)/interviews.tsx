import { View, Text, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { Link } from 'expo-router';
import axios from "axios";

const Interviews = () => {
  const [interviews, setInterviews] = useState(null);

  useEffect(() => {
    const getInterviews = async () => {
      const res = await axios.get(`http://${process.env.EXPO_PUBLIC_IP}:3000/interview/findAll`)
      console.log(res)
      if (res.status===200) {
        setInterviews(res.data)
      }
    }

    getInterviews()
  }, [])

  if (!interviews) return <Text>Загрузка...</Text>

  return (
    <View>
      <FlatList 
        data={interviews}
        keyExtractor={interview => interview.id}
        style={{marginTop: 15}}
        renderItem={({item: interview}) => 
          <Link 
            href={{
              pathname: "/interview/[interviewId]", 
              params: {interviewId: interview.id}
            }}
            style={{width: '80%', height: 75, backgroundColor: 'lightgray', alignSelf: 'center', borderRadius: 10, marginTop: 5}}
          >
            <View style={{padding: 5}}>
              <Text style={{fontWeight: 'bold', fontSize: 15}}>{interview.jobTitle}</Text>
              <Text style={{fontWeight: 500, fontSize: 15}}>Требуемые умения: {interview.requiredKnowledge}</Text>
            </View>
          </Link>
        }
      />
    </View>
  ) 
}

export default Interviews;