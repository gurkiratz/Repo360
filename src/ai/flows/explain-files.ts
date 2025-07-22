'use server'
/**
 * @fileOverview Explains major files in a repository.
 *
 * - explainFiles - A function that handles the file explanation process.
 * - ExplainFilesInput - The input type for the explainFiles function.
 * - ExplainFilesOutput - The return type for the explainFiles function.
 */

import { getAI } from '@/ai/genkit-dynamic'
import { z } from 'genkit'

const ExplainFilesInputSchema = z.object({
  repoUrl: z.string().describe('The URL of the GitHub repository.'),
  fileList: z.array(z.string()).describe('List of major files to explain.'),
})
export type ExplainFilesInput = z.infer<typeof ExplainFilesInputSchema>

const ExplainFilesOutputSchema = z.object({
  explanations: z.array(
    z.object({
      file: z.string().describe('The file path.'),
      explanation: z.string().describe('AI-powered explanation of the file.'),
    })
  ),
})
export type ExplainFilesOutput = z.infer<typeof ExplainFilesOutputSchema>

export async function explainFiles(
  input: ExplainFilesInput,
  userApiKey?: string
): Promise<ExplainFilesOutput> {
  const ai = getAI(userApiKey)

  const prompt = ai.definePrompt({
    name: 'explainFilesPrompt',
    input: { schema: ExplainFilesInputSchema },
    output: { schema: ExplainFilesOutputSchema },
    prompt: `You are an AI expert in analyzing and explaining code files in repositories.

For each file in the provided list, fetch the content and provide a clear, concise explanation of what the file does and why it's important.

Repository URL: {{{repoUrl}}}
Files to explain: {{#each fileList}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

For each file:
1. Provide a 2-3 sentence explanation of what the file does
2. Explain its role in the overall project architecture
3. Highlight any key functions, classes, or exports
4. Make it accessible for developers who are new to the codebase

Keep explanations concise but informative.`,
  })

  const explainFilesFlow = ai.defineFlow(
    {
      name: 'explainFilesFlow',
      inputSchema: ExplainFilesInputSchema,
      outputSchema: ExplainFilesOutputSchema,
    },
    async (input: ExplainFilesInput) => {
      const { output } = await prompt(input)
      return output!
    }
  )

  return explainFilesFlow(input)
}
