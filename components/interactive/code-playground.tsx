/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { ConsoleOutput } from './console-output';
import { Play, RotateCcw, Copy, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodePlaygroundProps {
    initialCode: string;
    language?: 'typescript' | 'javascript';
    imports?: Record<string, any>;
    height?: string;
    title?: string;
    className?: string;
}

export function CodePlayground({
    initialCode,
    language = 'typescript',
    imports = {},
    height = '250px',
    title = 'Interactive Example',
    className,
}: CodePlaygroundProps) {
    const [code, setCode] = useState(initialCode.trim());
    const [output, setOutput] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [copied, setCopied] = useState(false);

    const runCode = useCallback(async () => {
        setIsRunning(true);
        setError(null);
        setOutput([]);

        try {
            const logs: string[] = [];
            const mockConsole = {
                log: (...args: any[]) => {
                    logs.push(
                        args
                            .map((arg) =>
                                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                            )
                            .join(' ')
                    );
                },
                error: (...args: any[]) => {
                    logs.push(`ERROR: ${args.map(String).join(' ')}`);
                },
                warn: (...args: any[]) => {
                    logs.push(`WARNING: ${args.map(String).join(' ')}`);
                },
            };

            // Remove import statements
            const cleanedCode = code
                .replace(/import\s+\{[^}]+\}\s+from\s+['"][^'"]+['"]\s*;?/g, '')
                .replace(/import\s+\*\s+as\s+\w+\s+from\s+['"][^'"]+['"]\s*;?/g, '')
                .trim();

            // Create async function
            const fn = new Function(
                'console',
                ...Object.keys(imports),
                `
          return (async () => {
            ${cleanedCode}
          })();
        `
            );

            await fn(mockConsole, ...Object.values(imports));
            setOutput(logs);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Unknown error occurred');
        } finally {
            setIsRunning(false);
        }
    }, [code, imports]);

    const resetCode = useCallback(() => {
        setCode(initialCode.trim());
        setOutput([]);
        setError(null);
    }, [initialCode]);

    const copyCode = useCallback(async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [code]);

    return (
        <div className={cn('rounded-lg border border-border overflow-hidden my-8 shadow-xl', className)}>
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-bg-secondary to-bg-tertiary px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="ml-2 text-sm text-text-secondary font-mono">{title}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={copyCode}
                        className="h-8 px-3"
                    >
                        {copied ? (
                            <>
                                <Check size={14} />
                                Copied
                            </>
                        ) : (
                            <>
                                <Copy size={14} />
                                Copy
                            </>
                        )}
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={resetCode}
                        className="h-8 px-3"
                    >
                        <RotateCcw size={14} />
                        Reset
                    </Button>
                    <Button
                        size="sm"
                        onClick={runCode}
                        disabled={isRunning}
                        className="h-8"
                    >
                        {isRunning ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                Running...
                            </>
                        ) : (
                            <>
                                <Play size={14} />
                                Run
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Editor */}
            <Editor
                height={height}
                defaultLanguage={language}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                    minimap: { enabled: false },
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    fontFamily: 'JetBrains Mono, Consolas, monospace',
                    padding: { top: 16, bottom: 16 },
                    renderLineHighlight: 'all',
                    overviewRulerBorder: false,
                    hideCursorInOverviewRuler: true,
                    scrollbar: {
                        vertical: 'auto',
                        horizontal: 'auto',
                    },
                    smoothScrolling: true,
                }}
            />

            {/* Console Output */}
            <ConsoleOutput output={output} error={error} />
        </div>
    );
}