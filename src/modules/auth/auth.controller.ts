import { Body, Controller, Post, Get, UseGuards, Req, Delete } from '@nestjs/common';

import { LoginDTO, RegisterDTO } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/auth.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/decorators/user.decorator';
import { UserDocument } from '../user/schemas/user.schema';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User() user: UserDocument) {
    return this.authService.login(user);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleAuth() { }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req) {
    return this.authService.signInWithGoogle(req);
  }

  // @Post('refresh-token')
  // @UseGuards(AuthGuard('google'))
  // async refreshToken(@Body() body, @Res() res): Promise<any> {
  //   const loginResult = await this.authService.refreshToken(body.token);
  //   this.setAccessTokenCookie(res, loginResult.accessToken);
  //   return loginResult;
  // }
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
  async logout(): Promise<any> {
  }

}