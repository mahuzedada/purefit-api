import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DietPlanDTO } from './dto';
import { Configuration, OpenAIApi } from 'openai';
import { Logger } from '@nestjs/common';

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});

const openai = new OpenAIApi(configuration);

@Injectable()
export class OpenAIService {
  constructor() {}

  async generateDietPlan(data: DietPlanDTO): Promise<any> {
    Logger.log('Started Requests');
    const prompt = this.constructPrompt(data);
    Logger.log('Constructed Prompt: ', prompt);

    try {
      const completion = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt,
        temperature: 0.6,
        max_tokens: 2048,
      });
      const json = this.removeMarkdownFence(
        completion.data.choices[0].text.trim(),
      );
      return JSON.parse(json);
    } catch (error) {
      throw new HttpException(
        'Failed to get a response from OpenAI.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  removeMarkdownFence(inputString) {
    // Create a regular expression to match the markdown code fence
    const regex = /```json\n|```/g;

    // Replace all occurrences of the code fence with an empty string
    return inputString.replace(regex, '');
  }

  constructPrompt(data: any): string {
    return `
Based on the following user profile:

Gender: ${data.user_info.gender}
Age range: ${data.user_info.age_range}
Lifestyle: ${data.user_info.lifestyle}
Marital status: ${data.user_info.marital_status}
Number of kids: ${data.user_info.number_of_kids}
Kids' age ranges: ${data.user_info.kids_age_ranges}
Allergies: ${data.user_info.allergies}
Preferred cuisine: ${data.user_info.preferred_cuisine}
Preferred sources of protein: ${data.user_info.preferred_protein}
Preferred sources of fat: ${data.user_info.preferred_fat}
Preferred sources of carbohydrates: ${data.user_info.preferred_carbs}
Specific diet: ${data.user_info.specific_diet}
Diet goal: ${data.user_info.diet_goal}
Number of meals per day: ${data.user_info.meals_per_day}
Time available for meal preparation: ${data.user_info.time_for_cook}
Additional dietary restrictions or preferences: ${data.user_info.dietary_restrictions}

And the following diet rules:
- No artificial sugar: ${data.diet_rules.no_artificial_sugar}
- Limited salt: ${data.diet_rules.limited_salt}
- Intermittent fasting: ${data.diet_rules.intermittent_fasting}
- Reduced portion size: ${data.diet_rules.reduced_portion}
- Reduced number of meals: ${data.diet_rules.reduced_times_eating}

Generate a customized list of meal ideas that respects these preferences and constraints. Please provide the response in the following format:
Add a description for each meal ideas. the user needs instructions to be able to cook the meal. choose easy to make, yet delicious meals.
\`\`\`json
{
  "breakfast_ideas": [
    "{breakfast_idea_1}",
    "{breakfast_idea_2}",
    "{breakfast_idea_3}"
  ],
  "lunch_ideas": [
    "{lunch_idea_1}",
    "{lunch_idea_2}",
    "{lunch_idea_3}"
  ],
  "dinner_ideas": [
    "{dinner_idea_1}",
    "{dinner_idea_2}",
    "{dinner_idea_3}"
  ],
  "snack_ideas": [
    "{snack_idea_1}",
    "{snack_idea_2}",
    "{snack_idea_3}"
  ]
}
\`\`\`
    `;
  }
}
