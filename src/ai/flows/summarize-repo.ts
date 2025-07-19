'use server'

/**
 * @fileOverview Summarizes a GitHub repository given its URL.
 *
 * - summarizeRepo - A function that summarizes a GitHub repository.
 * - SummarizeRepoInput - The input type for the summarizeRepo function.
 * - SummarizeRepoOutput - The return type for the summarizeRepo function.
 */

import { ai } from '@/ai/genkit'
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
  summary: z
    .string()
    .describe(
      'A concise summary of the repository including its purpose, tech stack, and entry point.'
    ),
})
export type SummarizeRepoOutput = z.infer<typeof SummarizeRepoOutputSchema>

export async function summarizeRepo(
  input: SummarizeRepoInput
): Promise<SummarizeRepoOutput> {
  return summarizeRepoFlow(input)
}

// const prompt = ai.definePrompt({
//   name: 'summarizeRepoPrompt',
//   input: { schema: SummarizeRepoInputSchema },
//   output: { schema: SummarizeRepoOutputSchema },
//   prompt: `You are an AI expert in understanding and summarizing code repositories.

//   Based on the provided README.md and package.json content, generate a concise summary of the repository.
//   Include its purpose, tech stack, and potential entry points.

//   Repository URL: {{{repoUrl}}}

//   README Content:
//   {{{readmeContent}}}

//   package.json Content:
//   {{{packageJsonContent}}}

//   Summary:
//   `,
// })

const prompt = ai.definePrompt({
  name: 'summarizeRepoPrompt',
  input: { schema: SummarizeRepoInputSchema },
  output: { schema: SummarizeRepoOutputSchema },
  prompt: `You are an expert code repository analyzer with deep knowledge of software development patterns, frameworks, and project structures.

Your task is to analyze the provided repository information and generate a comprehensive yet concise summary that helps developers quickly understand what this project does and how it's built.

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

## Analysis Instructions:

1. **Purpose & Description**: 
   - Extract the main purpose from README and package.json description
   - Identify the problem this project solves
   - Note the target audience (developers, end-users, etc.)

2. **Technology Stack Analysis**:
   - Primary language and version
   - Key frameworks and libraries (React, Express, Next.js, etc.)
   - Development tools (TypeScript, ESLint, testing frameworks)
   - Build tools and bundlers
   - Database or storage solutions mentioned

3. **Project Structure & Entry Points**:
   - Identify main entry point from package.json "main" field
   - Look for common entry patterns (index.js, src/index.ts, app.js)
   - Note important scripts (start, build, dev, test)
   - Identify if it's a library, application, or tool

4. **Key Features & Functionality**:
   - Extract main features from README
   - Note any APIs, CLI commands, or interfaces
   - Identify deployment or usage patterns

5. **Development Setup Indicators**:
   - Required Node.js version
   - Key development dependencies
   - Testing setup
   - Build process complexity

## Output Requirements:
- Be concise but comprehensive
- Use technical terms appropriately
- Highlight unique or notable aspects
- Prioritize information that helps developers understand the project quickly
- If information is missing or unclear, note it explicitly

Generate your analysis now:`,
})

const summarizeRepoFlow = ai.defineFlow(
  {
    name: 'summarizeRepoFlow',
    inputSchema: SummarizeRepoInputSchema,
    outputSchema: SummarizeRepoOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input)
    return output!
  }
)
