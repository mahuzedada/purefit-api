import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenAIService } from './openai.service';
import { ConfigModule } from '@nestjs/config';
import { EmailService } from './email.service';
import 'dotenv/config';
import { PlanService } from './plan.service';
import { DocsService } from './docs.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [
    AppService,
    OpenAIService,
    EmailService,
    PlanService,
    DocsService,
  ],
})
export class AppModule {}
