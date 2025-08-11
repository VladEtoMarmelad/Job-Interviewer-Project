import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/users.service';

interface UserData {
  id: number;
  name: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(userData: UserData): Promise<any> {
    const newUser = await this.usersService.add(userData)
    const { password, ...result } = newUser;
    return result; // TODO: Generate a JWT and return it here instead of the user object
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