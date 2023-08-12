import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // This will enable CORS for all origins by default
  await app.listen(4089);
}
bootstrap();
