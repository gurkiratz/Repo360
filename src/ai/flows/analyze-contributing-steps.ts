'use server'

/**
 * @fileOverview Analyzes repository for contributing steps and setup instructions.
 *
 * - analyzeContributingSteps - A function that generates contributing steps
 * - AnalyzeContributingStepsInput - The input type for the analyzeContributingSteps function
 * - AnalyzeContributingStepsOutput - The return type for the analyzeContributingSteps function
 */

import { ai } from '@/ai/genkit'
import { z } from 'genkit'

const AnalyzeContributingStepsInputSchema = z.object({
  repoUrl: z.string().describe('The URL of the GitHub repository.'),
  readmeContent: z.string().describe('The content of the README.md file.'),
  packageJsonContent: z
    .string()
    .describe('The content of the package.json file.'),
  fileList: z
    .array(z.string())
    .describe('A list of file paths in the repository.'),
})
export type AnalyzeContributingStepsInput = z.infer<
  typeof AnalyzeContributingStepsInputSchema
>

const ContributingStepSchema = z.object({
  id: z.string().describe('Unique identifier for the step'),
  title: z
    .string()
    .describe(
      'Title of the step (e.g., "Clone Repository", "Install Dependencies")'
    ),
  description: z.string().describe('Detailed description of what to do'),
  command: z.string().optional().describe('Command to run (if applicable)'),
  type: z
    .enum(['setup', 'development', 'testing', 'deployment', 'documentation'])
    .describe('Type of step'),
  required: z.boolean().describe('Whether this step is required or optional'),
  estimatedTime: z
    .string()
    .describe('Estimated time to complete (e.g., "2 minutes", "5-10 minutes")'),
})

const AnalyzeContributingStepsOutputSchema = z.object({
  steps: z
    .array(ContributingStepSchema)
    .describe('List of contributing steps in order'),
  prerequisites: z
    .array(z.string())
    .describe('Prerequisites needed before starting (Node.js, Git, etc.)'),
  developmentPossible: z
    .boolean()
    .describe('Whether local development is possible'),
  difficulty: z
    .enum(['Easy', 'Moderate', 'Advanced'])
    .describe('Overall difficulty of contributing'),
  estimatedSetupTime: z.string().describe('Total estimated setup time'),
  additionalNotes: z
    .string()
    .describe('Any additional notes or tips for contributors'),
})
export type AnalyzeContributingStepsOutput = z.infer<
  typeof AnalyzeContributingStepsOutputSchema
>

export async function analyzeContributingSteps(
  input: AnalyzeContributingStepsInput
): Promise<AnalyzeContributingStepsOutput> {
  return analyzeContributingStepsFlow(input)
}

const prompt = ai.definePrompt({
  name: 'analyzeContributingStepsPrompt',
  input: { schema: AnalyzeContributingStepsInputSchema },
  output: { schema: AnalyzeContributingStepsOutputSchema },
  prompt: `You are an expert developer onboarding specialist. Analyze this repository and create specific, actionable contributing steps.

Repository URL: {{{repoUrl}}}

README Content:
\`\`\`markdown
{{{readmeContent}}}
\`\`\`

package.json Content:
\`\`\`json
{{{packageJsonContent}}}
\`\`\`

Files: {{#each fileList}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

## Instructions:

1. **Analyze Setup Requirements**: Based on package.json, README, and files, determine:
   - Prerequisites (Node.js version, package manager, tools)
   - Whether local development is possible
   - Setup complexity

2. **Create Step-by-Step Guide**: Generate specific steps including:
   - **Setup**: Fork, clone, install dependencies
   - **Development**: Start dev server, run tests, build commands
   - **Testing**: How to test changes
   - **Deployment**: If applicable, deployment steps
   - **Documentation**: Update docs if needed

3. **Extract from package.json scripts**: Look for:
   - "dev", "start", "build" scripts
   - "test", "lint", "typecheck" scripts
   - "deploy", "preview" scripts

4. **Check for Configuration**: Look for:
   - Docker files
   - Environment variables needed
   - Database setup
   - External service requirements

5. **Estimate Times**: Provide realistic time estimates for each step

6. **Determine Difficulty**: Based on:
   - Number of dependencies
   - Configuration complexity
   - External service requirements
   - Technology stack complexity

Focus on being practical and actionable. If local development isn't possible (e.g., requires paid services, complex infrastructure), clearly state this.`,
})

const analyzeContributingStepsFlow = ai.defineFlow(
  {
    name: 'analyzeContributingStepsFlow',
    inputSchema: AnalyzeContributingStepsInputSchema,
    outputSchema: AnalyzeContributingStepsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input)
    return output!
  }
)
