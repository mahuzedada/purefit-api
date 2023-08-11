import { Controller, Post, Body, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { OpenAIService } from './openai.service';
import { CreateMealPlanDTO, DietPlanDTO } from './dto';
import { EmailService } from './email.service';
import { PlanService } from './plan.service';

@Controller('ask')
export class AppController {
  constructor(
    private readonly openaiService: OpenAIService,
    private readonly emailService: EmailService,
    private readonly appService: AppService,
    private readonly planService: PlanService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post()
  async generateDietPlan(@Body() data: DietPlanDTO): Promise<string> {
    return this.openaiService.generateDietPlan(data);
  }
  @Post('/plan')
  async plan(@Body() data: CreateMealPlanDTO): Promise<string> {
    return this.planService.generateDietPlan(data);
  }
  @Post('/email')
  async sendEmail(@Body() body: any): Promise<void> {
    return this.emailService.sendEmail(
      'chatis@afrointelligence.com',
      'PureFIT Recipes',
      body.email,
    );
  }
}
