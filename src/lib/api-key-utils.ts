// Client-side utility functions for API key management

export function getClientApiKey(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('google-ai-api-key')
}

export function setClientApiKey(apiKey: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('google-ai-api-key', apiKey)
}

export function removeClientApiKey(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('google-ai-api-key')
}

export function getEffectiveApiKey(userApiKey?: string): string | undefined {
  // Priority: user-provided > environment variable
  if (userApiKey) return userApiKey

  // On server, use environment variable
  if (typeof window === 'undefined') {
    return process.env.GOOGLE_GENAI_API_KEY
  }

  // On client, get from localStorage first, then fallback to env (though env won't be available on client)
  const clientKey = getClientApiKey()
  if (clientKey) return clientKey

  return undefined
}

export function isApiKeyError(error: Error): boolean {
  const errorMessage = error.message.toLowerCase()
  return (
    errorMessage.includes('api key') ||
    errorMessage.includes('authentication') ||
    errorMessage.includes('unauthorized') ||
    errorMessage.includes('invalid_api_key') ||
    errorMessage.includes('permission denied') ||
    errorMessage.includes('quota exceeded')
  )
}
