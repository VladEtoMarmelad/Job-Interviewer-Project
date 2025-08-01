import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './question.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
  ) {}

  findByInterview(interviewId: number): Promise<Question[]> {
    return this.questionsRepository.findBy({interview: {id: interviewId}})
  }

  async add(questionData: any): Promise<any> {
    const newQuestion = this.questionsRepository.create(questionData)
    return this.questionsRepository.save(newQuestion)
  }
}