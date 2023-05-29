import { PrismaService } from '@/prisma/prisma.service';
import { shuffle } from '@/ultils/shuffle';
import { HttpException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { skip } from 'rxjs';
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

    let _take = pagination.take;
    if (pagination.skip + pagination.take > total) {
      _take = total - pagination.skip;
    }

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

    const wordCase = words.map((word) => {
      return {
        word,
        _type: 'word',
      };
    });

    const fillQuestion = words.map((word) => {
      return {
        word,
        _type: 'fill',
      };
    });

    const selectQuestion = await Promise.all(
      words.map(async (word) => {
        const options = await this.prisma.word.findMany({
          where: {
            courseId,
            levelId,
            id: {
              not: word.id,
            },
          },
          take: 3,
        });
        return {
          word,
          options: shuffle([...options, word]),
          _type: 'select',
        };
      }),
    );

    const caseStudies = [
      ...wordCase.slice(0, _take / 2),
      ...shuffle(fillQuestion.slice(0, _take / 2)),
      ...shuffle(selectQuestion.slice(0, _take / 2)),
      ...wordCase.slice(_take / 2, _take),
      ...shuffle(fillQuestion.slice(_take / 2, _take)),
      ...shuffle(selectQuestion.slice(_take / 2, _take)),
    ];

    return {
      caseStudies,
      meta: {
        total,
        skip: pagination.skip,
        take: _take,
      },
    };
  }

  async getQuestion(courseId: number) {
    const word = await this.prisma.word.findFirst({
      where: {
        courseId,
      },
    });
    const rand = Math.random();
    if (rand > 0.35) {
      const options = await this.prisma.word.findMany({
        where: {
          courseId,
          id: {
            not: word.id,
          },
        },
        take: 3,
      });
      return {
        word,
        options: shuffle([...options, word]),
        _type: 'select',
      };
    }
    return {
      word,
      _type: 'fill',
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
}
