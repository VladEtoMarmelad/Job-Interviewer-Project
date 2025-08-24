import { Controller, Get, Post, Query, Body, Res, Delete, Put } from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { Response } from 'express';

@Controller("interview")
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Get("findAll")
  findAll() {
    return this.interviewsService.findAll()
  }

  @Get("findOne")
  findOne(@Query("interviewId") interviewId: number) {
    return this.interviewsService.findOne(interviewId)
  }

  @Get("findByUserId")
  findByUserId(@Query("userId") userId: number) {
    return this.interviewsService.findByUserId(userId)
  }

  @Post("addByURL")
  async addByURL(@Body() interviewData: any): Promise<any> {
    const requiredKnowledge = await this.interviewsService.addByURL(interviewData.vacancyURL);
    return this.interviewsService.add({
      jobTitle: "URL Interview",
      requiredKnowledge: requiredKnowledge,
      questionsAmount: 30,
      aiModel: "gemini-2.5-flash",

      user: interviewData.user
    })
  }

  @Post("add")
  addInterview(@Body() interviewData: any): any {
    return this.interviewsService.add(interviewData)
  }

  @Delete("delete")
  delete(@Query("interviewId") interviewId: number) {
    return this.interviewsService.delete(interviewId)
  }

  @Put("put")
  put(@Body() interviewData: any): any {
    return this.interviewsService.put(interviewData)
  }

  @Post("chatAI")
  async chatAI(@Body() interviewData: any, @Res() res: Response) {
    console.log("interviewData:", JSON.stringify(interviewData, null, 4))
    console.log("prevQuestions:", JSON.stringify(interviewData.prevQuestions, null, 4))

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

    const reformattedPrevQuestions: ReformattedPrevQuestion[] = interviewData.prevQuestions.flatMap((prevQuestion: PrevQuestion) =>
      rolesAndKeys.map(([role, key]) => ({
        role: role,
        content: prevQuestion[key]
      }))
    ).filter((question: any) => question.content!==""); // clearing from empty messages. Empty messages cause errors

    console.log("reformattedPrevQuestion:", JSON.stringify(reformattedPrevQuestions, null, 4))

    try {
      const result = streamText({
        model: google(interviewData.aiModel),
        messages: [
          {
            role: "system",
            content: `
              Представь, что ты интервьюер и проверяешь пользователь на должность ${interviewData.jobTitle}.
              Вот требования этой должности: ${interviewData.requiredKnowledge}. 
              Позадавай вопросы по нужным технологиям и после того, как пользователь даст ответ опиши, что прально/неправильно и почему.
              После того, как дашь фидбэк на ответ пользователя не задавай сразу сделующий вопрос, а спроси пользователя готов ли он продолжить.
            `
          },
          ...reformattedPrevQuestions,
          ...interviewData.messages,
        ]
      });

      result.pipeDataStreamToResponse(res);
    } catch (error) {
      console.error(error)
      res.status(500).send("Internal Server Error");
    }
  }
}
