import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller("vacancy")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("getFromURL")
  getVacancyFromURL(@Query('vacancyURL') vacancyURL: string): Promise<string> {
    console.log("vacancyURL:", vacancyURL)
    return this.appService.getVacancyFromURL(vacancyURL);
  }
}
