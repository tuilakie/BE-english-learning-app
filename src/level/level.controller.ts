import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { LevelService } from './level.service';
import { AuthGuard } from '@/auth/auth.guard';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { GetUser } from '@/auth/user.decorator';
import { User } from '@prisma/client';

@ApiTags('level')
@ApiBearerAuth()
@Controller('course/:courseId/level')
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @UseGuards(AuthGuard)
  @Get()
  @ApiParam({ name: 'courseId', type: 'number' })
  findAll(@Param('courseId') courseId: number, @GetUser() user: User) {
    return this.levelService.findAll(courseId, user);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiParam({ name: 'courseId', type: 'number' })
  @ApiParam({ name: 'id', type: 'number' })
  findOne(@Param('id') id: number, @GetUser() user: User) {
    return this.levelService.findOne(id, user);
  }
}
