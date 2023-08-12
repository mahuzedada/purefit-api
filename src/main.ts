import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: 'https://ai.purefit.club' });
  await app.listen(4089);
}
bootstrap();
