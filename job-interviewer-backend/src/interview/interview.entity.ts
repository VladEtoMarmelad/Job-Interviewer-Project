import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Question } from 'src/questions/question.entity';

@Entity({name: "interviews"})
export class Interview {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Question, (question) => question.interview)
  questions: Question[]


  
  @Column({type: "varchar", length: 100, default: ""})
  jobTitle: string;

  @Column({type: "text", default: ""})
  requiredKnowledge: string;

  @Column({ default: 10 })
  questionsAmount: number;
}