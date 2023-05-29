import { Module } from '@nestjs/common';
import { WordService } from './word.service';
import { WordController } from './word.controller';
import { LevelModule } from '@/level/level.module';
import { CourseModule } from '@/course/course.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [WordController],
  providers: [WordService, JwtService],
  imports: [PrismaModule, CourseModule, LevelModule],
})
export class WordModule {}
