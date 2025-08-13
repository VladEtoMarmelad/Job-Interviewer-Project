import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller("user")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("findOneByName")
  findOneByName(@Query("username") username: string) {
    return this.usersService.findOneByName(username)
  }
}
