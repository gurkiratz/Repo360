'use server';
/**
 * @fileOverview Explains major files in a repository.
 *
 * - explainFiles - A function that handles the file explanation process.
 * - ExplainFilesInput - The input type for the explainFiles function.
 * - ExplainFilesOutput - The return type for the explainFiles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainFilesInputSchema = z.object({
  repoUrl: z.string().describe('The URL of the GitHub repository.'),
  fileList: z.array(z.string()).describe('List of major files to explain.'),
});
export type ExplainFilesInput = z.infer<typeof ExplainFilesInputSchema>;

const ExplainFilesOutputSchema = z.object({
  explanations: z.array(
    z.object({
      file: z.string().describe('The file path.'),
      explanation: z.string().describe('AI-powered explanation of the file.'),
    })
  ),
});
export type ExplainFilesOutput = z.infer<typeof ExplainFilesOutputSchema>;

export async function explainFiles(input: ExplainFilesInput): Promise<ExplainFilesOutput> {
  return explainFilesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainFilesPrompt',
  input: {schema: ExplainFilesInputSchema},
  output: {schema: ExplainFilesOutputSchema},
  prompt: `You are an AI expert in explaining code repositories.

You will receive a list of files from a GitHub repository and your task is to explain the purpose of each file.

Repository URL: {{{repoUrl}}}

Files to explain:
{{#each fileList}}
- {{{this}}}
{{/each}}

Provide a concise explanation for each file, highlighting its role and function within the project.

Output the explanations in a JSON format like this:
{
  "explanations": [
    {
      "file": "path/to/file1.js",
      "explanation": "Explanation of file1"
    },
    {
      "file": "path/to/file2.js",
      "explanation": "Explanation of file2"
    }
  ]
}
`,
});

const explainFilesFlow = ai.defineFlow(
  {
    name: 'explainFilesFlow',
    inputSchema: ExplainFilesInputSchema,
    outputSchema: ExplainFilesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
