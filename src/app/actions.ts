'use server';

import { 
  summarizeRepo,
  suggestEntryPoints,
  explainFiles,
  scanEnvVars,
  classifyFilePurpose,
} from '@/ai/flows';
import type { SummarizeRepoOutput, SuggestEntryPointsOutput, ExplainFilesOutput, ScanEnvVarsOutput, ClassifyFilePurposeOutput } from '@/ai/flows';

// MOCK DATA for demonstration as we can't fetch from GitHub API directly
const MOCK_README = `# RepoAI: AI-Powered Repository Summarizer

This is a sample README for a project that analyzes GitHub repositories. This app itself is a Next.js application built with TypeScript, Tailwind CSS, and ShadCN UI components. It uses Genkit for its AI flows.

## Features
- Fetches repo data
- Summarizes using AI
- Explains files
`;

const MOCK_PACKAGE_JSON = `
{
  "name": "repo-ai-demo",
  "version": "1.0.0",
  "description": "A demo repository for RepoAI.",
  "main": "src/app/page.tsx",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "react": "^18.3.1",
    "next": "15.3.3",
    "lucide-react": "latest"
  },
  "devDependencies": {
    "typescript": "^5",
    "tailwindcss": "^3.4.1"
  }
}
`;

const MOCK_FILE_LIST = [
  'src/app/page.tsx',
  'src/app/layout.tsx',
  'src/app/actions.ts',
  'src/components/analysis-display.tsx',
  'package.json',
  'README.md',
  '.env.example'
];

const MOCK_FILE_CONTENTS: Record<string, string> = {
    'src/app/page.tsx': 'export default function Home() { return <h1>Welcome</h1>; }',
    'src/app/layout.tsx': 'export default function RootLayout({ children }) { return <html><body>{children}</body></html>; }',
    'src/app/actions.ts': '"use server"; export async function myAction() {}',
    'src/components/analysis-display.tsx': 'export function AnalysisDisplay() { return <div>Results</div>; }',
    'package.json': MOCK_PACKAGE_JSON,
    'README.md': MOCK_README,
    '.env.example': 'API_KEY=your_api_key_here\nDATABASE_URL=your_database_url_here\nNEXT_PUBLIC_ANALYTICS_ID=your_analytics_id'
};


export type AnalysisResult = {
  repoUrl: string;
  summary: SummarizeRepoOutput;
  entryPoints: SuggestEntryPointsOutput;
  explanations: ExplainFilesOutput;
  fileList: string[];
};

export async function analyzeRepoAction({ repoUrl }: { repoUrl: string }): Promise<AnalysisResult | null> {
  try {
    // In a real app, you'd fetch this data from the GitHub API
    // For this demo, we use mock data.
    
    // 1. Summarize the repo
    const summary = await summarizeRepo({ repoUrl });

    // 2. Suggest entry points
    const entryPoints = await suggestEntryPoints({
      repoUrl,
      readmeContent: MOCK_README,
      packageJsonContent: MOCK_PACKAGE_JSON,
      fileList: MOCK_FILE_LIST,
    });
    
    if (!entryPoints?.suggestedFiles?.length) {
      throw new Error('AI could not determine entry points.');
    }

    // 3. Explain the major files
    const explanations = await explainFiles({
      repoUrl,
      fileList: entryPoints.suggestedFiles,
    });

    return {
      repoUrl,
      summary,
      entryPoints,
      explanations,
      fileList: MOCK_FILE_LIST,
    };
  } catch (error) {
    console.error("Analysis failed:", error);
    // Re-throwing the error to be handled by the client
    if (error instanceof Error) {
      throw new Error(`AI analysis failed: ${error.message}`);
    }
    throw new Error('An unknown error occurred during AI analysis.');
  }
}

export async function scanEnvVarsAction(): Promise<ScanEnvVarsOutput> {
    const envFileContent = MOCK_FILE_CONTENTS['.env.example'] || '';
    if (!envFileContent) {
        return { variableExplanations: [] };
    }
    return await scanEnvVars({ envFileContent });
}

export async function classifyFilePurposeAction({ fileName }: { fileName: string }): Promise<ClassifyFilePurposeOutput> {
    const fileContent = MOCK_FILE_CONTENTS[fileName] || '';
    return await classifyFilePurpose({ fileName, fileContent });
}

export { summarizeRepo, suggestEntryPoints, explainFiles, scanEnvVars, classifyFilePurpose };
export type { SummarizeRepoOutput, SuggestEntryPointsOutput, ExplainFilesOutput, ScanEnvVarsOutput, ClassifyFilePurposeOutput };
