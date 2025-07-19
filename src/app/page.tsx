'use client';

import { useState } from 'react';
import { z } from 'zod';
import { Github, LoaderCircle, Sparkles } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Form from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { analyzeRepoAction, type AnalysisResult } from '@/app/actions';
import { AnalysisDisplay } from '@/components/analysis-display';

const formSchema = z.object({
  repoUrl: z.string().url().regex(/https.github.com\/[\w-]+\/[\w-]+/, 'Please enter a valid GitHub repository URL.'),
});

type FormValues = z.infer<typeof formSchema>;

function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">RepoAI</h1>
        </div>
        <Button variant="ghost" size="icon" asChild>
          <a href="https://github.com/firebase/studio-extra-quad" target="_blank" rel="noopener noreferrer">
            <Github className="h-5 w-5" />
          </a>
        </Button>
      </div>
    </header>
  );
}

function RepoForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (data: FormValues) => void;
  isSubmitting: boolean;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      repoUrl: '',
    },
  });

  return (
    <Form.Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-2xl mx-auto">
        <Form.FormField
          control={form.control}
          name="repoUrl"
          render={({ field }) => (
            <Form.FormItem>
              <Form.FormControl>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input placeholder="https://github.com/owner/repo" {...field} className="pl-10 h-12 text-base" />
                </div>
              </Form.FormControl>
              <Form.FormMessage />
            </Form.FormItem>
          )}
        />
        <Button type="submit" className="w-full h-12 text-base" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Repository'
          )}
        </Button>
      </form>
    </Form.Form>
  );
}

export default function Home() {
  const [state, setState] = useState<{
    isLoading: boolean;
    result: AnalysisResult | null;
    error: string | null;
  }>({
    isLoading: false,
    result: null,
    error: null,
  });

  const { toast } = useToast();

  const handleSubmit = async (data: FormValues) => {
    setState({ isLoading: true, result: null, error: null });
    try {
      const result = await analyzeRepoAction(data);
      if (result) {
        setState({ isLoading: false, result, error: null });
      } else {
        throw new Error('Analysis failed to return a result.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setState({ isLoading: false, result: null, error: errorMessage });
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: errorMessage,
      });
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <Header />
      <main className="flex-1">
        {!state.result && (
          <section className="py-20 md:py-32">
            <div className="container mx-auto text-center px-4">
              <Sparkles className="mx-auto h-16 w-16 text-primary animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mt-4 font-headline">
                Unlock Any Codebase
              </h2>
              <p className="mt-4 max-w-xl mx-auto text-lg text-muted-foreground">
                Paste a GitHub repository URL to get an AI-powered summary, file explanations, and more.
              </p>
              <div className="mt-8">
                <RepoForm onSubmit={handleSubmit} isSubmitting={state.isLoading} />
              </div>
            </div>
          </section>
        )}
        {state.isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">AI is analyzing the repository... this may take a moment.</p>
          </div>
        )}
        {state.result && <AnalysisDisplay result={state.result} />}
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>Powered by AI. Built for developers.</p>
        </div>
      </footer>
    </div>
  );
}
