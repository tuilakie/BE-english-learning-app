import { AuthGuard } from '@/auth/auth.guard';
import { PrismaService } from '@/prisma/prisma.service';
import { HttpException, Injectable, UseGuards } from '@nestjs/common';
import { User, Word } from '@prisma/client';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}
  // create(createCourseDto: CreateCourseDto) {
  //   return 'This action adds a new course';
  // }

  async findAll(user: User) {
    const courses = await this.prisma.course.findMany({
      include: {
        _count: {
          select: {
            words: true,
          },
        },
      },
    });
    const learnedWord = await Promise.all(
      courses.map(async (course) => {
        const learnedWord = await this.prisma.word.count({
          where: {
            AND: [
              {
                course: {
                  id: course.id,
                },
              },
              {
                learned: {
                  some: {
                    id: user.id,
                  },
                },
              },
            ],
          },
        });
        return {
          ...course,
          _count: {
            ...course._count,
            progress: learnedWord,
          },
        };
      }),
    );

    return learnedWord;
  }

  async findOne(id: number, user: User) {
    const course = await this.prisma.course
      .findUniqueOrThrow({
        where: { id },
        include: {
          _count: {
            select: {
              words: true,
            },
          },
        },
      })
      .catch((e) => {
        if (e.code === 'P2025') {
          throw new HttpException(e.message, 404);
        }
      });

    console.log(course);

    const words = await this.prisma.word.count({
      where: {
        AND: [
          {
            courseId: id,
          },
          {
            learned: {
              some: {
                id: user.id,
              },
            },
          },
        ],
      },
    });

    return {
      ...course,
      _count: {
        ...(course as any)._count,
        progress: words,
      },
    };
  }

  // update(id: number, updateCourseDto: UpdateCourseDto) {
  //   return `This action updates a #${id} course`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} course`;
  // }
}
