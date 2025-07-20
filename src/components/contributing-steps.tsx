'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { AnalyzeContributingStepsOutput } from '@/ai/flows'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  CheckCircle,
  Clock,
  Copy,
  GitFork,
  Terminal,
  Users,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Wrench,
  TestTube,
  FileText,
  Rocket,
  Settings,
} from 'lucide-react'

const stepIcons = {
  setup: GitFork,
  development: Terminal,
  testing: TestTube,
  deployment: Rocket,
  documentation: FileText,
}

const difficultyColors = {
  Easy: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700',
  Moderate:
    'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700',
  Advanced:
    'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700',
}

interface ContributingStepsProps {
  contributingSteps: AnalyzeContributingStepsOutput
  repoUrl: string
}

export function ContributingSteps({
  contributingSteps,
  repoUrl,
}: ContributingStepsProps) {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null)
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set())

  const copyToClipboard = async (text: string, stepId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCommand(stepId)
      setTimeout(() => setCopiedCommand(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const toggleStep = (stepId: string) => {
    const newExpanded = new Set(expandedSteps)
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId)
    } else {
      newExpanded.add(stepId)
    }
    setExpandedSteps(newExpanded)
  }

  if (!contributingSteps.developmentPossible) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold font-headline mb-2">
            Contributing Guide
          </h3>
          <p className="text-muted-foreground">Development setup analysis</p>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-base">
            <strong>Local development may not be possible</strong> for this
            repository.
            {contributingSteps.additionalNotes && (
              <span className="block mt-2">
                {contributingSteps.additionalNotes}
              </span>
            )}
          </AlertDescription>
        </Alert>

        {contributingSteps.prerequisites.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {contributingSteps.prerequisites.map((prereq, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                    {prereq}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Difficulty & Time Banner */}
      <div className="flex justify-center gap-4 flex-wrap">
        <Badge
          className={`px-3 py-1 ${
            difficultyColors[contributingSteps.difficulty]
          }`}
        >
          {contributingSteps.difficulty} Setup
        </Badge>
        <Badge variant="outline" className="px-3 py-1 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {contributingSteps.estimatedSetupTime}
        </Badge>
        <Badge variant="outline" className="px-3 py-1 flex items-center gap-1">
          <Users className="w-3 h-3" />
          {contributingSteps.steps.length} Steps
        </Badge>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Button
          onClick={() => window.open(`${repoUrl}/fork`, '_blank')}
          className="gap-2"
        >
          <GitFork className="w-4 h-4" />
          Fork Repository
        </Button>
        <Button
          onClick={() => window.open(`${repoUrl}/issues`, '_blank')}
          variant="outline"
          className="gap-2 ml-2"
        >
          <AlertTriangle className="w-4 h-4" />
          View Issues
        </Button>
      </div>

      {/* Prerequisites */}
      {contributingSteps.prerequisites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="w-5 h-5" />
              Prerequisites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {contributingSteps.prerequisites.map((prereq, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3 p-2 rounded bg-accent/30"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                  <span className="text-sm">{prereq}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Steps */}
      <div className="space-y-3 grid grid-cols-2 gap-2">
        {contributingSteps.steps.map((step, index) => {
          const Icon = stepIcons[step.type] || Wrench
          const isExpanded = expandedSteps.has(step.id)

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card
                className={`transition-all duration-200 ${
                  isExpanded ? 'border-primary/30 bg-primary/5' : ''
                }`}
              >
                <Collapsible
                  open={isExpanded}
                  onOpenChange={() => toggleStep(step.id)}
                >
                  <CollapsibleTrigger asChild>
                    <div className="cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                              {index + 1}
                            </div>
                            <Icon className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold">{step.title}</h4>
                                {!step.required && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Optional
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {step.estimatedTime}
                              </p>
                            </div>
                          </div>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      </CardHeader>
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="pl-11 space-y-3">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>

                        {step.command && (
                          <div className="relative">
                            <div className="flex items-center justify-between bg-muted/50 rounded-md p-3 font-mono text-sm border">
                              <span className="flex-1 pr-2">
                                {step.command}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  copyToClipboard(step.command!, step.id)
                                }}
                              >
                                {copiedCommand === step.id ? (
                                  <CheckCircle className="w-3 h-3" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Additional Notes */}
      {contributingSteps.additionalNotes && (
        <Card className="bg-accent/30 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-sm mb-1">Additional Notes</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {contributingSteps.additionalNotes}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
