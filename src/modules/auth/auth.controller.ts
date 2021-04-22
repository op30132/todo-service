import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';

import { LoginDTO, RegisterDTO } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }

  @Post('login')
  async login(@Body() userDTO: LoginDTO) {
    return this.authService.login(userDTO);
  }

  @Post('register')
  async register(@Body() userDTO: RegisterDTO) {
    const res = await this.userService.create(userDTO);
    const { password, ...rest } = res;
    return rest;
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<any[]> {
    return await this.userService.findAll();
  }
}