'use client';

import { cn } from '@/lib/utils';
import { Terminal, AlertCircle } from 'lucide-react';

interface ConsoleOutputProps {
    output: string[];
    error?: string | null;
    className?: string;
}

export function ConsoleOutput({ output, error, className }: ConsoleOutputProps) {
    if (output.length === 0 && !error) {
        return (
            <div className={cn('bg-bg-tertiary rounded-b-lg p-4 border-t border-border', className)}>
                <div className="flex items-center gap-2 text-text-muted text-sm">
                    <Terminal size={14} />
                    <span>Run the code to see output...</span>
                </div>
            </div>
        );
    }

    return (
        <div className={cn('bg-bg-tertiary rounded-b-lg p-4 border-t border-border', className)}>
            <div className="flex items-center gap-2 text-text-secondary text-xs mb-2 font-mono">
                <Terminal size={12} />
                <span>OUTPUT</span>
            </div>

            <div className="font-mono text-sm space-y-1">
                {output.map((line, i) => (
                    <div key={i} className="flex items-start gap-2">
                        <span className="text-primary select-none">→</span>
                        <span className="text-green-400 whitespace-pre-wrap break-all">{line}</span>
                    </div>
                ))}

                {error && (
                    <div className="flex items-start gap-2 text-red-400 mt-2 p-2 bg-red-950/20 rounded">
                        <AlertCircle size={14} className="mt-1 flex-shrink-0" />
                        <span className="whitespace-pre-wrap break-all">{error}</span>
                    </div>
                )}
            </div>
        </div>
    );
}