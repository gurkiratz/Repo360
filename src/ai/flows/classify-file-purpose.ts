'use server'

/**
 * @fileOverview A file purpose classification AI agent.
 *
 * - classifyFilePurpose - A function that handles the file classification process.
 * - ClassifyFilePurposeInput - The input type for the classifyFilePurpose function.
 * - ClassifyFilePurposeOutput - The return type for the classifyFilePurpose function.
 */

import { getAI } from '@/ai/genkit-dynamic'
import { z } from 'genkit'

const ClassifyFilePurposeInputSchema = z.object({
  fileName: z.string().describe('The name of the file to classify.'),
  fileContent: z.string().describe('The content of the file.'),
})
export type ClassifyFilePurposeInput = z.infer<
  typeof ClassifyFilePurposeInputSchema
>

const ClassifyFilePurposeOutputSchema = z.object({
  purpose: z
    .string()
    .describe('A concise 1-line description of what this file does.'),
  tag: z
    .string()
    .describe(
      'A short categorization tag (e.g., "Config", "Component", "API", "Utils", "Entry Point").'
    ),
  importance: z
    .enum(['Critical', 'Important', 'Standard', 'Supporting'])
    .describe('How important this file is for understanding the codebase.'),
})
export type ClassifyFilePurposeOutput = z.infer<
  typeof ClassifyFilePurposeOutputSchema
>

export async function classifyFilePurpose(
  input: ClassifyFilePurposeInput,
  userApiKey?: string
): Promise<ClassifyFilePurposeOutput> {
  const ai = getAI(userApiKey)

  const prompt = ai.definePrompt({
    name: 'classifyFilePurposePrompt',
    input: { schema: ClassifyFilePurposeInputSchema },
    output: { schema: ClassifyFilePurposeOutputSchema },
    prompt: `You are an AI expert in classifying files in software repositories.

Analyze the file and provide:
1. A concise 1-line description of what this file does
2. A short categorization tag (Config, Component, API, Utils, Entry Point, Test, Documentation, etc.)
3. Its importance level for understanding the codebase

File Name: {{{fileName}}}
File Content:
{{#if fileContent}}
{{{fileContent}}}
{{else}}
(File content is empty)
{{/if}}

Focus on being concise and actionable for developers who want to understand the codebase quickly.`,
  })

  const classifyFilePurposeFlow = ai.defineFlow(
    {
      name: 'classifyFilePurposeFlow',
      inputSchema: ClassifyFilePurposeInputSchema,
      outputSchema: ClassifyFilePurposeOutputSchema,
    },
    async (input: ClassifyFilePurposeInput) => {
      const { output } = await prompt(input)
      return output!
    }
  )

  return classifyFilePurposeFlow(input)
}
