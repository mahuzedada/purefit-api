import { Injectable } from '@nestjs/common';
import { CreateMealPlanDTO } from './dto';
import { Configuration, OpenAIApi } from 'openai';
import { Logger } from '@nestjs/common';
import { EmailService } from './email.service';
import env from './env';

const configuration = new Configuration({
  apiKey: env.openAiKey,
});

const openai = new OpenAIApi(configuration);

@Injectable()
export class PlanService {
  constructor(private email: EmailService) {}

  async generateDietPlan(data: CreateMealPlanDTO): Promise<any> {
    Logger.log('Started Requests');
    const prompt = this.constructPrompt(data);
    Logger.log('Constructed Prompt: ', prompt);

    try {
      const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt,
        temperature: 0,
        max_tokens: 3000,
      });
      const res = completion.data.choices[0].text.trim();
      await this.email.sendEmail(
        data.email,
        'Your Personalised Meal Plan',
        res,
      );
      return JSON.parse(res);
    } catch (error) {
      throw error;
    }
  }

  constructPrompt(data: any): string {
    const { user_info } = data;
    return `
Using the provided user profile:
{
  "user_info": {
    "gender": "${user_info.gender}",
    "age_range": "${user_info.age_range}",
    "height": "${user_info.height}",
    "weight": "${user_info.weight}",
    "target_weight": "${user_info.target_weight}",
    "timeframe": "${user_info.timeframe}",
    "lifestyle": "${user_info.lifestyle}",
    "allergies": "${user_info.allergies}",
    "preferred_cuisine": "${user_info.preferred_cuisine}",
    "preferred_protein": "${user_info.preferred_protein}",
    "preferred_fat": "${user_info.preferred_fat}",
    "preferred_carbs": "${user_info.preferred_carbs}",
    "specific_diet": "${user_info.specific_diet}",
    "diet_goal": "${user_info.diet_goal}",
    "dietary_restrictions": "${user_info.dietary_restrictions}"
  },
  "diet_rules": {
    "no_artificial_sugar": "${data.diet_rules.no_artificial_sugar}",
    "limited_salt": "${data.diet_rules.limited_salt}",
    "intermittent_fasting": "${data.diet_rules.intermittent_fasting}",
    "reduced_portion": "${data.diet_rules.reduced_portion}",
    "reduced_times_eating": "${data.diet_rules.reduced_times_eating}"
  }
}

Based on the given profile and dietary rules, generate customized meal plan. the length of the plan is: "${user_info.timeframe}".

Ensure meals are simple to prepare, delightful, and STRICTLY adhere to the given constraints.

Generate the output in a way that it can be directly passed to a PDF generator to create a beautiful, well-structured document.


include the following in your output
Summary: summary of how this plan will help the user achieve their weigh goal. mention the goal.
For each meal: create a title, description, step by step instruction on how to cook it, and a nutrition section:
              "calories_per_serving": "",
              "protein_content": "",
              "fat_content": "",
              "sugar_content": ""
              
Make SURE you generate enough meals to cover the user's time frame : "${user_info.timeframe}"
`;
  }
}
