'use server'

import {
  analyzeArchitecture,
  analyzeContributingSteps,
  summarizeRepo,
  suggestEntryPoints,
  explainFiles,
  scanEnvVars,
  classifyFilePurpose,
} from '@/ai/flows'
import type {
  AnalyzeArchitectureOutput,
  AnalyzeContributingStepsOutput,
  SummarizeRepoOutput,
  SuggestEntryPointsOutput,
  ExplainFilesOutput,
  ScanEnvVarsOutput,
  ClassifyFilePurposeOutput,
} from '@/ai/flows'
import { fetchRepoData, fetchFileContent } from '@/services/github'

export type AnalysisResult = {
  repoUrl: string
  summary: SummarizeRepoOutput
  entryPoints: SuggestEntryPointsOutput
  explanations: ExplainFilesOutput
  architecture: AnalyzeArchitectureOutput
  contributingSteps: AnalyzeContributingStepsOutput
  fileList: string[]
  envExampleContent: string | null
  readmeContent: string
  repoMetadata: {
    defaultBranch: string
    updatedAt: string
    language: string | null
    stargazersCount: number
  }
}

export async function analyzeRepoAction({
  repoUrl,
  userApiKey,
}: {
  repoUrl: string
  userApiKey?: string
}): Promise<AnalysisResult | null> {
  try {
    const {
      repoMetadata,
      readmeContent,
      packageJsonContent,
      fileList,
      envExampleContent,
    } = await fetchRepoData(repoUrl)

    // 1. Summarize the repo
    const summary = await summarizeRepo(
      {
        repoUrl,
        readmeContent,
        packageJsonContent,
      },
      userApiKey
    )

    // 2. Suggest entry points
    const entryPoints = await suggestEntryPoints(
      {
        repoUrl,
        readmeContent,
        packageJsonContent,
        fileList,
      },
      userApiKey
    )

    if (!entryPoints?.suggestedFiles?.length) {
      throw new Error('AI could not determine entry points.')
    }

    // 3. Explain the major files
    const explanations = await explainFiles(
      {
        repoUrl,
        fileList: entryPoints.suggestedFiles,
      },
      userApiKey
    )

    // 4. Analyze the architecture
    const architecture = await analyzeArchitecture(
      {
        repoUrl,
        readmeContent,
        packageJsonContent,
        fileList,
      },
      userApiKey
    )

    // 5. Analyze contributing steps
    const contributingSteps = await analyzeContributingSteps(
      {
        repoUrl,
        readmeContent,
        packageJsonContent,
        fileList,
      },
      userApiKey
    )

    return {
      repoUrl,
      summary,
      entryPoints,
      explanations,
      architecture,
      contributingSteps,
      fileList,
      envExampleContent,
      readmeContent,
      repoMetadata,
    }
  } catch (error) {
    console.error('Analysis failed:', error)
    // Re-throwing the error to be handled by the client
    if (error instanceof Error) {
      throw new Error(`Analysis failed: ${error.message}`)
    }
    throw new Error('An unknown error occurred during AI analysis.')
  }
}

export async function scanEnvVarsAction({
  repoUrl,
  envFileContent,
  userApiKey,
}: {
  repoUrl: string
  envFileContent: string | null
  userApiKey?: string
}): Promise<ScanEnvVarsOutput> {
  if (!envFileContent) {
    return { variableExplanations: [] }
  }
  return await scanEnvVars({ envFileContent }, userApiKey)
}

export async function classifyFilePurposeAction({
  repoUrl,
  fileName,
  userApiKey,
}: {
  repoUrl: string
  fileName: string
  userApiKey?: string
}): Promise<ClassifyFilePurposeOutput> {
  const fileContent = await fetchFileContent(repoUrl, fileName)
  return await classifyFilePurpose({ fileName, fileContent }, userApiKey)
}

export {
  analyzeArchitecture,
  analyzeContributingSteps,
  summarizeRepo,
  suggestEntryPoints,
  explainFiles,
  scanEnvVars,
  classifyFilePurpose,
}
export type {
  AnalyzeArchitectureOutput,
  AnalyzeContributingStepsOutput,
  SummarizeRepoOutput,
  SuggestEntryPointsOutput,
  ExplainFilesOutput,
  ScanEnvVarsOutput,
  ClassifyFilePurposeOutput,
}
