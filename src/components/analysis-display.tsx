'use client'

import type { AnalysisResult } from '@/app/actions'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  BrainCircuit,
  ExternalLink,
  FileCode,
  KeyRound,
  ListChecks,
  ScanLine,
  Sparkles,
} from 'lucide-react'
import { WhatToReadFirstTool } from '@/components/tools/what-to-read-first-tool'
import { EnvVarScannerTool } from '@/components/tools/env-var-scanner-tool'
import { FilePurposeClassifierTool } from '@/components/tools/file-purpose-classifier-tool'

function ToolCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
            <div className="bg-accent p-3 rounded-full">{icon}</div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] lg:max-w-[1200px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {icon} {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export function AnalysisDisplay({ result }: { result: AnalysisResult }) {
  const getGithubFileUrl = (filePath: string) => {
    return `${result.repoUrl}/blob/${result.repoMetadata.defaultBranch}/${filePath}`
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="space-y-8">
        <Card className="bg-accent border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center gap-2">
              AI Summary
            </CardTitle>
            <CardDescription>
              A high-level overview of{' '}
              <a
                href={result.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                {result.repoUrl}
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Purpose
              </h4>
              <p className="text-base leading-relaxed pl-6">
                {result.summary.purpose}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                <ListChecks className="w-4 h-4" />
                How to Run
              </h4>
              <p className="text-base leading-relaxed pl-6">
                {result.summary.howToRun}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4" />
                Tech Stack
              </h4>
              <p className="text-base leading-relaxed pl-6">
                {result.summary.techStack}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                <FileCode className="w-4 h-4" />
                Entry Points
              </h4>
              <p className="leading-relaxed pl-6 font-mono text-sm">
                {result.summary.entryPoints
                  .split(',')
                  .map((entry) => entry.trim())
                  .join(', ')}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="mb-4">
              <h3 className="text-2xl font-bold font-headline flex items-center gap-2 mb-1">
                <FileCode /> What Should I Read First?
              </h3>
              <p className="text-base text-muted-foreground">
                Here are the{' '}
                <span className="text-primary font-semibold">
                  {result.explanations.explanations.length}
                </span>{' '}
                files that matter most — click to explore!
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {result.explanations.explanations.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full group">
                      <span className="font-mono text-primary text-left">
                        {item.file}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 gap-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(getGithubFileUrl(item.file), '_blank')
                        }}
                      >
                        <ExternalLink className="w-3 h-3" />
                        Source
                      </Button>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>{item.explanation}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4 font-headline flex items-center gap-2">
              <BrainCircuit /> Explore Deeper
            </h3>
            <div className="grid gap-4">
              {/* <ToolCard
                icon={<ListChecks className="w-6 h-6 text-primary" />}
                title="What Should I Read First?"
                description="AI-prioritized list of files to understand this repo quickly."
              >
                <WhatToReadFirstTool
                  entryPoints={result.entryPoints}
                  repoUrl={result.repoUrl}
                  defaultBranch={result.repoMetadata.defaultBranch}
                />
              </ToolCard> */}
              <ToolCard
                icon={<ScanLine className="w-6 h-6 text-primary" />}
                title="File Purpose Classifier"
                description="Get a natural language explanation of what any file does."
              >
                <FilePurposeClassifierTool
                  repoUrl={result.repoUrl}
                  fileList={result.fileList}
                />
              </ToolCard>
              <ToolCard
                icon={<KeyRound className="w-6 h-6 text-primary" />}
                title="Environment Variable Scanner"
                description="Detect and understand the purpose of all .env variables."
              >
                <EnvVarScannerTool
                  repoUrl={result.repoUrl}
                  envFileContent={result.envExampleContent}
                />
              </ToolCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
