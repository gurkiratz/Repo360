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
import { useState, useEffect } from 'react'
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
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileCode,
  KeyRound,
  ListChecks,
  ScanLine,
  Sparkles,
  X,
} from 'lucide-react'
import { WhatToReadFirstTool } from '@/components/tools/what-to-read-first-tool'
import { EnvVarScannerTool } from '@/components/tools/env-var-scanner-tool'
import { ArchitectureDiagram } from '@/components/architecture-diagram'
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

function extractImagesFromReadme(
  readmeContent: string,
  repoUrl: string,
  defaultBranch: string
) {
  const images: Array<{ src: string; alt: string }> = []

  // Match markdown image syntax: ![alt](url)
  const markdownImageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
  // Match HTML img tags: <img src="url" alt="alt">
  const htmlImageRegex =
    /<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*)["'])?[^>]*>/gi

  let match

  // Extract markdown images
  while ((match = markdownImageRegex.exec(readmeContent)) !== null) {
    const [, alt, src] = match
    images.push({
      src: convertToAbsoluteUrl(src, repoUrl, defaultBranch),
      alt: alt || 'README image',
    })
  }

  // Extract HTML images
  while ((match = htmlImageRegex.exec(readmeContent)) !== null) {
    const [, src, alt] = match
    images.push({
      src: convertToAbsoluteUrl(src, repoUrl, defaultBranch),
      alt: alt || 'README image',
    })
  }

  return images.slice(0, 3) // Limit to first 3 images to avoid clutter
}

function convertToAbsoluteUrl(
  imageSrc: string,
  repoUrl: string,
  defaultBranch: string
): string {
  // If already absolute URL, return as is
  if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
    return imageSrc
  }

  // Handle relative paths - convert to GitHub raw content URL
  if (
    imageSrc.startsWith('./') ||
    imageSrc.startsWith('../') ||
    !imageSrc.startsWith('/')
  ) {
    const cleanSrc = imageSrc.replace(/^\.\//, '')
    return `${repoUrl}/raw/${defaultBranch}/${cleanSrc}`
  }

  // Handle absolute paths from repo root
  return `${repoUrl}/raw/${defaultBranch}${imageSrc}`
}

export function AnalysisDisplay({ result }: { result: AnalysisResult }) {
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const getGithubFileUrl = (filePath: string) => {
    return `${result.repoUrl}/blob/${result.repoMetadata.defaultBranch}/${filePath}`
  }

  const readmeImages = extractImagesFromReadme(
    result.readmeContent,
    result.repoUrl,
    result.repoMetadata.defaultBranch
  )

  const openGallery = (index: number) => {
    setCurrentImageIndex(index)
    setGalleryOpen(true)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % readmeImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? readmeImages.length - 1 : prev - 1
    )
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!galleryOpen) return

      switch (e.key) {
        case 'ArrowRight':
          nextImage()
          break
        case 'ArrowLeft':
          prevImage()
          break
        case 'Escape':
          setGalleryOpen(false)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [galleryOpen])

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
                <BrainCircuit className="w-4 h-4" />
                Tech Stack
              </h4>
              <p className="text-base leading-relaxed pl-6">
                {result.summary.techStack}
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

            {/* README Images */}
            {readmeImages.length > 0 && (
              <div className="pt-4 border-t border-border/50">
                <h4 className="font-semibold text-primary mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Project Gallery
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 pl-6">
                  {readmeImages.map((image, index) => (
                    <div
                      key={index}
                      className="group relative cursor-pointer"
                      onClick={() => openGallery(index)}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-20 object-cover rounded-md border border-border/50 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:border-primary/50"
                        onError={(e) => {
                          // Hide image if it fails to load
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md flex items-center justify-center">
                        <div className="bg-black/60 rounded-full p-1"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

        {/* Architecture Diagram Section */}
        <div className="mt-12">
          <Card className="bg-gradient-to-br from-primary/5 via-accent/20 to-secondary/10 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-headline flex items-center justify-center gap-3">
                <BrainCircuit className="w-8 h-8 text-primary animate-pulse" />
                Repository Architecture
              </CardTitle>
              <CardDescription className="text-base">
                AI-analyzed components and their relationships
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <ArchitectureDiagram
                architecture={result.architecture}
                repoUrl={result.repoUrl}
                defaultBranch={result.repoMetadata.defaultBranch}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image Gallery Modal */}
      {galleryOpen && readmeImages.length > 0 && (
        <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <div className="relative">
              {/* Close button */}
              <button
                onClick={() => setGalleryOpen(false)}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Navigation buttons */}
              {readmeImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Main image */}
              <div className="flex items-center justify-center bg-black/5 min-h-[60vh]">
                <img
                  src={readmeImages[currentImageIndex]?.src}
                  alt={readmeImages[currentImageIndex]?.alt}
                  className="max-w-full max-h-[80vh] object-contain"
                />
              </div>

              {/* Image info */}
              {readmeImages[currentImageIndex]?.alt &&
                readmeImages[currentImageIndex]?.alt !== 'README image' && (
                  <div className="p-4 bg-white border-t">
                    <p className="text-center text-sm text-muted-foreground">
                      {readmeImages[currentImageIndex]?.alt}
                    </p>
                  </div>
                )}

              {/* Image counter */}
              {readmeImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} of {readmeImages.length}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
