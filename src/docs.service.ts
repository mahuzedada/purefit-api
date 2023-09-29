import { Injectable } from '@nestjs/common';
import { GenerateDocsDTO } from './dto';
import OpenAI from 'openai';
import { Logger } from '@nestjs/common';
import env from './env';

const openai = new OpenAI({
  apiKey: env.openAiKey,
});

@Injectable()
export class DocsService {
  constructor() {}

  async generateDocs(data: GenerateDocsDTO): Promise<any> {
    Logger.log('Started Requests');
    const prompt = this.generateOpenAIPrompt(data);
    Logger.log('Constructed Prompt: ', prompt);

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ content: prompt, role: 'user' }],
        temperature: 0,
        max_tokens: 3000,
      });
      return completion.choices[0].message.content.trim();
    } catch (error) {
      throw error;
    }
  }

  generateOpenAIPrompt(data: GenerateDocsDTO): string {
    let prompt = `Generate a structured developer documentation tailored to the following needs:\n`;

    // prompt += `- IDE: ${data.ide_selection.join(', ')}\n`;
    prompt += `- Programming Languages: ${data.languages_used.join(', ')}\n`;
    prompt += `- Frameworks: ${data.frameworks_used.join(', ')}\n`;
    prompt += `- Preferred Documentation Style: ${data.doc_preference}\n`;
    prompt += `- Top Documentation Platforms: ${data.preferred_doc_platforms.join(
      ', ',
    )}\n`;
    prompt += `- Primary Online Search Resource: ${data.search_first_choice}\n`;
    prompt += `- Frequently Encountered Coding Concepts: ${data.frequent_coding_concepts.join(
      ', ',
    )}\n`;
    prompt += `- Latest Coding Queries: ${data.recent_queries.join(', ')}\n`;

    prompt += `Based on the above specifications, include code examples and identify essential concepts related to the tools and preferences provided. Include links to official documentation where relevant. Present your findings in markdown format.`;

    return prompt;
  }
}
