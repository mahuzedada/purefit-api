import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenAIService } from './openai.service';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import 'dotenv/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, OpenAIService, EmailService],
})
export class AppModule {}
