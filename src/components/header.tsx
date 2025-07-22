'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Key, Github, Star, Rotate3DIcon } from 'lucide-react'
import { ApiKeyModal } from '@/components/ui/api-key-modal'
import { motion } from 'framer-motion'
import Link from 'next/link'

export function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [hasApiKey, setHasApiKey] = useState(false)

  // Check if user has saved an API key
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('google-ai-api-key')
      setHasApiKey(!!savedKey)
    }
  }, [])

  const handleSaveApiKey = (apiKey: string) => {
    if (typeof window !== 'undefined') {
      if (apiKey) {
        localStorage.setItem('google-ai-api-key', apiKey)
        setHasApiKey(true)
      } else {
        localStorage.removeItem('google-ai-api-key')
        setHasApiKey(false)
      }
    }
  }

  const getCurrentApiKey = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('google-ai-api-key') || ''
    }
    return ''
  }

  return (
    <motion.header
      className="border-b sticky top-0 bg-background z-50"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo and branding */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              <Rotate3DIcon className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="text-2xl font-bold tracking-tight font-game text-glow">
              Repo360
            </h1>
          </Link>
          <Badge variant="secondary" className="text-xs ml-2">
            AI-Powered
          </Badge>
        </motion.div>

        {/* Right side buttons */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        >
          {/* GitHub Star Button */}
          <Button variant="ghost" size="sm" className="hidden sm:flex" asChild>
            <Link
              href="https://github.com/gurkiratz/Repo360"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* <Github className="h-5 w-5" /> */}
              <Star className="w-5 h-5" />
              Star on GitHub
            </Link>
          </Button>

          {/* API Key Button - Minimal */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className={`gap-1 ${
              !hasApiKey ? 'text-destructive hover:text-destructive' : ''
            }`}
          >
            <Key className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">
              {hasApiKey ? '✓' : 'API'}
            </span>
          </Button>
        </motion.div>
      </div>

      <ApiKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveApiKey}
        currentKey={getCurrentApiKey()}
      />
    </motion.header>
  )
}
