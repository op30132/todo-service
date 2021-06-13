import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { UserDocument } from '../user/schemas/user.schema';
import { JwtPayload, TokenService } from './token/token.service';

export enum Provider {
  GOOGLE = 'google',
}
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService
  ) { }

  async validateUser(email: string, pass: string) {
    const res = await this.userService.findOne({ email });
    if (res && res.googleId) {
      return {isGoogle: true, isValid: false};
    }
    if (res && await bcrypt.compare(pass, res.password)) {
      return {isGoogle: false, isValid: true, user: res};
    }
    return {isGoogle: false, isValid: false};
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
    return {refreshToken: refresh, token: loginResponse};
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
