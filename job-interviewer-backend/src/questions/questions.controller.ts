import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller("question")
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get("findByInterview")
  findByInterview(@Query("interviewId") interviewId: number) {
    return this.questionsService.findByInterview(interviewId)
  }

  @Post("add")
  add(@Body() questionData: any): any {
    return this.questionsService.add(questionData)
  }
}
