import { Word } from '@prisma/client';

export class SelectQuestionEntity {
  word: Word;
  options: Word[];
  _type = 'select';
}

export class FillQuestionEntity {
  word: Word;
  _type = 'fill';
}
