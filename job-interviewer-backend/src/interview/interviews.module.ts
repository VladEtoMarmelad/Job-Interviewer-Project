import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewsService } from './interviews.service';
import { InterviewsController } from './interviews.controller';
import { Interviews } from './interview.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interviews])],
  providers: [InterviewsService],
  controllers: [InterviewsController],
})
export class InterviewsModule {}