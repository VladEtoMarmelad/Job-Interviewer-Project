import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interview } from './interview.entity';

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

  async remove(id: number): Promise<void> {
    await this.interviewsRepository.delete(id);
  }

  async add(data: any): Promise<any> {
    console.log("data:", data)
    const newInterview = this.interviewsRepository.create(data)
    console.log("newInterview:", newInterview)
    return this.interviewsRepository.save(newInterview)
  }

  async getVacancyFromURL(url: string): Promise<string> { //можно попытаться использовать полученое, как промпт для ИИ, чтобы передавать ему не информацию формы, а ссылку на вакансию
    const response = await fetch(url)
    const resText: string = await response.text()
    console.log("responseText:", JSON.stringify(resText, null, 4))
    console.log("typeof res:", typeof resText)
    return resText
  }
}