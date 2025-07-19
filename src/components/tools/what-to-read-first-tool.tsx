'use client'

import { useState } from 'react'
import type { SuggestEntryPointsOutput } from '@/ai/flows'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ExternalLink, FileCode, LoaderCircle, Sparkles } from 'lucide-react'
import {
  classifyFilePurposeAction,
  type ClassifyFilePurposeOutput,
} from '@/app/actions'

interface FileWithDetails {
  path: string
  classification?: ClassifyFilePurposeOutput
  isLoading?: boolean
}

export function WhatToReadFirstTool({
  entryPoints,
  repoUrl,
  defaultBranch = 'main',
}: {
  entryPoints: SuggestEntryPointsOutput
  repoUrl?: string
  defaultBranch?: string
}) {
  const [filesWithDetails, setFilesWithDetails] = useState<FileWithDetails[]>(
    entryPoints.suggestedFiles.map((file) => ({ path: file }))
  )

  const loadFileDetails = async (filePath: string, index: number) => {
    if (
      filesWithDetails[index].classification ||
      filesWithDetails[index].isLoading
    ) {
      return // Already loaded or loading
    }

    // Set loading state
    setFilesWithDetails((prev) =>
      prev.map((file, i) => (i === index ? { ...file, isLoading: true } : file))
    )

    try {
      const classification = await classifyFilePurposeAction({
        repoUrl: repoUrl || '',
        fileName: filePath,
      })

      setFilesWithDetails((prev) =>
        prev.map((file, i) =>
          i === index ? { ...file, classification, isLoading: false } : file
        )
      )
    } catch (error) {
      setFilesWithDetails((prev) =>
        prev.map((file, i) =>
          i === index ? { ...file, isLoading: false } : file
        )
      )
      console.error('Failed to classify file:', error)
    }
  }

  const getGithubFileUrl = (filePath: string) => {
    if (!repoUrl) return '#'
    return `${repoUrl}/blob/${defaultBranch}/${filePath}`
  }

  const getImportanceColor = (importance?: string) => {
    switch (importance) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Important':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Standard':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Supporting':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-accent text-accent-foreground'
    }
  }

  return (
    <div className="mt-4 space-y-6">
      {/* Header with file count */}
      <div className="flex items-center gap-3 mb-2">
        <FileCode className="w-6 h-6 text-primary" />
        <div>
          <h4 className="font-semibold text-xl mb-1">
            Here are the{' '}
            <span className="text-primary font-bold">
              {entryPoints.suggestedFiles.length}
            </span>{' '}
            files that matter most — click to explore!
          </h4>
          <p className="text-sm text-muted-foreground">
            Click on any file to see its purpose and importance in the codebase
          </p>
        </div>
      </div>

      {/* File list */}
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {filesWithDetails.map((fileData, index) => (
          <TooltipProvider key={fileData.path}>
            <Card
              className="hover:border-primary/50 transition-all duration-200 cursor-pointer group"
              onClick={() => loadFileDetails(fileData.path, index)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-6">
                  {/* Left side - Priority badge and file info */}
                  <div className="flex items-center gap-6 flex-1 min-w-0">
                    <Badge
                      variant="default"
                      className="flex-shrink-0 text-base font-medium px-3 py-1"
                    >
                      {index + 1}
                    </Badge>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-base font-semibold">
                          {fileData.path.split('/').pop()}
                        </span>
                        {fileData.classification?.tag && (
                          <Badge
                            variant="outline"
                            className={`text-sm font-medium px-2 py-1 ${getImportanceColor(
                              fileData.classification.importance
                            )}`}
                          >
                            {fileData.classification.tag}
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {fileData.path}
                      </div>
                    </div>
                  </div>

                  {/* Right side - Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {fileData.isLoading && (
                      <LoaderCircle className="w-4 h-4 animate-spin text-muted-foreground" />
                    )}

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="default"
                          className="gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(
                              getGithubFileUrl(fileData.path),
                              '_blank'
                            )
                          }}
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open in source
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View this file on GitHub</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                {/* Description on click */}
                {fileData.classification?.purpose && (
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-base text-muted-foreground leading-relaxed">
                        {fileData.classification.purpose}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TooltipProvider>
        ))}
      </div>

      {/* AI Reasoning */}
      <div className="mt-8 p-6 bg-accent/50 rounded-lg border border-accent">
        <h4 className="font-semibold text-base mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Reasoning
        </h4>
        <p className="text-base text-muted-foreground leading-relaxed">
          {entryPoints.reasoning}
        </p>
      </div>
    </div>
  )
}
