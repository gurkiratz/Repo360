'use server';

/**
 * @fileOverview A file purpose classification AI agent.
 *
 * - classifyFilePurpose - A function that handles the file classification process.
 * - ClassifyFilePurposeInput - The input type for the classifyFilePurpose function.
 * - ClassifyFilePurposeOutput - The return type for the classifyFilePurpose function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyFilePurposeInputSchema = z.object({
  fileName: z.string().describe('The name of the file to classify.'),
  fileContent: z.string().describe('The content of the file.'),
});
export type ClassifyFilePurposeInput = z.infer<typeof ClassifyFilePurposeInputSchema>;

const ClassifyFilePurposeOutputSchema = z.object({
  purpose: z.string().describe('The purpose of the file in natural language.'),
});
export type ClassifyFilePurposeOutput = z.infer<typeof ClassifyFilePurposeOutputSchema>;

export async function classifyFilePurpose(input: ClassifyFilePurposeInput): Promise<ClassifyFilePurposeOutput> {
  return classifyFilePurposeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyFilePurposePrompt',
  input: {schema: ClassifyFilePurposeInputSchema},
  output: {schema: ClassifyFilePurposeOutputSchema},
  prompt: `You are an AI expert in classifying the purpose of files in a software repository.

  Given the name and content of a file, determine its purpose in natural language.

  File Name: {{{fileName}}}
  File Content:
  {{#if fileContent}}
  {{fileContent}}
  {{else}}
  (File content is empty)
  {{/if}}
  `,
});

const classifyFilePurposeFlow = ai.defineFlow(
  {
    name: 'classifyFilePurposeFlow',
    inputSchema: ClassifyFilePurposeInputSchema,
    outputSchema: ClassifyFilePurposeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
