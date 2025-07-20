'use server'

/**
 * @fileOverview Analyzes repository architecture and identifies main components.
 *
 * - analyzeArchitecture - A function that analyzes the overall architecture
 * - AnalyzeArchitectureInput - The input type for the analyzeArchitecture function
 * - AnalyzeArchitectureOutput - The return type for the analyzeArchitecture function
 */

import { ai } from '@/ai/genkit'
import { z } from 'genkit'

const AnalyzeArchitectureInputSchema = z.object({
  repoUrl: z.string().describe('The URL of the GitHub repository.'),
  readmeContent: z.string().describe('The content of the README.md file.'),
  packageJsonContent: z
    .string()
    .describe('The content of the package.json file.'),
  fileList: z
    .array(z.string())
    .describe('A list of file paths in the repository.'),
})
export type AnalyzeArchitectureInput = z.infer<
  typeof AnalyzeArchitectureInputSchema
>

const ArchitectureComponentSchema = z.object({
  id: z.string().describe('Unique identifier for the component'),
  name: z
    .string()
    .describe(
      'Name of the component (e.g., "Frontend", "API Routes", "Database")'
    ),
  type: z
    .enum([
      'frontend',
      'backend',
      'api',
      'database',
      'ai_model',
      'config',
      'testing',
      'deployment',
      'utils',
      'docs',
    ])
    .describe('Type of component'),
  description: z
    .string()
    .describe('Brief description of what this component does'),
  keyFiles: z
    .array(z.string())
    .describe('Key files that belong to this component'),
  technologies: z
    .array(z.string())
    .describe('Technologies/frameworks used in this component'),
  connections: z
    .array(z.string())
    .describe('IDs of other components this one connects to'),
})

const AnalyzeArchitectureOutputSchema = z.object({
  components: z
    .array(ArchitectureComponentSchema)
    .describe('List of architectural components'),
  overview: z.string().describe('High-level overview of the architecture'),
  mainFlow: z.string().describe('Description of the main data/execution flow'),
})
export type AnalyzeArchitectureOutput = z.infer<
  typeof AnalyzeArchitectureOutputSchema
>

export async function analyzeArchitecture(
  input: AnalyzeArchitectureInput
): Promise<AnalyzeArchitectureOutput> {
  return analyzeArchitectureFlow(input)
}

const prompt = ai.definePrompt({
  name: 'analyzeArchitecturePrompt',
  input: { schema: AnalyzeArchitectureInputSchema },
  output: { schema: AnalyzeArchitectureOutputSchema },
  prompt: `You are an expert software architect analyzing a repository structure.

Analyze the repository structure and identify the main architectural components and their relationships.

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

1. **Identify Components**: Based on file structure, dependencies, and README, identify major architectural components such as:
   - Frontend (React, Vue, Angular, etc.)
   - Backend/API (Express, FastAPI, etc.)
   - Database (schema, models, migrations)
   - AI/ML Models (training, inference)
   - Configuration (env, config files)
   - Testing (unit, integration tests)
   - Deployment (Docker, CI/CD)
   - Utils/Helpers (shared utilities)
   - Documentation

2. **Analyze Connections**: Determine how components interact with each other:
   - Frontend calls API endpoints
   - API connects to database
   - AI models are served via API
   - Config is used by multiple components

3. **Key Files**: For each component, identify 2-4 most important files that define it

4. **Technologies**: List the main technologies/frameworks used in each component

5. **Unique IDs**: Use simple, descriptive IDs like "frontend", "api", "database", etc.

Focus on the actual architecture based on the files present, not theoretical possibilities.`,
})

const analyzeArchitectureFlow = ai.defineFlow(
  {
    name: 'analyzeArchitectureFlow',
    inputSchema: AnalyzeArchitectureInputSchema,
    outputSchema: AnalyzeArchitectureOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input)
    return output!
  }
)
