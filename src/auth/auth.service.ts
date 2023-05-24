import { HttpException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JWT_SECRET, SALTS_ROUNDS } from 'src/ultils/constants';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entities/auth.entity';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}
  async login(loginDto: LoginDto): Promise<AuthEntity> {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpException('Wrong password', 400);
    }
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    // Update refresh token in database
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthEntity> {
    const { password } = registerDto;
    const user = await this.prisma.user.findUnique({
      where: {
        email: registerDto.email,
      },
    });
    if (user) {
      throw new HttpException('Email already exists', 400);
    }
    const hashedPassword = await bcrypt.hash(password, SALTS_ROUNDS);
    const newUser = await this.prisma.user.create({
      data: {
        ...registerDto,
        password: hashedPassword,
      },
    });
    const accessToken = await this.generateAccessToken(newUser);
    const refreshToken = await this.generateRefreshToken(newUser);

    // Update refresh token in database
    await this.prisma.user.update({
      where: {
        id: newUser.id,
      },
      data: {
        refreshToken,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async generateAccessToken(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: JWT_SECRET,
      expiresIn: '1h',
    });
    return accessToken;
  }

  async generateRefreshToken(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: JWT_SECRET,
      expiresIn: '7d',
    });
    return refreshToken;
  }
  // 💡 We're adding this method to generate a new access token
  // from a refresh token
  async getNewAccessToken(refreshToken: string): Promise<AuthEntity> {
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: JWT_SECRET,
    });
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const accessToken = await this.generateAccessToken(user);
    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(refreshToken: string) {
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: JWT_SECRET,
    });
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.id,
      },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: null,
      },
    });
    return {
      message: 'Logout successfully',
    };
  }
}
