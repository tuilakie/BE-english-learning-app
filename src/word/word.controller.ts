import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Param,
} from '@nestjs/common';
import { WordService } from './word.service';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/auth/auth.guard';
import { CaseStudiesEntity } from './entities/case-studies.entity';
import { GetUser } from '@/auth/user.decorator';
import {
  FillQuestionEntity,
  SelectQuestionEntity,
} from './entities/question.entity';
import { UpdateLearnedDto } from './dto/update-learned.dto';

@ApiTags('word')
@ApiBearerAuth()
@Controller('api/word')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Get('caseStudies')
  @UseGuards(AuthGuard)
  @ApiResponse({
    status: 200,
    description: 'Get case studies with words and questions successfully',
    type: CaseStudiesEntity,
  })
  @ApiQuery({ name: 'skip', type: 'number', required: false })
  @ApiQuery({ name: 'take', type: 'number', required: false })
  getStudies(
    @Query('courseId') courseId: number,
    @Query('levelId') levelId: number,
    @GetUser() user: any,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ): Promise<CaseStudiesEntity> {
    return this.wordService.getCaseStudies(
      { skip: skip ? skip : 0, take: take ? take : 10 },
      courseId,
      levelId,
      user,
    );
  }

  @Get('quizzes')
  @UseGuards(AuthGuard)
  getQuizzes(
    @Query('courseId') courseId: number,
  ): Promise<SelectQuestionEntity | FillQuestionEntity> {
    return this.wordService.getQuestion(courseId);
  }

  @Post('learned')
  @UseGuards(AuthGuard)
  learned(@Body() updateLearnedDto: UpdateLearnedDto, @GetUser() user: any) {
    return this.wordService.learned(updateLearnedDto, user);
  }

  @Post('reset-learned/:levelId')
  @UseGuards(AuthGuard)
  resetLearned(@GetUser() user: any, @Param('levelId') levelId: number) {
    return this.wordService.resetLearned(levelId, user);
  }
}
