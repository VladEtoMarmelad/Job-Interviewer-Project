import { Controller, Get } from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller("question")
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  // @Get("isExists")
  // isExists() {
  //   return this.questionsService.isExists(1)
  // }
}
