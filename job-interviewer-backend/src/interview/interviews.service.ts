import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview } from './interview.entity';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { createWorker } from 'tesseract.js';

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

  async getRequiredKnowledgeFromURL(url: string): Promise<string|undefined> { 
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

  async getRequiredKnowledgeFromImage({image, scanItem}: any): Promise<string> {
    const worker = await createWorker();
    const res = await worker.recognize(image);
    console.log("Text from image:", res.data.text);
    await worker.terminate();

    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: `
        ${scanItem === "vacancy" ? 
          `
            Извлеки ключевые требования к кандидату из следующего текста вакансии.
            Ищи разделы с заголовками "Требования", "Вимоги", "Requirements", "Необходимые навыки", "Обязательные требования", "Hard Skills" или похожие по смыслу. 
            Игнорируй информацию о компании, условиях работы, бенефитах и разделе "Будет плюсом".
            Результат представь в виде четкого маркированного списка.
          ` 
            : 
          `
            Извлеки ключевые умения кандидата из следующего текста резюме.
            Ищи разделы с заголовками "Навыки", "Skills" или похожие по смыслу. 
            Результат представь в виде четкого маркированного списка.
          `
        }
        
        Текст для анализа:
        ${res.data.text}
      `
    });

    console.log("text:", text)
    return text
  }
}