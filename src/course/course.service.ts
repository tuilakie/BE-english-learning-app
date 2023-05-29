import { AuthGuard } from '@/auth/auth.guard';
import { PrismaService } from '@/prisma/prisma.service';
import { HttpException, Injectable, UseGuards } from '@nestjs/common';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}
  // create(createCourseDto: CreateCourseDto) {
  //   return 'This action adds a new course';
  // }

  @UseGuards(AuthGuard)
  findAll() {
    return this.prisma.course.findMany();
  }

  @UseGuards(AuthGuard)
  findOne(id: number) {
    return this.prisma.course
      .findUniqueOrThrow({ where: { id } })
      .catch((e) => {
        if (e.code === 'P2025') {
          throw new HttpException(e.message, 404);
        }
      });
  }

  // update(id: number, updateCourseDto: UpdateCourseDto) {
  //   return `This action updates a #${id} course`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} course`;
  // }
}
