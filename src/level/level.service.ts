import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { async } from 'rxjs';

@Injectable()
export class LevelService {
  constructor(private prisma: PrismaService) {}

  async findAll(courserId: number, user: User) {
    const levels = await this.prisma.level.findMany({
      where: {
        courseId: courserId,
      },
      include: {
        _count: {
          select: {
            words: true,
          },
        },
      },
    });

    return Promise.all(
      levels.map(async (level) => {
        const learned = await this.prisma.word.count({
          where: {
            learned: {
              some: {
                id: user.id,
              },
            },
            level: {
              id: level.id,
            },
          },
        });
        return {
          ...level,
          _count: {
            ...level._count,
            learned,
          },
        };
      }),
    );
  }

  async findOne(id: number, user: User) {
    const levels = await this.prisma.level.findUnique({
      where: {
        id,
      },
      include: {
        words: true,
        _count: {
          select: {
            words: true,
          },
        },
      },
    });

    const learnedWords = await this.prisma.word.findMany({
      where: {
        learned: {
          some: {
            id: user.id,
          },
        },
        level: {
          id,
        },
      },
      include: {
        level: true,
        _count: {
          select: {
            learned: true,
          },
        },
      },
    });

    return {
      ...levels,
      words: levels.words.map((word) => {
        const learned = learnedWords.find(
          (learnedWord) => learnedWord.id === word.id,
        );
        return {
          ...word,
          learned: !!learned,
        };
      }),
    };
  }
}
