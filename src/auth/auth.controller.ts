import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService 
  ) { }
  
  @Post('login')
  async signIn(@Body() signInDto: AuthDto, @Res({ passthrough: true }) res: Response) {
    const token = await this.authService.signIn(signInDto.name, signInDto.password)
    if (token) {
      res.cookie('token', token, { httpOnly: true })
    }
  }
}
