import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview } from './interview.entity';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

@Injectable()
export class InterviewsService {
  constructor(
    @InjectRepository(Interview)
    private interviewsRepository: Repository<Interview>,
  ) {}

  findAll(): Promise<Interview[]> {
    return this.interviewsRepository.find();
  }

  findOne(id: number): Promise<Interview | null> {
    return this.interviewsRepository.findOneBy({ id });
  }

  findByUserId(userId: number): Promise<Interview[]> {
    return this.interviewsRepository.findBy({ user: {id: userId} })
  }

  async delete(id: number): Promise<void> {
    await this.interviewsRepository.delete(id);
  }

  async add(data: any): Promise<any> {
    console.log("data:", data)
    const newInterview = this.interviewsRepository.create(data)
    console.log("newInterview:", newInterview)
    return this.interviewsRepository.save(newInterview)
  }

  async put(interviewData: any): Promise<any> {
    return this.interviewsRepository.update(interviewData.id, interviewData)
  }

  async addByURL(url: string): Promise<string|undefined> { //можно попытаться использовать полученое, как промпт для ИИ, чтобы передавать ему не информацию формы, а ссылку на вакансию
    const response = await fetch(url)
    const resText: string = await response.text()
    try {
      const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        prompt: `
          Ты — ассистент для анализа веб-страниц. Твоя задача — извлечь из HTML-кода только требования к вакансии. 
          Ищи разделы с заголовками "Требования", "Вимоги", "Requirements", "Необходимые навыки", "Обязательные требования", "Hard Skills" или похожие по смыслу. 
          Игнорируй информацию о компании, условиях работы, бенефитах и разделе "Будет плюсом".
          Результат представь в виде четкого маркированного списка.

          HTML для анализа:
          ${resText}
        `
      });
      console.log("AI result:", text)
      return text
    } catch (error) {
      console.error(error)
    }
  }
}