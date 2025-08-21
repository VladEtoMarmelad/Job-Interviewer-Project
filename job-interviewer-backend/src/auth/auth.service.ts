import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';

interface UserData {
  id: number;
  name: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, 
    private readonly jwtService: JwtService
  ) {}
  
  async register(userData: UserData): Promise<string> {
    const newUser = await this.usersService.add(userData)
    const { password, ...result } = newUser;
    const payload = { sub: result.id, name: result.name, colorTheme: "system" };
    const token = await this.jwtService.signAsync(payload)
    return token;
  }

  async signIn(username: string, inputedPassword: string): Promise<string|undefined> {
    try {
      const user = await this.usersService.findOneByName(username);
      console.log("got this user:", JSON.stringify(user, null, 4))
      if (await verify(user.password, inputedPassword)) {
        const { password, ...result } = user;
        const payload = { sub: result.id, name: result.name, colorTheme: "system" };
        const token = await this.jwtService.signAsync(payload);
        return token;
      } else {
        throw new UnauthorizedException(); 
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  }
}