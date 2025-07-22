import { genkit } from 'genkit'
import { googleAI } from '@genkit-ai/googleai'
import { getEffectiveApiKey } from '@/lib/api-key-utils'

// Create AI instance with dynamic API key support
export function createAIInstance(userApiKey?: string) {
  const apiKey = getEffectiveApiKey(userApiKey)

  if (!apiKey) {
    throw new Error(
      'No Google AI API key available. Please set GOOGLE_GENAI_API_KEY environment variable or provide a user API key.'
    )
  }

  return genkit({
    plugins: [
      googleAI({
        apiKey: apiKey,
      }),
    ],
    model: 'googleai/gemini-2.0-flash',
  })
}

// Default AI instance using environment variables (for backward compatibility)
export const defaultAI = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
})

// Export the function to get the right AI instance
export function getAI(userApiKey?: string) {
  try {
    if (userApiKey || !process.env.GOOGLE_GENAI_API_KEY) {
      return createAIInstance(userApiKey)
    }
    return defaultAI
  } catch (error) {
    // If creating dynamic instance fails, try default one
    if (!userApiKey && process.env.GOOGLE_GENAI_API_KEY) {
      return defaultAI
    }
    throw error
  }
}
