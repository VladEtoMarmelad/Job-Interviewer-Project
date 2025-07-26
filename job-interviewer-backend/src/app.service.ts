import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  addInterview(): any {

  }

  async getVacancyFromURL(url: string): Promise<string> { //можно попытаться использовать полученое, как промпт для ИИ, чтобы передавать ему не информацию формы, а ссылку на вакансию
    const response = await fetch(url)
    const resText: string = await response.text()
    console.log("responseText:", JSON.stringify(resText, null, 4))
    console.log("typeof res:", typeof resText)
    return resText
  }
}
