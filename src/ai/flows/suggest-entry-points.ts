// Suggests which files a developer should read first to understand the repository.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestEntryPointsInputSchema = z.object({
  repoUrl: z.string().describe('The URL of the GitHub repository.'),
  readmeContent: z.string().describe('The content of the README file.'),
  packageJsonContent: z.string().describe('The content of the package.json file.'),
  fileList: z.array(z.string()).describe('A list of file paths in the repository.'),
});
export type SuggestEntryPointsInput = z.infer<typeof SuggestEntryPointsInputSchema>;

const SuggestEntryPointsOutputSchema = z.object({
  suggestedFiles: z.array(z.string()).describe('A list of file paths that the developer should read first, in order of importance.'),
  reasoning: z.string().describe('The AI reasoning for suggesting these files.'),
});
export type SuggestEntryPointsOutput = z.infer<typeof SuggestEntryPointsOutputSchema>;

export async function suggestEntryPoints(input: SuggestEntryPointsInput): Promise<SuggestEntryPointsOutput> {
  return suggestEntryPointsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestEntryPointsPrompt',
  input: {schema: SuggestEntryPointsInputSchema},
  output: {schema: SuggestEntryPointsOutputSchema},
  prompt: `You are an AI expert in understanding code repositories.

  Given the following information about a repository, suggest a list of files that a developer should read first to understand the repository.
  Explain your reasoning.

  Repo URL: {{{repoUrl}}}
  README.md content: {{{readmeContent}}}
  package.json content: {{{packageJsonContent}}}
  File list: {{#each fileList}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

  Return the file list in order of importance.
  `,
});

const suggestEntryPointsFlow = ai.defineFlow(
  {
    name: 'suggestEntryPointsFlow',
    inputSchema: SuggestEntryPointsInputSchema,
    outputSchema: SuggestEntryPointsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
