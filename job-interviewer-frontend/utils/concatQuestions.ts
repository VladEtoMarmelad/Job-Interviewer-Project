export const concatQuestions = (prevQuestions: any, messages: any): any => {
  interface PrevQuestion {
    aiQuestion: string;
    userAnswer: string;
    aiSummary: string;
  }

  interface ReformattedPrevQuestion { //message format
    role: "user"|"assistant";
    content: string;
  }

  const rolesAndKeys: [string, keyof PrevQuestion][] = [
    ["assistant", "aiQuestion"],
    ["user", "userAnswer"],
    ["assistant", "aiSummary"],
  ];

  const reformattedPrevQuestions: ReformattedPrevQuestion[] = prevQuestions.flatMap((prevQuestion: PrevQuestion) =>
    rolesAndKeys.map(([role, key]) => ({
      role: role,
      content: prevQuestion[key]
    }))
  ).filter((question: any) => question.content!==""); // clearing from empty messages. Empty messages cause errors

  const questionsList = reformattedPrevQuestions.concat(messages)

  return questionsList
}