'use client'

import { useState } from 'react'
import { z } from 'zod'
import { Github, LoaderCircle, Sparkles, Rotate3DIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import * as Form from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { analyzeRepoAction, type AnalysisResult } from '@/app/actions'
import { AnalysisDisplay } from '@/components/analysis-display'
import Link from 'next/link'

const formSchema = z.object({
  repoUrl: z.string().url(),
  // .regex(/^https:\/\/github\.com\/[\w-]+\/[\w-]+$/, 'Please enter a valid GitHub repository URL.'),
})

type FormValues = z.infer<typeof formSchema>

function Header() {
  return (
    <motion.header
      className="border-b sticky top-0 bg-background z-50"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div
          className="flex items-center gap-2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
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
          ></motion.div>
          <Rotate3DIcon className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight font-game text-glow">
            Repo360
          </h1>
        </motion.div>
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        >
          <Button variant="ghost" asChild>
            <Link
              href="https://github.com/gurkiratz/Repo360"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-5 w-5" />
              Star on GitHub
            </Link>
          </Button>
        </motion.div>
      </div>
    </motion.header>
  )
}

function RepoForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (data: FormValues) => void
  isSubmitting: boolean
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      repoUrl: '',
    },
  })

  const exampleRepos = [
    {
      name: 'Warp',
      url: 'https://github.com/warpdotdev/Warp',
      description:
        'An AI-native terminal for modern developers, built for coding with agents.',
      color: 'text-purple-600 dark:text-purple-400',
      badge: '💻️',
    },
    {
      name: 'p-stream',
      url: 'https://github.com/p-stream/p-stream',
      description:
        'Composable concurrency primitives for TypeScript — functional and elegant.',
      color: 'text-teal-600 dark:text-teal-400',
      badge: '🌀',
    },
    {
      name: 'Neovim',
      url: 'https://github.com/neovim/neovim',
      description:
        'Fork of Vim that focuses on extensibility and usability for modern workflows.',
      color: 'text-green-700 dark:text-green-300',
      badge: '📝',
    },
    {
      name: 'vibe-draw',
      url: 'https://github.com/martin226/vibe-draw',
      description:
        'Turn your roughest sketches into stunning 3D worlds by vibe drawing.',
      color: 'text-pink-600 dark:text-pink-300',
      badge: '🎨',
    },
    {
      name: 'Classipod',
      url: 'https://github.com/adeeteya/Classipod',
      description:
        'A nostalgic music player inspired by the iconic iPod Classic.',
      color: 'text-rose-500 dark:text-rose-300',
      badge: '🎵',
    },
    {
      name: 'yt-dlp',
      url: 'https://github.com/yt-dlp/yt-dlp',
      description:
        'Feature-rich command-line video/audio downloader forked from youtube-dl.',
      color: 'text-yellow-600 dark:text-yellow-400',
      badge: '📽️',
    },
  ]

  const handleExampleClick = (repoUrl: string) => {
    form.setValue('repoUrl', repoUrl)
    // Optional: you can also auto-submit here if desired
    // form.handleSubmit(onSubmit)()
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
    >
      <Form.Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-w-2xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5, ease: 'easeOut' }}
          >
            <Form.FormField
              control={form.control}
              name="repoUrl"
              render={({ field }) => (
                <Form.FormItem>
                  <Form.FormControl>
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        placeholder="https://github.com/username/repo"
                        {...field}
                        className="pl-10 h-12 text-base"
                      />
                    </div>
                  </Form.FormControl>
                  <Form.FormMessage />
                </Form.FormItem>
              )}
            />
          </motion.div>
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6, ease: 'easeOut' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              className="w-full h-12 text-base border-glow hover:achievement-glow transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Repository'
              )}
            </Button>
          </motion.div>
        </form>

        {/* Example Repositories Section */}
        <motion.div
          className="mt-12 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1 max-w-24"></div>
            <p className="text-sm text-muted-foreground font-medium px-4">
              Try some of these open source projects
            </p>
            <div className="h-px bg-gradient-to-l from-transparent via-border to-transparent flex-1 max-w-24"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
            {exampleRepos.map((repo, index) => (
              <motion.button
                key={repo.url}
                onClick={() => handleExampleClick(repo.url)}
                className="group relative p-4 rounded-lg border border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-200 text-left hover:shadow-md"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.9 + index * 0.05,
                  ease: 'easeOut',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{repo.badge}</span>
                    <h4
                      className={`font-semibold text-sm ${repo.color} group-hover:text-primary transition-colors`}
                    >
                      {repo.name}
                    </h4>
                  </div>
                  <Github className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2">
                  {repo.description}
                </p>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </motion.button>
            ))}
          </div>

          <motion.p
            className="text-xs text-muted-foreground mt-4 opacity-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            Click any project to analyze it instantly
          </motion.p>
        </motion.div>
      </Form.Form>
    </motion.div>
  )
}

export default function Home() {
  const [state, setState] = useState<{
    isLoading: boolean
    result: AnalysisResult | null
    error: string | null
  }>({
    isLoading: false,
    result: null,
    error: null,
  })

  const { toast } = useToast()

  const handleSubmit = async (data: FormValues) => {
    setState({ isLoading: true, result: null, error: null })
    try {
      const result = await analyzeRepoAction(data)
      if (result) {
        setState({ isLoading: false, result, error: null })
      } else {
        throw new Error('Analysis failed to return a result.')
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred.'
      setState({ isLoading: false, result: null, error: errorMessage })
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: errorMessage,
      })
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {!state.result && !state.isLoading && (
            <motion.section
              key="hero"
              className="py-20 md:py-32"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <div className="container mx-auto text-center px-4">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2,
                    type: 'spring',
                    bounce: 0.4,
                  }}
                >
                  <Sparkles className="mx-auto h-16 w-16 text-primary animate-pulse" />
                </motion.div>
                <motion.h2
                  className="text-4xl md:text-5xl font-bold tracking-tighter mt-4 font-headline"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
                >
                  {/* Unlock Any Codebase */}
                  Understand Codebases, Start Contributing
                </motion.h2>
                <motion.p
                  className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
                >
                  {/* Paste a GitHub repository URL to get an AI-powered summary,
                  file explanations, and more. */}
                  Drowning in unfamiliar code? Paste a GitHub repo and get AI
                  guidance to start contributing with confidence.
                </motion.p>

                <motion.div
                  className="mt-8"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
                >
                  <RepoForm
                    onSubmit={handleSubmit}
                    isSubmitting={state.isLoading}
                  />
                </motion.div>
              </div>
            </motion.section>
          )}

          {state.isLoading && (
            <motion.div
              key="loading"
              className="flex flex-col items-center justify-center py-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
              </motion.div>
              <motion.p
                className="mt-4 text-muted-foreground"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {/* AI is analyzing the repository... this may take a moment. */}
                Hold on - our analysis won{"'"}t end like this! 🤡️{' '}
                <img
                  src="https://media1.tenor.com/m/A_nr2Ti6W8IAAAAC/coldplay-coldplay-concert.gif"
                  alt="Loading animation"
                  className="rounded-lg w-64 mx-auto"
                />
              </motion.p>
            </motion.div>
          )}

          {state.result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              <AnalysisDisplay result={state.result} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <motion.footer
        className="py-6 border-t"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8, ease: 'easeOut' }}
      >
        <div className="container mx-auto text-center text-sm text-muted-foreground space-y-3">
          <p>
            Built with ❤️ by{' '}
            <Link
              href="https://github.com/gurkiratz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Gurkirat Singh
            </Link>
          </p>
        </div>
      </motion.footer>
    </div>
  )
}
