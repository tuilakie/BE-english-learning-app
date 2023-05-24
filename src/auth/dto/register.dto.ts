import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @ApiProperty({ type: String, description: 'Email' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'Username' })
  name: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, description: 'Password' })
  password: string;
}
