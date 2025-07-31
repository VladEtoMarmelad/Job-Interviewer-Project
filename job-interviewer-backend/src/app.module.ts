import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Interview } from './interview/interview.entity';
import { Question } from './questions/question.entity';
import { InterviewsModule } from './interview/interviews.module';
import { QuestionsModule } from './questions/questions.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "5432", 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Interview, Question],
      synchronize: true,
    }),
    InterviewsModule,
    QuestionsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
