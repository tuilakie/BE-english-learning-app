import { Word } from '@prisma/client';
import { FillQuestionEntity, SelectQuestionEntity } from './question.entity';

export class WordEntity {
  word: Word;
  _type = 'word';
}

export class CaseStudiesEntity {
  caseStudies: (WordEntity | SelectQuestionEntity | FillQuestionEntity)[];
  meta: {
    total: number;
    skip: number;
    take: number;
  };
}
