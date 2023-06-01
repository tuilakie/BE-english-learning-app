import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/auth/auth.guard';
import { GetUser } from '@/auth/user.decorator';

@ApiTags('course')
@ApiBearerAuth()
@Controller('api/course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  // @Post()
  // create(@Body() createCourseDto: CreateCourseDto) {
  //   return this.courseService.create(createCourseDto);
  // }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@GetUser() user: any) {
    return this.courseService.findAll(user);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: any) {
    return this.courseService.findOne(+id, user);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
  //   return this.courseService.update(+id, updateCourseDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.courseService.remove(+id);
  // }
}
