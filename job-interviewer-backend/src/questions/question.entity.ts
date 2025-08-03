import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Interview } from 'src/interview/interview.entity';

@Entity({name: "questions"})
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: "text", default: ""})
  aiQuestion: string;

  @Column({type: "text", default: ""})
  userAnswer: string;

  @Column({type: "text", default: ""})
  aiSummary: string;

  @ManyToOne(() => Interview, (interview) => interview.questions)
  interview: Interview
}

//React Native Junior
//HTML Css JS TS React React Native Expo NextJS Redux