import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class UpdateLearnedDto {
  @ApiProperty({ type: [Number], description: 'Word Id' })
  @IsArray()
  wordId: number[];
}
