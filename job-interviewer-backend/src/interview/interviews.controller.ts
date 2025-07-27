import { Controller, Get, Post, Query } from '@nestjs/common';
import { InterviewsService } from './interviews.service';

@Controller("interview")
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Get("getFromURL")
  getVacancyFromURL(@Query("vacancyURL") vacancyURL: string): Promise<string> {
    return this.interviewsService.getVacancyFromURL(vacancyURL);
  }

  @Post("add")
  addInterview(): any {
    return this.interviewsService.add({
        id: 1,
        interviewName: "interviewName",
        requiredKnowledge: "some requiredKnowledge",
        questionsAmount: 30
    });
  }
}
