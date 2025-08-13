import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { JwtService } from '@nestjs/jwt';

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
  
  async register(userData: UserData): Promise<any> {
    const newUser = await this.usersService.add(userData)
    const { password, ...result } = newUser;
    const payload = { sub: result.id, username: result.name };
    const token = await this.jwtService.signAsync(payload)
    return token;
  }

  async signIn(username: string, inputedPassword: string): Promise<any> {
    const user = await this.usersService.findOneByName(username);
    if (user?.password !== inputedPassword) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    return result; // TODO: Generate a JWT and return it here instead of the user object
  }
}