import { Word } from '@prisma/client';
import { QuestionEntity } from './question.entity';

export class CaseStudiesEntity {
  words: Word[];
  questions?: QuestionEntity[];
  meta: {
    total: number;
    skip: number;
    take: number;
  };
}
