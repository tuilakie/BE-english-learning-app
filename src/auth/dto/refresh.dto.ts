import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty } from 'class-validator';

export class RefreshDto {
  @ApiProperty({ description: 'Refresh token to get new access token' })
  @IsNotEmpty()
  @IsJWT()
  refreshToken: string;
}
