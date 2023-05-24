import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [CourseController],
  providers: [CourseService, JwtService],
  imports: [PrismaModule],
  exports: [CourseService],
})
export class CourseModule {}
