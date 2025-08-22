import { View, Text, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { Link } from 'expo-router';
import { useAppSelector } from "@/store";
import { getThemeStyle } from "@/utils/getThemeStyle";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from "axios";
import globalStyles from "@/styles/GlobalStyles";
import styles from "@/styles/InterviewsStyles";

const Interviews = () => {
  const user = useAppSelector(state => state.sessions.user)
  const colorScheme = useAppSelector(state => state.sessions.colorScheme)
  const sessionStatus = useAppSelector(state => state.sessions.status)
  const [interviews, setInterviews] = useState(null);

  useEffect(() => {
    const getInterviews = async () => {
      const res = await axios.get(`http://${process.env.EXPO_PUBLIC_IP}:3000/interview/findByUserId`, {params: {userId: user.sub}})
      if (res.status===200) {
        setInterviews(res.data)
      }
    }

    if (sessionStatus === "authenticated") {
      getInterviews()
    }
  }, [sessionStatus])

  const themeBackgroundStyle = getThemeStyle(colorScheme, globalStyles, "Background") 

  if (!interviews) return <Text>Загрузка...</Text>

  return (
    <View style={[globalStyles.background, themeBackgroundStyle]}>
      <FlatList 
        data={interviews}
        keyExtractor={interview => interview.id}
        style={{marginTop: 15}}
        renderItem={({item: interview}) => 
          <View style={styles.interviewElement}>
            <Link 
              href={{
                pathname: "/interview/[interviewId]", 
                params: {interviewId: interview.id}
              }}
              style={styles.interviewElementLink}
            >
              <View style={{padding: 5}}>
                <Text style={{fontWeight: 'bold', fontSize: 15}}>{interview.jobTitle}</Text>
                <Text style={{fontWeight: 500, fontSize: 15}}>Требуемые умения: {interview.requiredKnowledge}</Text>
              </View>
            </Link>

            <View style={styles.interviewElementLinkSettings}>
              <Link 
                href={{
                  pathname: "/interview/settings/[interviewId]",
                  params: {interviewId: interview.id}
                }}
              >
                <FontAwesome name="gear" size={24} color="black" />
              </Link>
            </View>
          </View>
        }
      />
    </View>
  ) 
}

export default Interviews;