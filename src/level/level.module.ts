import { Module } from '@nestjs/common';
import { LevelService } from './level.service';
import { LevelController } from './level.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { CourseModule } from '@/course/course.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [LevelController],
  providers: [LevelService, JwtService],
  imports: [PrismaModule, CourseModule],
})
export class LevelModule {}
