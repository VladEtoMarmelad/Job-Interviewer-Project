import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: `http://${process.env.HOST ?? "localhost"}:8081`,
    credentials: true
  });
  await app.listen(process.env.PORT ?? 3000, process.env.HOST ?? "localhost");
}
bootstrap();
