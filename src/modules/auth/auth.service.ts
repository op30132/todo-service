import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { SysResponseMsg } from 'src/shared/sys-response-msg';
import { UserDocument } from '../user/schemas/user.schema';

export enum Provider {
  GOOGLE = 'google',
}
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  async validateUser(email: string, pass: string) {
    const res = await this.userService.findOne({ email });

    if (res && bcrypt.compare(pass, res.password)) {
      return res;
    }
    return null;
  }

  async login(user: UserDocument) {
    return {
      token: this.jwtService.sign({ id: user._id })
    };
  }
  async signInWithGoogle(data) {
    if (!data.user) throw new BadRequestException();
    let user = await this.userService.findOne({ googleId: data.user.googleId });
    if (user) return this.login(user);

    const newUser = {
      username: data.user.username,
      email: data.user.email,
      googleId: data.user.googleId
    }
    const insertedUser = await this.userService.create(newUser);
    return this.login(insertedUser);
  }
}
