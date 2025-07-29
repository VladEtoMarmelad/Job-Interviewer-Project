import { Controller, Get, Post, Query, Body, Res } from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { Response } from 'express';

@Controller("interview")
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

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
    try {
      const result = streamText({
        model: google("gemini-2.0-flash"),
        messages: [
          {
            role: "system",
            content: `
              Представь, что ты интервьюер и проверяешь пользователь на должность ${interviewData.jobTitle}.
              Вот требования этой должности: ${interviewData.requiredKnowledge}. 
              Позадавай вопросы по нужным технологиям и после того, как пользователь даст ответ опиши, что прально/неправильно и почему.
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
