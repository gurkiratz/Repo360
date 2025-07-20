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
      className="border-b"
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
          <Button variant="ghost" size="icon" asChild>
            <Link
              href="https://github.com/gurkiratz/Repo360"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-5 w-5" />
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
                        placeholder="https://github.com/owner/repo"
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
                  Unlock Any Codebase
                </motion.h2>
                <motion.p
                  className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
                >
                  Paste a GitHub repository URL to get an AI-powered summary,
                  file explanations, and more.
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
                AI is analyzing the repository... this may take a moment.
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
          <div className="flex justify-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-success/10 text-success rounded-md border border-success/20">
              <span className="w-2 h-2 bg-success rounded-full animate-pulse"></span>
              <span className="text-xs font-semibold">Live</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-xp/10 text-xp rounded-md border border-xp/20">
              <span className="text-xs font-semibold">⚡ Fast Analysis</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-achievement-gold/10 text-achievement-gold rounded-md border border-achievement-gold/20">
              <span className="text-xs font-semibold">🏆 AI Powered</span>
            </div>
          </div>
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
