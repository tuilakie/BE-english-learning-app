import { Word } from '@prisma/client';

export class QuestionEntity {
  word: Word;
  options: Word[] | string[];
  _type: 'fill' | 'select_word' | 'select_meaning';
}
