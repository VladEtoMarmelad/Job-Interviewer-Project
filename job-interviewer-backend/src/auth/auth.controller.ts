import { Body, Controller, Post, HttpCode, HttpStatus, Req, Res, Get, Delete } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  async register(@Body() userData: any, @Res({ passthrough: true }) res: Response) {
    const jwt: string = await this.authService.register(userData)
    res.status(200).cookie("jwt", jwt, {
      httpOnly: true, 
      secure: false, 
      path: "/",
      maxAge: 3600000000000000,
    });
    return jwt;
  }

  @HttpCode(HttpStatus.OK)
  @Post("signin")
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Get("findJWTCookie")
  findJWTCookie(@Req() req: Request) {
    console.log(req.cookies.jwt)
    return req.cookies.jwt
  }

  @Delete("deleteJWTCookie")
  deleteJWTCookie(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    res.status(200).clearCookie("jwt", {
      httpOnly: true, 
      secure: false, 
      path: "/"
    });
  }
}