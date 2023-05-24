import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { GetUser } from './user.decorator';
import { User } from '@prisma/client';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { AuthEntity } from './entities/auth.entity';

// api routes for auth module swagger
@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ description: 'Login successful', type: AuthEntity })
  login(@Body() loginDto: LoginDto): Promise<AuthEntity> {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @ApiOkResponse({ description: 'Register successful', type: AuthEntity })
  register(@Body() registerDto: RegisterDto): Promise<AuthEntity> {
    return this.authService.register(registerDto);
  }

  @Post('refresh-token')
  @ApiOkResponse({ description: 'Get new access token', type: AuthEntity })
  getNewAccessToken(
    @Body() refreshToken: { refreshToken: string },
  ): Promise<AuthEntity> {
    return this.authService.getNewAccessToken(refreshToken.refreshToken);
  }

  @Post('logout')
  @ApiOkResponse({ description: 'Logout successful' })
  logout(
    @Body() refreshToken: { refreshToken: string },
  ): Promise<{ message: string }> {
    return this.authService.logout(refreshToken.refreshToken);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOkResponse({ description: 'Get user info' })
  @Get('whoami')
  whoami(@GetUser() user: User) {
    return user;
  }
}
