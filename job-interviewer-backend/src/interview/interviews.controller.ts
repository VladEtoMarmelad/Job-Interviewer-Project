import { Controller, Get, Post, Query, Body, Res } from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { Response } from 'express';

@Controller("interview")
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Get("getFromURL")
  getVacancyFromURL(@Query("vacancyURL") vacancyURL: string): Promise<string> {
    return this.interviewsService.getVacancyFromURL(vacancyURL);
  }

  @Post("add")
  addInterview(@Body() interviewData: any): any {
    return this.interviewsService.add(interviewData)
  }

  @Post("testAI")
  async example(@Res() res: Response) {
    const result = streamText({
      model: google("gemini-2.0-flash"),
      prompt: "Invent a new holiday and describe its traditions",
    });

    result.pipeTextStreamToResponse(res);
  }
}
