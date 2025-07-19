import type { SuggestEntryPointsOutput } from "@/ai/flows";
import { Badge } from "@/components/ui/badge";

export function WhatToReadFirstTool({ entryPoints }: { entryPoints: SuggestEntryPointsOutput }) {
    return (
        <div className="mt-4 space-y-4">
            <div>
                <h4 className="font-semibold text-lg mb-2">Suggested Reading Order</h4>
                <ul className="space-y-2">
                    {entryPoints.suggestedFiles.map((file, index) => (
                        <li key={file} className="flex items-center gap-4 p-2 rounded-md bg-accent">
                            <Badge variant="default" className="text-sm">{index + 1}</Badge>
                            <span className="font-mono text-sm">{file}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h4 className="font-semibold text-lg mb-2">Reasoning</h4>
                <p className="text-muted-foreground bg-accent p-4 rounded-md border">{entryPoints.reasoning}</p>
            </div>
        </div>
    );
}
