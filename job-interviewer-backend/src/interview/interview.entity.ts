import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Interview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  interviewName: string;

  @Column()
  requiredKnowledge: string;

  @Column({ default: 30 })
  questionsAmount: number;
}