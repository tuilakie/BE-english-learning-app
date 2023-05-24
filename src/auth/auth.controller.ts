import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { get } from 'http';
import { GetUser } from './user.decorator';
import { User } from '@prisma/client';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('refresh-token')
  session(@Body() refreshToken: { refreshToken: string }) {
    return this.authService.getNewAccessToken(refreshToken.refreshToken);
  }

  @Post('logout')
  logout(@Body() refreshToken: { refreshToken: string }) {
    return this.authService.logout(refreshToken.refreshToken);
  }

  @Get('whoami')
  whoami(@GetUser() user: User) {
    return user;
  }
}
