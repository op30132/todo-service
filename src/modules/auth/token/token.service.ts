import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import dayjs, { OpUnitType } from 'dayjs';
import { Model, Types } from 'mongoose';
import { Token, TokenDocument } from '../schemas/token.schema';
import { randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { SysResponseMsg } from 'src/shared/sys-response-msg';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class TokenService {
  // TODO: redis cache
  private readonly usersExpiredList: number[] = [];
  private refreshTokenExpiresIn: string;
  private accessTokenExpiresIn: string;

  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    private readonly jwtService: JwtService,
    private configService: ConfigService
  ) {
    this.accessTokenExpiresIn = this.configService.get<string>('jwt_expire');
    this.refreshTokenExpiresIn = this.configService.get<string>('refresh_expire');
  }

  async findOne(query): Promise<TokenDocument> {
    const res = await this.tokenModel.findOne(query);
    return res || null;
  }
  async getAccessTokenFromRefreshToken(refreshToken: string, userIp: string) {
    try {
      const token = await this.findOne({ value: refreshToken });
      if (!token) {
        throw new BadRequestException('Refresh token not found');
      }
      if (token.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh token expired');
      }
      // const oldPayload = await this.validateToken(oldAccessToken, true);
      const payload: JwtPayload = {
        sub: token.userId.toString()
      };
      const accessToken = await this.createAccessToken(payload);
      await this.tokenModel.findOneAndDelete(token.id).exec();
      const refresh = await this.createRefreshToken(payload.sub, userIp);
      return {token: accessToken, refreshToken: refresh};
    } catch (error) {
      throw error;
    }
  }
  async createAccessToken(payload: any, expires = this.accessTokenExpiresIn) {
    const signedPayload = this.jwtService.sign(payload, { expiresIn: expires });
    const token = {
      accessToken: signedPayload,
    };
    return token;
  }
  async createRefreshToken(userId: string, ipAddress: string): Promise<String> {
    const refreshToken = randomBytes(64).toString('hex');
    const parseExpire = this.parseExpireIns(this.refreshTokenExpiresIn);
    const createRefreshToken = await this.tokenModel.create({
      userId: Types.ObjectId(userId),
      value: refreshToken,
      ipAddress,
      expiresAt: dayjs().add(parseExpire.expireInsNum, parseExpire.expireInsUnit as OpUnitType)
    });
    createRefreshToken.save();
    return refreshToken;
  }

  async deleteRefreshTokenForUser(userId: string) {
    const res = await this.tokenModel.deleteMany({ userId: Types.ObjectId(userId) });
    if (res.n !== res.deletedCount) {
      return new SysResponseMsg(200, 'not all token are deleted')
    }
    await this.revokeTokenForUser(userId);
  }
  async deleteRefreshToken(userId: string, value: string) {
    await this.tokenModel.findOneAndRemove({ value });
    await this.revokeTokenForUser(userId);
  }

  async decodeAndValidateJWT(token: string): Promise<any> {
    if (token) {
      try {
        const payload = await this.validateToken(token);
        return await this.validatePayload(payload);
      } catch (error) {
        return null;
      }
    }
  }

  async validatePayload(payload: JwtPayload): Promise<any> {
    const tokenBlacklisted = await this.isBlackListed(payload.sub, payload.exp);
    if (!tokenBlacklisted) {
      return { id: payload.sub };
    }
    return null;
  }

  private async validateToken(token: string, ignoreExpiration: boolean = false): Promise<JwtPayload> {
    return this.jwtService.verify(token, { ignoreExpiration });
  }

  private async isBlackListed(id: string, expire: number): Promise<boolean> {
    return this.usersExpiredList[id] && expire < this.usersExpiredList[id];
  }
  private async revokeTokenForUser(userId: string): Promise<any> {
    const parseExpire = this.parseExpireIns(this.accessTokenExpiresIn);
    this.usersExpiredList[userId] = dayjs().add(parseExpire.expireInsNum, parseExpire.expireInsUnit as OpUnitType).unix();
  }
  parseExpireIns(expireIns: string) {
    const num = expireIns.match(/\d+/g);
    const letter =  expireIns.match(/[a-zA-Z]+/g);
    return {
      expireInsNum: Number(num),
      expireInsUnit: String(letter)
    }
  } 
  getMaxage(): number {
    const {expireInsNum, expireInsUnit} = this.parseExpireIns(this.refreshTokenExpiresIn);
    switch (expireInsUnit.toLocaleLowerCase()) {
      case 'd':
        return expireInsNum * 60 * 60 * 24 * 1000;
      case 'h':
        return expireInsNum * 60 * 60 * 1000;
      case 'm':
        return expireInsNum * 60 * 1000;
      case 's':
        return expireInsNum * 1000;
    }
  }
}

export interface JwtPayload {
  sub: string;
  iat?: number;
  exp?: number;
  jti?: string;
}