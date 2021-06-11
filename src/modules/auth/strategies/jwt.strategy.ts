import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenService } from '../token/token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private tokenService: TokenService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('jwt_secret'),
      ignoreExpiration: false,
      signOptions: { expiresIn: configService.get<string>('jwt_expire') }
    });
  }

  async validate(payload) {
    const result = await this.tokenService.validatePayload(payload);
    if (!result) {
      throw new UnauthorizedException();
    }
    return result;
  }
}