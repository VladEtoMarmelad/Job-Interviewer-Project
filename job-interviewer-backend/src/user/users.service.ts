import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { hash } from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findOneByName(username: string): any {
    console.log("search username:", username)
    return this.usersRepository.findOneBy({ name: username });
  }

  async add(userData: any): Promise<any> {
    userData.password = await hash(userData.password)
    const newUser = this.usersRepository.create(userData) 
    console.log("newUser:", newUser)
    return this.usersRepository.save(newUser) 
  }
}