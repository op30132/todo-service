import { Body, Controller, Post, Get, UseGuards, Req, Delete, Res, UseFilters, Ip, UnauthorizedException, Query, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { RegisterDTO } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/auth.decorator';
import { User } from 'src/decorators/user.decorator';
import { UserDocument } from '../user/schemas/user.schema';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { Response, Request } from 'express';
import { GlobalExceptionFilter } from 'src/filters/global-exception.filter';
import { TokenService } from './token/token.service';
import { ConfigService } from '@nestjs/config';

@Controller('api/auth')
@UseFilters(GlobalExceptionFilter)
export class AuthController {
  REFRESH_TOKEN_KEY = "refreshToken";
  frontEndUrl = "127.0.0.1:3000";
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private tokenService: TokenService,
    private configService: ConfigService
    ) {
      this.frontEndUrl = this.configService.get<string>('front_end_url');
    }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User() user: UserDocument, @Ip() userIp: string, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(user, userIp);
    this.setRefreshTokenCookie(res, result.refreshToken);
    return result.token;
  }
  @Public()
  @Get('token/refresh')
  async token(@Req() req: Request, @Res({ passthrough: true }) res: Response, @Ip() userIp: string) {
    try {
      const refreshToken = req.cookies[this.REFRESH_TOKEN_KEY];
      if(!refreshToken) return new UnauthorizedException('no refreshToken');
      const result = await this.tokenService.getAccessTokenFromRefreshToken(refreshToken, userIp);
     this.setRefreshTokenCookie(res, result.refreshToken);
      return result.token;
    } catch (error) {
      throw new InternalServerErrorException('invalid');
    }
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleAuth() { }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@User() user: UserDocument, @Ip() userIp: string, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.signInWithGoogle(user, userIp);
    this.setRefreshTokenCookie(res, result.refreshToken);
    res.redirect(this.frontEndUrl+'/home');
  }

  @Public()
  @Post('register')
  async register(@Body() userDTO: RegisterDTO) {
    const res = await this.userService.create(userDTO);
    delete res.password;
    return res;
  }

  @Get('userProfile')
  async getUserPtofile(@User() user: UserDocument): Promise<UserDocument> {
    return await this.userService.findById(user.id);
  }

  @Delete('token/logout')
  async logout(@User() user: UserDocument, @Req() req: Request, @Query('from_all') fromAll: boolean = false): Promise<any> {
    if (fromAll) {
      await this.authService.logoutFromAll(user.id);
    } else {
      const refreshToken = req.cookies[this.REFRESH_TOKEN_KEY];
      if (!refreshToken) {
        throw new BadRequestException('No refresh token provided');
      }
      await this.authService.logout(user.id, refreshToken);
    }
    return { message: 'ok' };
  }

  setRefreshTokenCookie(response: Response, value: String){
    const maxAge = this.tokenService.getMaxage();
    response.cookie(this.REFRESH_TOKEN_KEY, value,{ httpOnly: true, path: '/api/auth/token', maxAge});
  }
}