import { Controller, Post, Body, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { OpenAIService } from './openai.service';
import { DietPlanDTO } from './dto';

@Controller('ask')
export class AppController {
  constructor(
    private readonly openaiService: OpenAIService,
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post()
  async generateDietPlan(@Body() data: DietPlanDTO): Promise<string> {
    return this.openaiService.generateDietPlan(data);
  }
}
