import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import dayjs, { OpUnitType } from 'dayjs';
import { Model, Types } from 'mongoose';
import { Token, TokenDocument } from '../../schemas/token.schema';
import { randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { SysResponseMsg } from 'src/shared/sys-response-msg';
@Injectable()
export class TokenService {
  // TODO: redis cache
  private readonly usersExpired: number[] = [];
  private refreshTokenExpiresIn: string;
  private accessTokenExpiresIn: string;

  constructor(
    @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
    private readonly jwtService: JwtService,
    private configService: ConfigService
  ) {
    this.refreshTokenExpiresIn = this.configService.get<string>('jwt_expire');
    this.accessTokenExpiresIn = this.configService.get<string>('refresh_expire');
  }

  async findOne(query): Promise<TokenDocument> {
    const res = await this.tokenModel.findOne(query);
    return res || null;
  }

  async getAccessTokenFromRefreshToken(refreshToken: string, oldAccessToken: string, ipAddress: string) {
    try {
      const token = await this.findOne({ value: refreshToken });
      if (!token) {
        throw new HttpException('Refresh token not found', 404);
      }
      if (token.expiresAt < new Date()) {
        throw new Error('Refresh token expired');
      }
      const oldPayload = await this.validateToken(oldAccessToken, true);
      const payload = {
        sub: oldPayload.sub,
      };
      const accessToken = await this.createAccessToken(payload);
      await this.tokenModel.findOneAndDelete(token.id).exec();

      accessToken['refreshToken'] = await this.createRefreshToken({
        userId: oldPayload.sub,
        ipAddress,
      });

      return accessToken;
    } catch (error) {
      throw error;
    }
  }
  async createAccessToken(payload: any, expires = this.accessTokenExpiresIn) {
    const signedPayload = this.jwtService.sign(payload, { expiresIn: expires });
    const token = {
      accessToken: signedPayload,
      expiresIn: expires
    };
    return token;
  }
  async createRefreshToken(tokenContent: { userId: string; ipAddress: string; }): Promise<String> {
    const { userId, ipAddress } = tokenContent;
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
    return this.usersExpired[id] && expire < this.usersExpired[id];
  }
  private async revokeTokenForUser(userId: string): Promise<any> {
    const parseExpire = this.parseExpireIns(this.accessTokenExpiresIn);
    this.usersExpired[userId] = dayjs().add(parseExpire.expireInsNum, parseExpire.expireInsUnit as OpUnitType).unix();
  }

  parseExpireIns(expireIns: string) {
    return {
      expireInsNum: Number(expireIns[0]),
      expireInsUnit: String(expireIns[1])
    }
  }
}

export interface JwtPayload {
  sub: string;
  iat?: number;
  exp?: number;
  jti?: string;
}