import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Interviews {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: "varchar", length: 50, default: ""})
  jobTitle: string;

  @Column({type: "text", default: ""})
  requiredKnowledge: string;

  @Column({ default: 10 })
  questionsAmount: number;
}