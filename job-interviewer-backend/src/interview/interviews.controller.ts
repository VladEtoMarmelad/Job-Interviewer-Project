import { Controller, Get, Post, Query, Body, Res } from '@nestjs/common';
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

  @Get("getFromURL")
  getVacancyFromURL(@Query("vacancyURL") vacancyURL: string): Promise<string> {
    return this.interviewsService.getVacancyFromURL(vacancyURL);
  }

  @Post("add")
  addInterview(@Body() interviewData: any): any {
    return this.interviewsService.add(interviewData)
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

    const reformattedPrevQuestion: ReformattedPrevQuestion[] = interviewData.prevQuestions.flatMap((prevQuestion: PrevQuestion) =>
      rolesAndKeys.map(([role, key]) => ({
        role: role,
        content: `${prevQuestion[key]}. Это прошлый вопрос/ответ/итог.`
      }))
    );

    console.log("reformattedPrevQuestion:", JSON.stringify(reformattedPrevQuestion, null, 4))

    try {
      const result = streamText({
        model: google("gemini-2.0-flash"),
        messages: [
          //...reformattedPrevQuestion,
          {
            role: "system",
            content: `
              Представь, что ты интервьюер и проверяешь пользователь на должность ${interviewData.jobTitle}.
              Вот требования этой должности: ${interviewData.requiredKnowledge}. 
              Позадавай вопросы по нужным технологиям и после того, как пользователь даст ответ опиши, что прально/неправильно и почему.
              После того, как дашь фидбэк на ответ пользователя не задавай сразу сделующий вопрос, а спроси пользователя готов ли он продолжить.
            `
          },
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
