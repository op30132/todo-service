import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { SysResponseMsg } from 'src/shared/sys-response-msg';
import { UserDocument } from '../user/schemas/user.schema';
import { JwtPayload, TokenService } from './token/token/token.service';

export enum Provider {
  GOOGLE = 'google',
}
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
    private tokenService: TokenService
  ) { }

  async validateUser(email: string, pass: string) {
    const res = await this.userService.findOne({ email });

    if (res && bcrypt.compare(pass, res.password)) {
      return res;
    }
    return null;
  }

  async login(user: UserDocument, ipAddress: string) {
    const payload: JwtPayload = {
      sub: user._id,
    };

    const loginResponse = await this.tokenService.createAccessToken(payload);
    const tokenContent = {
      userId: user._id,
      ipAddress,
    };
    const refresh = await this.tokenService.createRefreshToken(tokenContent);

    loginResponse['refreshToken'] = refresh;

    return loginResponse;
  }
  async signInWithGoogle(user: UserDocument, ipAddress: string) {
    if (!user) throw new BadRequestException();
    let res = await this.userService.findOne({ googleId: user.googleId });
    if (res) return this.login(res, ipAddress);

    const newUser = {
      username: user.username,
      email: user.email,
      googleId: user.googleId
    }
    const insertedUser = await this.userService.create(newUser);
    return this.login(insertedUser, ipAddress);
  }

  async logout(userId: string, refreshToken: string): Promise<any> {
    await this.tokenService.deleteRefreshToken(userId, refreshToken);
  }
  async logoutFromAll(userId: string): Promise<any> {
    await this.tokenService.deleteRefreshTokenForUser(userId);
  }
}
