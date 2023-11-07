import { Injectable } from '@nestjs/common';
import { CandidateAndJobInfoDto, GenerateDocsDTO } from './dto';
import OpenAI from 'openai';
import { Logger } from '@nestjs/common';
import env from './env';

const openai = new OpenAI({
  apiKey: env.openAiKey,
});

@Injectable()
export class DocsService {
  constructor() {}

  async generateCoverLetter(data: CandidateAndJobInfoDto): Promise<any> {
    Logger.log('Started Requests');
    const prompt = this.generateCoverLetterPrompt(data);
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

  generateCoverLetterPrompt(data: CandidateAndJobInfoDto): string {
    return `
Based on the provided CoverLetterDTO data:

- First Name: ${data.firstName}
- Last Name: ${data.lastName}
- Resume Details: \`\`\`
${data.resumeText}
      \`\`\`
- Job Description: \`\`\`
${data.jdText}
      \`\`\`
- Tone: ${data.tone}

Please generate a cover letter that incorporates all the provided details. The tone of the cover letter should match the specified tone. Ensure it begins with an appropriate salutation, followed by an introduction, a body detailing the applicant's suitability for the job based on the resume details and job description, and a conclusion expressing gratitude for considering the application. The letter should close with a formal sign-off.
  `;
  }

  async generateSkillGap(data: CandidateAndJobInfoDto): Promise<any> {
    Logger.log('Started Requests');
    const prompt = this.generateSkillGapPrompt(data);
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

  generateSkillGapPrompt(data: CandidateAndJobInfoDto): string {
    return `
Based on the provided candidate and job data:

- Resume Details: \`\`\`
      ${data.resumeText}
      \`\`\`
- Job Description: \`\`\`
      ${data.jdText}
      \`\`\`

Please perform a skill gap analysis in the following json format.
{
  "strengths": "Highlight the candidate's strengths that match the job description. This should be formatted as a array of strings where each element is a strength",
  "gaps: "Identify areas where the candidate might be lacking or could improve in relation to the job's requirements. This should be formatted as a array of strings where each element is a gap",
  "resources": "For each identified skill gap or area of improvement, suggest free online resources or courses that can help the candidate acquire or bolster those required skills. The goal is to provide the candidate with a comprehensive action plan to better align their skills with the job's demands. This should be formatted as a array of {skill: 'skill1', resources: [{shortDescription: '', link: 'resource1'}, {shortDescription: '', link: 'resource2'}]} where each element is a skill and corresponding resources",
  "matchScore: "a score out of 100 to describe how well the candidate's skills are aligned with the job description",
}
  `;
  }

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
