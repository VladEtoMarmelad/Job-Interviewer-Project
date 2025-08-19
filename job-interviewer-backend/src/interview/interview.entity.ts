import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Question } from 'src/questions/question.entity';
import { User } from 'src/user/user.entity';

@Entity({name: "interviews"})
export class Interview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: "varchar", length: 100, default: ""})
  jobTitle: string;

  @Column({type: "text", default: ""})
  requiredKnowledge: string;

  @Column({ default: 10 })
  questionsAmount: number;

  @Column({type: "varchar", length: 50, default: "gemini-2.0-flash"})
  aiModel: string;



  @OneToMany(() => Question, (question) => question.interview)
  questions: Question[]

  @ManyToOne(() => User, (user) => user.interviews, {onDelete: "CASCADE"})
  user: User
}