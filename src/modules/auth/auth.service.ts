import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { sign } from 'jsonwebtoken';
import { LoginDTO } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService
  ) { }

  async validateUser(account: string, pass: string) {
    const res = await this.userService.findOne({ account });

    if (res && bcrypt.compare(pass, res.password)) {
      return { _id: res._id };
    }
    return null;
  }

  async login(userDTO: LoginDTO) {
    const res = await this.validateUser(userDTO.account, userDTO.password);
    return {
      token: this.jwtService.sign(res)
    };
  }

}
