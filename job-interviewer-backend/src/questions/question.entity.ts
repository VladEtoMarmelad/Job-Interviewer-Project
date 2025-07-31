import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Interview } from 'src/interview/interview.entity';

@Entity({name: "questions"})
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Interview, (interview) => interview.questions)
  interview: Interview


  
  @Column({type: "text", default: ""})
  aiQuestion: string;

  @Column({type: "text", default: ""})
  userAnswer: string;

}