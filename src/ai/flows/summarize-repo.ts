'use server'

/**
 * @fileOverview Summarizes a GitHub repository given its URL.
 *
 * - summarizeRepo - A function that summarizes a GitHub repository.
 * - SummarizeRepoInput - The input type for the summarizeRepo function.
 * - SummarizeRepoOutput - The return type for the summarizeRepo function.
 */

import { getAI } from '@/ai/genkit-dynamic'
import { z } from 'genkit'

const SummarizeRepoInputSchema = z.object({
  repoUrl: z.string().describe('The URL of the GitHub repository.'),
  readmeContent: z.string().describe('The content of the README.md file.'),
  packageJsonContent: z
    .string()
    .describe('The content of the package.json file.'),
})
export type SummarizeRepoInput = z.infer<typeof SummarizeRepoInputSchema>

const SummarizeRepoOutputSchema = z.object({
  purpose: z
    .string()
    .describe(
      'Concise description of what this repository does and its main objective.'
    ),
  howToRun: z
    .string()
    .describe(
      'Key commands and steps to run/start the project (scripts, Docker, setup instructions).'
    ),
  techStack: z
    .string()
    .describe(
      'Primary technologies, frameworks, and languages used in the project.'
    ),
  entryPoints: z
    .string()
    .describe('Main entry files and starting points for the codebase.'),
})
export type SummarizeRepoOutput = z.infer<typeof SummarizeRepoOutputSchema>

export async function summarizeRepo(
  input: SummarizeRepoInput,
  userApiKey?: string
): Promise<SummarizeRepoOutput> {
  const ai = getAI(userApiKey)

  const prompt = ai.definePrompt({
    name: 'summarizeRepoPrompt',
    input: { schema: SummarizeRepoInputSchema },
    output: { schema: SummarizeRepoOutputSchema },
    prompt: `You are an expert code repository analyzer. Generate a concise Executive Summary with exactly 4 sections.

## Repository Information:
**URL:** {{{repoUrl}}}

## README Content:
\`\`\`markdown
{{{readmeContent}}}
\`\`\`

## package.json Content:
\`\`\`json
{{{packageJsonContent}}}
\`\`\`

## Generate Executive Summary:

**PURPOSE**: Extract from README title/description and package.json description what this repository does and its main objective. Keep it to 1-2 sentences.

**HOW TO RUN**: Identify key commands to start/run the project. Look for:
- package.json scripts (dev, start, build)
- Docker commands in README
- Setup instructions
- Installation steps
Keep concise - just the essential commands.

**TECH STACK**: List primary technologies from package.json dependencies and README:
- Language (JavaScript/TypeScript/Python/etc.)
- Main framework (React, Next.js, Express, etc.)
- Key libraries
- Build tools
Format as comma-separated list.

**ENTRY POINTS**: Identify main starting files from:
- package.json "main" field
- Common patterns (index.js, src/index.ts, app.js, main.py)
- Script targets
List 2-3 most important files.

Keep each section concise and actionable for developers.`,
  })

  const summarizeRepoFlow = ai.defineFlow(
    {
      name: 'summarizeRepoFlow',
      inputSchema: SummarizeRepoInputSchema,
      outputSchema: SummarizeRepoOutputSchema,
    },
    async (input: SummarizeRepoInput) => {
      const { output } = await prompt(input)
      return output!
    }
  )

  return summarizeRepoFlow(input)
}
