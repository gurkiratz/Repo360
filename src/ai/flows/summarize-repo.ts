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

  Given a GitHub repository URL, you will fetch the repository's README.md, package.json, and key folders.
  You will then generate a concise summary of the repository, including its purpose, tech stack, and entry point.

  Repository URL: {{{repoUrl}}}
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
