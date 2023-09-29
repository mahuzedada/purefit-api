import { Injectable } from '@nestjs/common';
import { DietPlanDTO } from './dto';
import OpenAI from 'openai';
import { Logger } from '@nestjs/common';
import env from './env';

const openai = new OpenAI({
  apiKey: env.openAiKey,
});

@Injectable()
export class OpenAIService {
  constructor() {}

  async generateDietPlan(data: DietPlanDTO): Promise<any> {
    Logger.log('Started Requests');
    const prompt = this.constructPrompt(data);
    // Logger.log('Constructed Prompt: ', prompt);

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ content: prompt, role: 'user' }],
        temperature: 0,
        max_tokens: 3000,
      });
      return JSON.parse(completion.choices[0].message.content.trim());
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

Based on the given profile and dietary rules, generate customized meal ideas.

For each meal idea, you will generate a title and a description. Use a instruction tone in the style of a 5* restaurant to generate the title and the description.

You will generate accurate nutrition_information according to the JSON format bellow.

Make sure all the information you generate is accurate. DO NOT make anything up!

Return the meal suggestions in the following JSON format:

If the user wants to loose or gain weight, make sure your meal suggestion have the daily calories deficit or surplus to reach the goal in the time frame provided by the user.
{
  "breakfast_idea": {
    "title": "",
    "description": "",
    "nutrition_information": {
      "calories_per_serving": "",
      "protein_content": "",
      "fat_content": "",
      "sugar_content": ""
    }
  },
  "lunch_idea": {
    "title": "",
    "description": "",
    "nutrition_information": {
      "calories_per_serving": "",
      "protein_content": "",
      "fat_content": "",
      "sugar_content": ""
    }
  },
  "dinner_idea": {
    "title": "",
    "description": "",
    "nutrition_information": {
      "calories_per_serving": "",
      "protein_content": "",
      "fat_content": "",
      "sugar_content": ""
    }
  },
  "snack_idea": {
    "title": "",
    "description": "",
    "nutrition_information": {
      "calories_per_serving": "",
      "protein_content": "",
      "fat_content": "",
      "sugar_content": ""
    }
  },
  "prediction_of_daily_calories_burn_based_on_user_life_style": "",
  "total_calories_per_day_from_all_suggested_meals": "",
  "total_calories_deficit_needed_per_day": "",
  "total_calories_surplus_needed_per_day": "",
}

Ensure meals are simple to prepare, delightful, and STRICTLY adhere to the given constraints.
`;
  }
}
