import { Body, Controller, Post, Get, UseGuards, Req, Delete, Res, UseFilters, Ip, UnauthorizedException, Query, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from './dto/auth.dto';
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
import { ExtractJwt } from 'passport-jwt';

@Controller('api/auth')
@UseFilters(GlobalExceptionFilter)
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private tokenService: TokenService
  ) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User() user: UserDocument, @Ip() userIp: string) {
    const res = this.authService.login(user, userIp);
    return res;
  }

  @Get('access_token')
  async token(@Req() req: Request, @Ip() userIp, @Query('refresh_token') refreshToken?: string) {
    try {
      const oldAccessToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      return await this.tokenService.getAccessTokenFromRefreshToken(refreshToken, oldAccessToken, userIp);
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
    const loginResult = await this.authService.signInWithGoogle(user, userIp);
    res.redirect("http://localhost:3000/login?token=" + loginResult.accessToken);
  }

  @Public()
  @Post('register')
  async register(@Body() userDTO: RegisterDTO) {
    const res = await this.userService.create(userDTO);
    delete res.password;
    return res;
  }

  @Get('users')
  async findAll(): Promise<any[]> {
    return await this.userService.findAll();
  }

  @Delete('logout')
  async logout(@User() user: UserDocument, @Query('refresh_token') refreshToken?: string, @Query('from_all') fromAll: boolean = false): Promise<any> {
    if (fromAll) {
      await this.authService.logoutFromAll(user.id);
    } else {
      if (!refreshToken) {
        throw new BadRequestException('No refresh token provided');
      }
      await this.authService.logout(user.id, refreshToken);
    }
    return { message: 'ok' };
  }

}