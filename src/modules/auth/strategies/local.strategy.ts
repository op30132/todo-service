import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from "../auth.service";
import { Strategy } from "passport-local";
import { SysResponseMsg } from "src/shared/sys-response-msg";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const res = await this.authService.validateUser(email, password);
    if (res.isValid) return res.user;
    if (res.isGoogle) throw new UnauthorizedException('login with google');
    throw new UnauthorizedException();
  }
}