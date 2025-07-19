'use server';

/**
 * @fileOverview Summarizes a GitHub repository given its URL.
 *
 * - summarizeRepo - A function that summarizes a GitHub repository.
 * - SummarizeRepoInput - The input type for the summarizeRepo function.
 * - SummarizeRepoOutput - The return type for the summarizeRepo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeRepoInputSchema = z.object({
  repoUrl: z.string().describe('The URL of the GitHub repository.'),
  readmeContent: z.string().describe('The content of the README.md file.'),
  packageJsonContent: z.string().describe('The content of the package.json file.'),
});
export type SummarizeRepoInput = z.infer<typeof SummarizeRepoInputSchema>;

const SummarizeRepoOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the repository including its purpose, tech stack, and entry point.'),
});
export type SummarizeRepoOutput = z.infer<typeof SummarizeRepoOutputSchema>;

export async function summarizeRepo(input: SummarizeRepoInput): Promise<SummarizeRepoOutput> {
  return summarizeRepoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeRepoPrompt',
  input: {schema: SummarizeRepoInputSchema},
  output: {schema: SummarizeRepoOutputSchema},
  prompt: `You are an AI expert in understanding and summarizing code repositories.

  Based on the provided README.md and package.json content, generate a concise summary of the repository.
  Include its purpose, tech stack, and potential entry points.

  Repository URL: {{{repoUrl}}}
  
  README Content:
  {{{readmeContent}}}

  package.json Content:
  {{{packageJsonContent}}}

  Summary:
  `,
});

const summarizeRepoFlow = ai.defineFlow(
  {
    name: 'summarizeRepoFlow',
    inputSchema: SummarizeRepoInputSchema,
    outputSchema: SummarizeRepoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
