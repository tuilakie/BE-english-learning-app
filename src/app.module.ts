import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { LevelModule } from './level/level.module';

@Module({
  imports: [PrismaModule, AuthModule, CourseModule, LevelModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
