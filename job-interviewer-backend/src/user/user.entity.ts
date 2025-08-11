import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Interview } from 'src/interview/interview.entity';

@Entity({name: "users"})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: "varchar", length: 50, default: ""})
  name: string;

  @Column({type: "text", default: ""})
  password: string



  @OneToMany(() => Interview, (interview) => interview.user)
  interviews: Interview[]
}