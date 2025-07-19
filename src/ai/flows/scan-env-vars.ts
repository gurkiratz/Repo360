'use server';

/**
 * @fileOverview This file defines a Genkit flow to scan a repository for .env variables and explain their purpose.
 *
 * - scanEnvVars - A function that scans for environment variables and explains their purpose.
 * - ScanEnvVarsInput - The input type for the scanEnvVars function.
 * - ScanEnvVarsOutput - The return type for the scanEnvVars function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScanEnvVarsInputSchema = z.object({
  envFileContent: z
    .string()
    .describe('The content of the .env file to scan for variables.'),
});
export type ScanEnvVarsInput = z.infer<typeof ScanEnvVarsInputSchema>;

const ScanEnvVarsOutputSchema = z.object({
  variableExplanations: z.array(
    z.object({
      variableName: z.string().describe('The name of the environment variable.'),
      explanation: z.string().describe('The AI-generated explanation of the variable.'),
    })
  ).describe('An array of explanations for each environment variable found.'),
});
export type ScanEnvVarsOutput = z.infer<typeof ScanEnvVarsOutputSchema>;

export async function scanEnvVars(input: ScanEnvVarsInput): Promise<ScanEnvVarsOutput> {
  return scanEnvVarsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scanEnvVarsPrompt',
  input: {schema: ScanEnvVarsInputSchema},
  output: {schema: ScanEnvVarsOutputSchema},
  prompt: `You are an AI assistant that explains the purpose of environment variables in a .env file.

  Given the content of a .env file, identify each variable and provide a concise explanation of its purpose within the application.

  .env file content:
  {{envFileContent}}
  
  Format your answer as a JSON array of objects with variableName and explanation fields.
  `,
});

const scanEnvVarsFlow = ai.defineFlow(
  {
    name: 'scanEnvVarsFlow',
    inputSchema: ScanEnvVarsInputSchema,
    outputSchema: ScanEnvVarsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
