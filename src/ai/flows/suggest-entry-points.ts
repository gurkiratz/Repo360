// Suggests which files a developer should read first to understand the repository.

'use server'

import { getAI } from '@/ai/genkit-dynamic'
import { z } from 'genkit'

const SuggestEntryPointsInputSchema = z.object({
  repoUrl: z.string().describe('The URL of the GitHub repository.'),
  readmeContent: z.string().describe('The content of the README file.'),
  packageJsonContent: z
    .string()
    .describe('The content of the package.json file.'),
  fileList: z
    .array(z.string())
    .describe('A list of file paths in the repository.'),
})
export type SuggestEntryPointsInput = z.infer<
  typeof SuggestEntryPointsInputSchema
>

const SuggestEntryPointsOutputSchema = z.object({
  suggestedFiles: z
    .array(z.string())
    .describe(
      'A list of file paths that the developer should read first, in order of importance.'
    ),
  reasoning: z
    .string()
    .describe('The AI reasoning for suggesting these files.'),
})
export type SuggestEntryPointsOutput = z.infer<
  typeof SuggestEntryPointsOutputSchema
>

export async function suggestEntryPoints(
  input: SuggestEntryPointsInput,
  userApiKey?: string
): Promise<SuggestEntryPointsOutput> {
  const ai = getAI(userApiKey)

  const prompt = ai.definePrompt({
    name: 'suggestEntryPointsPrompt',
    input: { schema: SuggestEntryPointsInputSchema },
    output: { schema: SuggestEntryPointsOutputSchema },
    prompt: `You are an AI expert in analyzing code repositories to suggest the most important files for developers to read first.

Based on the repository structure and content, identify the 4-8 most important files that a developer should read to understand the codebase.

Repository URL: {{{repoUrl}}}

README Content:
\`\`\`markdown
{{{readmeContent}}}
\`\`\`

package.json Content:
\`\`\`json
{{{packageJsonContent}}}
\`\`\`

File List: {{#each fileList}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

## Instructions:

1. **Prioritize Core Files**: Focus on files that define the main functionality, structure, and purpose
2. **Entry Points First**: Configuration, main entry files, core components
3. **Skip Obvious**: Avoid .gitignore, package-lock.json, basic config files unless critical
4. **Reasoning**: Provide clear reasoning for why these files are important to read first

Select 4-8 files maximum that give the best understanding of the codebase architecture and purpose.`,
  })

  const suggestEntryPointsFlow = ai.defineFlow(
    {
      name: 'suggestEntryPointsFlow',
      inputSchema: SuggestEntryPointsInputSchema,
      outputSchema: SuggestEntryPointsOutputSchema,
    },
    async (input: SuggestEntryPointsInput) => {
      const { output } = await prompt(input)
      return output!
    }
  )

  return suggestEntryPointsFlow(input)
}
