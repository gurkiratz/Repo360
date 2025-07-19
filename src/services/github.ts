'use server'

import { Octokit } from '@octokit/rest'

if (!process.env.GITHUB_TOKEN) {
  console.warn(
    'GITHUB_TOKEN is not set. GitHub API requests will be unauthenticated and subject to lower rate limits.'
  )
}

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

function parseRepoUrl(repoUrl: string): { owner: string; repo: string } {
  try {
    const url = new URL(repoUrl)
    if (url.hostname !== 'github.com') {
      throw new Error('Invalid GitHub URL')
    }
    const [owner, repo] = url.pathname.slice(1).split('/')
    if (!owner || !repo) {
      throw new Error('Invalid GitHub repository path')
    }
    return { owner, repo }
  } catch (error) {
    throw new Error(
      'Invalid repository URL format. Expected https://github.com/owner/repo'
    )
  }
}

async function getRepoContent(
  owner: string,
  repo: string,
  path: string
): Promise<any> {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    })
    return data
  } catch (error) {
    // If file not found, return null instead of throwing an error
    // @ts-ignore
    if (error.status === 404) {
      return null
    }
    throw error
  }
}

async function getFileContent(
  owner: string,
  repo: string,
  path: string
): Promise<string | null> {
  const content = await getRepoContent(owner, repo, path)
  if (!content || !content.content) {
    return null
  }
  return Buffer.from(content.content, 'base64').toString('utf-8')
}

async function getRepoMetadata(owner: string, repo: string) {
  const { data } = await octokit.repos.get({ owner, repo })
  return {
    defaultBranch: data?.default_branch,
    updatedAt: data.updated_at,
    language: data.language,
    stargazersCount: data.stargazers_count,
  }
}

export async function fetchRepoData(repoUrl: string) {
  const { owner, repo } = parseRepoUrl(repoUrl)

  // Fetch repo metadata and file contents in parallel
  const [
    repoMetadata,
    readmeContent,
    packageJsonContent,
    rootFiles,
    envExampleContent,
  ] = await Promise.all([
    getRepoMetadata(owner, repo),
    getFileContent(owner, repo, 'README.md'),
    getFileContent(owner, repo, 'package.json'),
    getRepoContent(owner, repo, ''),
    getFileContent(owner, repo, '.env.example'),
  ])

  const fileList = Array.isArray(rootFiles)
    ? rootFiles.map((file: any) => file.path)
    : []

  return {
    owner,
    repo,
    repoMetadata,
    readmeContent: readmeContent ?? 'No README.md found.',
    packageJsonContent: packageJsonContent ?? '{}',
    fileList,
    envExampleContent,
  }
}

export async function fetchFileContent(
  repoUrl: string,
  filePath: string
): Promise<string> {
  const { owner, repo } = parseRepoUrl(repoUrl)
  const content = await getFileContent(owner, repo, filePath)
  return content ?? `File not found: ${filePath}`
}
