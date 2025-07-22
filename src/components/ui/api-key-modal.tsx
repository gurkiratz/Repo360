'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  AlertTriangle,
  Eye,
  EyeOff,
  ExternalLink,
  Star,
  Heart,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ApiKeyModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (apiKey: string) => void
  currentKey?: string
}

export function ApiKeyModal({
  isOpen,
  onClose,
  onSave,
  currentKey,
}: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState(currentKey || '')
  const [showKey, setShowKey] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      setApiKey(currentKey || '')
    }
  }, [isOpen, currentKey])

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        variant: 'destructive',
        title: 'Invalid API Key',
        description: 'Please enter a valid Google AI Studio API key.',
      })
      return
    }

    onSave(apiKey.trim())
    onClose()

    toast({
      title: 'API Key Saved',
      description:
        'Your API key has been saved locally and will be used for AI analysis.',
    })
  }

  const handleClear = () => {
    setApiKey('')
    onSave('')
    onClose()

    toast({
      title: 'API Key Cleared',
      description:
        'Your API key has been removed. The app will try to use environment variables.',
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {/* <AlertTriangle className="w-5 h-5 text-orange-500" /> */}
            Set your Google AI Studio API Key
          </DialogTitle>
          <DialogDescription className="text-left space-y-2">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                😃️ Client-Only Processing
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Your API key is stored locally in your browser and sent directly
                to Google AI. This app processes everything client-side - no
                server storage
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/20 p-3 rounded-md border border-gray-200 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-1">
                <Heart className="w-4 h-4" />
                Support This Project
              </p>
              <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">
                I'm broke and this app runs on your API keys! If this tool helps
                you, please consider:
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() =>
                  window.open('https://github.com/gurkiratz/Repo360', '_blank')
                }
              >
                <Star className="w-3 h-3 mr-1 text-yellow-500" />
                Star the repo on GitHub
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Your Google AI Studio API Key</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key..."
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Don't have one?{' '}
              <Button
                variant="link"
                className="p-0 h-auto text-xs underline"
                onClick={() =>
                  window.open(
                    'https://aistudio.google.com/app/apikey',
                    '_blank'
                  )
                }
              >
                Get your free API key from Google AI Studio
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              Save API Key
            </Button>
            {currentKey && (
              <Button variant="outline" onClick={handleClear}>
                Clear
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
