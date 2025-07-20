'use server'

import {
  analyzeArchitecture,
  summarizeRepo,
  suggestEntryPoints,
  explainFiles,
  scanEnvVars,
  classifyFilePurpose,
} from '@/ai/flows'
import type {
  AnalyzeArchitectureOutput,
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
}: {
  repoUrl: string
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
    const summary = await summarizeRepo({
      repoUrl,
      readmeContent,
      packageJsonContent,
    })

    // 2. Suggest entry points
    const entryPoints = await suggestEntryPoints({
      repoUrl,
      readmeContent,
      packageJsonContent,
      fileList,
    })

    if (!entryPoints?.suggestedFiles?.length) {
      throw new Error('AI could not determine entry points.')
    }

    // 3. Explain the major files
    const explanations = await explainFiles({
      repoUrl,
      fileList: entryPoints.suggestedFiles,
    })

    // 4. Analyze the architecture
    const architecture = await analyzeArchitecture({
      repoUrl,
      readmeContent,
      packageJsonContent,
      fileList,
    })

    return {
      repoUrl,
      summary,
      entryPoints,
      explanations,
      architecture,
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
}: {
  repoUrl: string
  envFileContent: string | null
}): Promise<ScanEnvVarsOutput> {
  if (!envFileContent) {
    return { variableExplanations: [] }
  }
  return await scanEnvVars({ envFileContent })
}

export async function classifyFilePurposeAction({
  repoUrl,
  fileName,
}: {
  repoUrl: string
  fileName: string
}): Promise<ClassifyFilePurposeOutput> {
  const fileContent = await fetchFileContent(repoUrl, fileName)
  return await classifyFilePurpose({ fileName, fileContent })
}

export {
  analyzeArchitecture,
  summarizeRepo,
  suggestEntryPoints,
  explainFiles,
  scanEnvVars,
  classifyFilePurpose,
}
export type {
  AnalyzeArchitectureOutput,
  SummarizeRepoOutput,
  SuggestEntryPointsOutput,
  ExplainFilesOutput,
  ScanEnvVarsOutput,
  ClassifyFilePurposeOutput,
}
