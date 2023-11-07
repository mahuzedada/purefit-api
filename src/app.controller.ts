import { Controller, Post, Body, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { OpenAIService } from './openai.service';
import {
  CandidateAndJobInfoDto,
  CreateMealPlanDTO,
  DietPlanDTO,
  GenerateDocsDTO,
} from './dto';
import { EmailService } from './email.service';
import { PlanService } from './plan.service';
import { DocsService } from './docs.service';

@Controller('ask')
export class AppController {
  constructor(
    private readonly openaiService: OpenAIService,
    private readonly emailService: EmailService,
    private readonly appService: AppService,
    private readonly planService: PlanService,
    private readonly docsService: DocsService,
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
  @Post('/docs')
  async generateDocs(@Body() data: GenerateDocsDTO): Promise<string> {
    return this.docsService.generateDocs(data);
  }
  @Post('/cover-letter')
  async generateCoverLetter(@Body() data: any): Promise<string> {
    return this.docsService.generateCoverLetter(data);
  }
  @Post('/skill-gap-analysis')
  async generateSkillGap(
    @Body() data: CandidateAndJobInfoDto,
  ): Promise<string> {
    return this.docsService.generateSkillGap(data);
  }
}
