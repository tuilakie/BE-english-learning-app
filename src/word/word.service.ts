import { PrismaService } from '@/prisma/prisma.service';
import { shuffle } from '@/ultils/shuffle';
import { HttpException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CaseStudiesEntity } from './entities/case-studies.entity';
import { UpdateLearnedDto } from './dto/update-learned.dto';

@Injectable()
export class WordService {
  constructor(private readonly prisma: PrismaService) {}
  async getCaseStudies(
    pagination: {
      skip: number;
      take: number;
    },
    courseId: number,
    levelId: number,
    user: User,
  ): Promise<CaseStudiesEntity> {
    if (!levelId || !courseId) {
      throw new HttpException('Missing levelId or courseId', 400);
    }

    const total = await this.prisma.word.count({
      where: {
        levelId,
        courseId,
      },
    });

    if (pagination.skip >= total) {
      throw new HttpException(
        'The requested offset is beyond the available range',
        400,
      );
    }

    const wordCount = await this.prisma.word.count();

    const words = await this.prisma.word.findMany({
      ...pagination,
      where: {
        levelId,
        courseId,
        learned: {
          none: {
            id: user.id,
          },
        },
      },
    });

    const fillQuestion = words.map((word) => {
      return {
        word,
        options: shuffle(word.word.split('')),
        _type: 'fill' as const,
      };
    });

    const selectQuestion = await Promise.all(
      words.map(async (word) => {
        const randIndex = Math.floor(Math.random() * wordCount);

        const options = await this.prisma.word.findMany({
          where: {
            id: {
              not: word.id,
            },
          },
          take: 3,
          skip: randIndex,
        });
        return [
          {
            word,
            options: shuffle([...options, word]),
            _type: 'select_word' as const,
          },
          {
            word,
            options: shuffle([...options, word]),
            _type: 'select_meaning' as const,
          },
        ];
      }),
    );

    return {
      words,
      questions: shuffle([...fillQuestion, ...selectQuestion.flat()]),
      meta: {
        total,
        skip: pagination.skip,
        take: words.length,
      },
    };
  }

  async getQuestion(courseId: number) {
    const wordCount = await this.prisma.word.count();

    const word = await this.prisma.word.findFirst({
      where: {
        courseId,
      },
      skip: Math.floor(Math.random() * wordCount),
    });
    const randIndex = Math.floor(Math.random() * wordCount);

    const rand = Math.random();
    if (rand < 0.8) {
      const options = await this.prisma.word.findMany({
        where: {
          courseId,
          id: {
            not: word.id,
          },
        },
        skip: randIndex,
        take: 3,
      });

      const _type =
        Math.random() > 0.4
          ? ('select_word' as const)
          : ('select_meaning' as const);

      return {
        word,
        options: shuffle([...options, word]),
        _type,
      };
    }
    return {
      word,
      options: shuffle(word.word.split('')),
      _type: 'fill' as const,
    };
  }

  async learned({ wordId }: UpdateLearnedDto, user: User) {
    const words = await this.prisma.word.findMany({
      where: {
        id: {
          in: wordId,
        },
      },
    });

    const learned = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        words: {
          connect: words.map((word) => {
            return {
              id: word.id,
            };
          }),
        },
      },
      select: {
        _count: {
          select: {
            words: true,
          },
        },
      },
    });
    return learned;
  }

  async resetLearned(levelId: number, user: User) {
    const words = await this.prisma.word.findMany({
      where: {
        levelId,
      },
    });

    const learned = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        words: {
          disconnect: words.map((word) => {
            return {
              id: word.id,
            };
          }),
        },
      },
      select: {
        _count: {
          select: {
            words: true,
          },
        },
      },
    });
    return learned;
  }
}
