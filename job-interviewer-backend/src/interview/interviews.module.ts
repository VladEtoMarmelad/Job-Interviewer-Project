import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InterviewsService } from './interviews.service';
import { InterviewsController } from './interviews.controller';
import { Interview } from './interview.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interview])],
  providers: [InterviewsService],
  controllers: [InterviewsController],
})
export class InterviewsModule {}