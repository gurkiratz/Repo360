'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { scanEnvVarsAction, type ScanEnvVarsOutput } from '@/app/actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';


export function EnvVarScannerTool() {
    const [state, setState] = useState<{
        isLoading: boolean;
        result: ScanEnvVarsOutput | null;
        error: string | null;
    }>({
        isLoading: false,
        result: null,
        error: null,
    });
    const { toast } = useToast();

    const handleScan = async () => {
        setState({ isLoading: true, result: null, error: null });
        try {
            const result = await scanEnvVarsAction();
            if (!result) {
                throw new Error('Scan failed to return results.');
            }
            setState({ isLoading: false, result, error: null });
             if(result.variableExplanations.length === 0) {
                toast({ title: "No environment file found", description: "The scanner could not find a .env or .env.example file in the repository."});
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setState({ isLoading: false, result: null, error: errorMessage });
            toast({
                variant: 'destructive',
                title: 'Scan Failed',
                description: errorMessage,
            });
        }
    };

    return (
        <div className="mt-4">
            <Button onClick={handleScan} disabled={state.isLoading}>
                {state.isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                Scan for .env variables
            </Button>

            {state.result && state.result.variableExplanations.length > 0 && (
                <div className="mt-4 border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Variable</TableHead>
                                <TableHead>Explanation</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {state.result.variableExplanations.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Badge variant="outline" className="font-mono text-sm font-semibold">{item.variableName}</Badge>
                                    </TableCell>
                                    <TableCell>{item.explanation}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
