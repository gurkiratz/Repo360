'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { AnalyzeArchitectureOutput } from '@/ai/flows'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Server,
  Globe,
  Database,
  Brain,
  Settings,
  TestTube,
  Rocket,
  Wrench,
  FileText,
  ArrowRight,
} from 'lucide-react'

const componentIcons = {
  frontend: Globe,
  backend: Server,
  api: Server,
  database: Database,
  ai_model: Brain,
  config: Settings,
  testing: TestTube,
  deployment: Rocket,
  utils: Wrench,
  docs: FileText,
}

const componentColors = {
  frontend:
    'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300',
  backend:
    'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300',
  api: 'bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900/20 dark:border-purple-700 dark:text-purple-300',
  database:
    'bg-orange-100 border-orange-300 text-orange-800 dark:bg-orange-900/20 dark:border-orange-700 dark:text-orange-300',
  ai_model:
    'bg-pink-100 border-pink-300 text-pink-800 dark:bg-pink-900/20 dark:border-pink-700 dark:text-pink-300',
  config:
    'bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-900/20 dark:border-gray-700 dark:text-gray-300',
  testing:
    'bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-700 dark:text-yellow-300',
  deployment:
    'bg-red-100 border-red-300 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300',
  utils:
    'bg-teal-100 border-teal-300 text-teal-800 dark:bg-teal-900/20 dark:border-teal-700 dark:text-teal-300',
  docs: 'bg-indigo-100 border-indigo-300 text-indigo-800 dark:bg-indigo-900/20 dark:border-indigo-700 dark:text-indigo-300',
}

interface ArchitectureDiagramProps {
  architecture: AnalyzeArchitectureOutput
  repoUrl: string
  defaultBranch: string
}

export function ArchitectureDiagram({
  architecture,
  repoUrl,
  defaultBranch,
}: ArchitectureDiagramProps) {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  )

  const getFileUrl = (filePath: string) => {
    return `${repoUrl}/blob/${defaultBranch}/${filePath}`
  }

  const getConnectedComponents = (componentId: string) => {
    const component = architecture.components.find((c) => c.id === componentId)
    if (!component) return []

    return component.connections
      .map((connectionId) =>
        architecture.components.find((c) => c.id === connectionId)
      )
      .filter(Boolean)
  }

  const renderConnection = (fromId: string, toId: string, index: number) => {
    return (
      <motion.div
        key={`${fromId}-${toId}`}
        className="absolute flex items-center text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        style={{
          // This is a simplified positioning - in a real implementation, you'd calculate actual positions
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <ArrowRight className="w-4 h-4 text-primary" />
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold font-headline">
          Architecture Overview
        </h3>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          {architecture.overview}
        </p>
      </div>

      {/* Main Flow */}
      <Card className="bg-accent/30">
        <CardContent className="p-6">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-primary" />
            Main Flow
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {architecture.mainFlow}
          </p>
        </CardContent>
      </Card>

      {/* Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {architecture.components.map((component, index) => {
          const Icon = componentIcons[component.type] || Wrench
          const colorClass =
            componentColors[component.type] || componentColors.utils

          return (
            <Dialog key={component.id}>
              <DialogTrigger asChild>
                <motion.div
                  className={`group cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-lg ${colorClass}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <Icon className="w-6 h-6 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-base mb-1">
                        {component.name}
                      </h4>
                      <p className="text-sm opacity-80 line-clamp-2">
                        {component.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {component.technologies.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {component.technologies.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{component.technologies.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="text-xs opacity-70">
                    {component.keyFiles.length} key files
                    {component.connections.length > 0 &&
                      ` • ${component.connections.length} connections`}
                  </div>
                </motion.div>
              </DialogTrigger>

              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Icon className="w-6 h-6" />
                    {component.name}
                  </DialogTitle>
                  <DialogDescription>{component.description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-6">
                  {/* Technologies */}
                  <div>
                    <h5 className="font-semibold mb-3">Technologies Used</h5>
                    <div className="flex flex-wrap gap-2">
                      {component.technologies.map((tech) => (
                        <Badge key={tech} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Key Files */}
                  <div>
                    <h5 className="font-semibold mb-3">
                      Key Files ({component.keyFiles.length})
                    </h5>
                    <div className="space-y-2">
                      {component.keyFiles.map((file) => (
                        <div
                          key={file}
                          className="flex items-center justify-between p-2 bg-accent/50 rounded border group"
                        >
                          <span className="font-mono text-sm">{file}</span>
                          <button
                            onClick={() =>
                              window.open(getFileUrl(file), '_blank')
                            }
                            className="opacity-0 group-hover:opacity-100 text-primary hover:text-primary/80 transition-all text-xs"
                          >
                            View →
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Connections */}
                  {component.connections.length > 0 && (
                    <div>
                      <h5 className="font-semibold mb-3">
                        Connected Components
                      </h5>
                      <div className="grid gap-2">
                        {getConnectedComponents(component.id).map(
                          (connectedComponent) => {
                            if (!connectedComponent) return null
                            const ConnectedIcon =
                              componentIcons[connectedComponent.type] || Wrench
                            return (
                              <div
                                key={connectedComponent.id}
                                className="flex items-center gap-3 p-2 bg-accent/30 rounded"
                              >
                                <ConnectedIcon className="w-4 h-4" />
                                <div>
                                  <span className="font-medium text-sm">
                                    {connectedComponent.name}
                                  </span>
                                  <p className="text-xs text-muted-foreground">
                                    {connectedComponent.description}
                                  </p>
                                </div>
                              </div>
                            )
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )
        })}
      </div>

      {/* Component Stats */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-4 px-4 py-2 bg-accent/30 rounded-lg border">
          <span className="text-sm text-muted-foreground">
            {architecture.components.length} components analyzed
          </span>
          <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
          <span className="text-sm text-muted-foreground">
            {architecture.components.reduce(
              (acc, c) => acc + c.keyFiles.length,
              0
            )}{' '}
            key files identified
          </span>
        </div>
      </div>
    </div>
  )
}
