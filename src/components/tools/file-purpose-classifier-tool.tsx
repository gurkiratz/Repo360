'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoaderCircle, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { classifyFilePurposeAction, type ClassifyFilePurposeOutput } from '@/app/actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function FilePurposeClassifierTool({ fileList }: { fileList: string[] }) {
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [state, setState] = useState<{
        isLoading: boolean;
        result: ClassifyFilePurposeOutput | null;
        error: string | null;
    }>({
        isLoading: false,
        result: null,
        error: null,
    });
    const { toast } = useToast();

    const handleClassify = async () => {
        if (!selectedFile) {
            toast({ title: 'No file selected', description: 'Please choose a file from the list to classify.', variant: 'destructive' });
            return;
        }

        setState({ isLoading: true, result: null, error: null });
        try {
            const result = await classifyFilePurposeAction({ fileName: selectedFile });
            if (!result) {
                throw new Error('Classification failed to return a result.');
            }
            setState({ isLoading: false, result, error: null });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setState({ isLoading: false, result: null, error: errorMessage });
            toast({
                variant: 'destructive',
                title: 'Classification Failed',
                description: errorMessage,
            });
        }
    };

    return (
        <div className="mt-4 space-y-4">
            <div className="flex gap-2">
                <Select onValueChange={setSelectedFile}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a file to analyze" />
                    </SelectTrigger>
                    <SelectContent>
                        {fileList.map((file) => (
                            <SelectItem key={file} value={file} className="font-mono">{file}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button onClick={handleClassify} disabled={state.isLoading || !selectedFile} className="flex-shrink-0">
                    {state.isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    Classify File
                </Button>
            </div>

            {state.result && (
                <div className="p-4 bg-accent rounded-md border space-y-2">
                     <h4 className="font-semibold flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /> AI Classification</h4>
                    <p className="text-muted-foreground">{state.result.purpose}</p>
                </div>
            )}
        </div>
    );
}
