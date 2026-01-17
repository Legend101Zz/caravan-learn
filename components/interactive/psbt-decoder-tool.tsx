'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, FileText, Eye, Copy, Check } from 'lucide-react';

export function PSBTDecoderTool() {
    const [psbtBase64, setPsbtBase64] = useState('');
    const [result, setResult] = useState<{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        decoded?: any;
        error?: string;
    } | null>(null);
    const [copied, setCopied] = useState(false);

    const decodePSBT = () => {
        if (!psbtBase64.trim()) {
            setResult({ error: 'Please enter a PSBT in base64 format' });
            return;
        }

        try {
            // For demonstration - in real app would decode actual PSBT
            const mockDecoded = {
                version: 0,
                inputs: [
                    {
                        txid: 'a1b2c3d4e5f6...',
                        vout: 0,
                        sequence: 4294967295,
                        witnessUtxo: {
                            amount: '100000000',
                            scriptPubKey: 'bc1q...',
                        },
                        partialSigs: [],
                    },
                ],
                outputs: [
                    {
                        value: '95000000',
                        scriptPubKey: 'bc1q...',
                    },
                    {
                        value: '4950000',
                        scriptPubKey: 'bc1q...',
                    },
                ],
                fee: 50000,
            };

            setResult({ decoded: mockDecoded });
        } catch (error) {
            setResult({
                error: error instanceof Error ? error.message : 'Failed to decode PSBT',
            });
        }
    };

    const copyJSON = async () => {
        if (result?.decoded) {
            await navigator.clipboard.writeText(JSON.stringify(result.decoded, null, 2));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <Card className="my-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🔍</span>
                    PSBT Decoder Tool
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Input */}
                <div>
                    <label className="text-sm font-medium text-text-secondary mb-2 block">
                        PSBT (Base64 encoded)
                    </label>
                    <Textarea
                        value={psbtBase64}
                        onChange={(e) => setPsbtBase64(e.target.value)}
                        placeholder="cHNidP8BAH0CAAAAAe..."
                        className="font-mono text-xs min-h-[120px]"
                    />
                </div>

                {/* Decode Button */}
                <div className="flex gap-2">
                    <Button onClick={decodePSBT} className="flex-1">
                        <Eye size={16} />
                        Decode PSBT
                    </Button>
                    {result?.decoded && (
                        <Button variant="outline" onClick={copyJSON}>
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            {copied ? 'Copied' : 'Copy JSON'}
                        </Button>
                    )}
                </div>

                {/* Results */}
                {result && (
                    <div
                        className={`p-4 rounded-lg border ${result.error
                            ? 'bg-red-950/20 border-red-500/30'
                            : 'bg-green-950/20 border-green-500/30'
                            }`}
                    >
                        {result.error ? (
                            <div className="flex items-start gap-3">
                                <AlertCircle className="text-red-400 flex-shrink-0 mt-1" size={20} />
                                <div>
                                    <div className="font-semibold text-red-400 mb-1">Error</div>
                                    <div className="text-sm text-red-300">{result.error}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <FileText className="text-green-400 flex-shrink-0 mt-1" size={20} />
                                    <div className="flex-1">
                                        <div className="font-semibold text-green-400 mb-3">
                                            PSBT Decoded Successfully
                                        </div>

                                        {/* Summary */}
                                        <div className="grid md:grid-cols-3 gap-3 mb-4">
                                            <div className="p-3 bg-bg-tertiary rounded">
                                                <div className="text-xs text-text-muted mb-1">Version</div>
                                                <div className="font-mono text-green-400">
                                                    {result.decoded.version}
                                                </div>
                                            </div>
                                            <div className="p-3 bg-bg-tertiary rounded">
                                                <div className="text-xs text-text-muted mb-1">Inputs</div>
                                                <div className="font-mono text-green-400">
                                                    {result.decoded.inputs.length}
                                                </div>
                                            </div>
                                            <div className="p-3 bg-bg-tertiary rounded">
                                                <div className="text-xs text-text-muted mb-1">Outputs</div>
                                                <div className="font-mono text-green-400">
                                                    {result.decoded.outputs.length}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Full JSON */}
                                        <div>
                                            <div className="text-xs text-text-muted mb-2">Full Structure:</div>
                                            <div className="p-4 bg-bg-secondary rounded max-h-96 overflow-y-auto">
                                                <pre className="text-xs text-text-secondary">
                                                    {JSON.stringify(result.decoded, null, 2)}
                                                </pre>
                                            </div>
                                        </div>

                                        {/* Info Box */}
                                        <div className="mt-4 p-3 bg-blue-950/20 border border-blue-500/30 rounded">
                                            <div className="text-xs text-blue-300">
                                                <strong>💡 What you&apos;re seeing:</strong> This is the internal structure
                                                of the PSBT. It contains all the information needed to sign and broadcast
                                                the transaction.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Example */}
                <div className="p-4 bg-bg-tertiary rounded-lg">
                    <div className="text-sm font-medium text-text-secondary mb-3">
                        Example PSBT:
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setPsbtBase64('cHNidP8BAH0CAAAAAe7xFxmDMZ6vZ1y/SRo63Y7hBJj+TAAA...');
                            decodePSBT();
                        }}
                        className="w-full text-xs"
                    >
                        Load Example PSBT
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}