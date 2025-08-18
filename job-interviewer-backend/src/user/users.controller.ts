import { Body, Controller, Delete, Get, Patch, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';

@Controller("user")
export class UsersController {
  constructor(
    private readonly usersService: UsersService, 
    private readonly jwtService: JwtService
  ) {}

  @Get("findOneByName")
  findOneByName(@Query("username") username: string) {
    return this.usersService.findOneByName(username)
  }

  @Patch("patch")
  async patch(@Body() userData: any, @Res({ passthrough: true }) res: Response) {
    //updating user in DB
    this.usersService.patch(userData)

    //updating user's JWT
    const payload = {sub: userData.id, name: userData.name} 
    const jwt = await this.jwtService.signAsync(payload)
    res.status(200).cookie("jwt", jwt, {
      httpOnly: true, 
      secure: false, 
      path: "/",
      maxAge: 3600000000000000,
    });
    return jwt;
  }

  @Delete("delete")
  delete(@Query("id") id: number) {
    return this.usersService.delete(id)
  }
}
