'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X, Copy } from 'lucide-react';
import * as CaravanBitcoin from '@caravan/bitcoin';

export function XpubExplorerTool() {
    const [xpub, setXpub] = useState('tpubDFH9dgzveyD8zTbPUFuLrGmCydNvxehyNdUXKJAQN62j3S3L3zHNhYLm8vGZb9SSBG3pXnXdDVaK7i1cqwqVgqVvPVXdoFKqGLPqvBPqUUa');
    const [network, setNetwork] = useState<'MAINNET' | 'TESTNET' | 'REGTEST'>('TESTNET');
    const [result, setResult] = useState<{
        valid: boolean;
        error?: string;
        details?: {
            network: string;
            version: string;
            depth: string;
            fingerprint: string;
            childNumber: string;
        };
    } | null>(null);
    const [copied, setCopied] = useState(false);

    const validate = () => {
        const error = CaravanBitcoin.validateExtendedPublicKey(
            xpub,
            CaravanBitcoin.Network[network]
        );

        if (error) {
            setResult({ valid: false, error });
        } else {
            // Extract xpub details
            const prefix = xpub.substring(0, 4);

            setResult({
                valid: true,
                details: {
                    network: network,
                    version: prefix,
                    depth: 'Account level (m/48\'/0\'/0\'/2\')',
                    fingerprint: xpub.substring(4, 12),
                    childNumber: 'Extended',
                },
            });
        }
    };

    const copyXpub = async () => {
        await navigator.clipboard.writeText(xpub);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="my-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🔑</span>
                    Extended Public Key Explorer
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Network Selector */}
                <div>
                    <label className="text-sm font-medium text-text-secondary mb-2 block">
                        Network
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {(['MAINNET', 'TESTNET', 'REGTEST'] as const).map((net) => (
                            <Button
                                key={net}
                                variant={network === net ? 'default' : 'outline'}
                                onClick={() => setNetwork(net)}
                                size="sm"
                            >
                                {net}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Xpub Input */}
                <div>
                    <label className="text-sm font-medium text-text-secondary mb-2 flex items-center justify-between">
                        <span>Extended Public Key (xpub/tpub)</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={copyXpub}
                            className="h-6 px-2"
                        >
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                            {copied ? 'Copied' : 'Copy'}
                        </Button>
                    </label>
                    <Input
                        value={xpub}
                        onChange={(e) => setXpub(e.target.value)}
                        placeholder="Enter an extended public key..."
                        className="font-mono text-xs"
                    />
                </div>

                {/* Validate Button */}
                <Button onClick={validate} className="w-full">
                    Analyze Extended Key
                </Button>

                {/* Results */}
                {result && (
                    <div
                        className={`p-4 rounded-lg border ${result.valid
                                ? 'bg-green-950/20 border-green-500/30'
                                : 'bg-red-950/20 border-red-500/30'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            {result.valid ? (
                                <Check className="text-green-400 flex-shrink-0 mt-1" size={20} />
                            ) : (
                                <X className="text-red-400 flex-shrink-0 mt-1" size={20} />
                            )}
                            <div className="flex-1">
                                <div
                                    className={`font-semibold mb-2 ${result.valid ? 'text-green-400' : 'text-red-400'
                                        }`}
                                >
                                    {result.valid ? 'Valid Extended Public Key!' : 'Invalid Extended Key'}
                                </div>
                                {result.error ? (
                                    <div className="text-sm text-red-300">{result.error}</div>
                                ) : (
                                    result.details && (
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between py-1 border-b border-green-500/20">
                                                <span className="text-text-secondary">Network:</span>
                                                <span className="font-mono text-green-400">
                                                    {result.details.network}
                                                </span>
                                            </div>
                                            <div className="flex justify-between py-1 border-b border-green-500/20">
                                                <span className="text-text-secondary">Version:</span>
                                                <span className="font-mono text-green-400">
                                                    {result.details.version}
                                                </span>
                                            </div>
                                            <div className="flex justify-between py-1 border-b border-green-500/20">
                                                <span className="text-text-secondary">Derivation Level:</span>
                                                <span className="font-mono text-green-400">
                                                    {result.details.depth}
                                                </span>
                                            </div>
                                            <div className="mt-4 p-3 bg-bg-tertiary rounded">
                                                <div className="text-xs text-text-muted mb-2">Capabilities:</div>
                                                <div className="space-y-1 text-xs text-green-400">
                                                    <div>✓ Derive child public keys</div>
                                                    <div>✓ Generate unlimited addresses</div>
                                                    <div>✓ Monitor wallet balance</div>
                                                    <div>✓ Build multisig wallets</div>
                                                </div>
                                                <div className="mt-3 pt-3 border-t border-border">
                                                    <div className="text-xs text-text-muted mb-2">Limitations:</div>
                                                    <div className="space-y-1 text-xs text-red-400">
                                                        <div>✗ Cannot derive private keys</div>
                                                        <div>✗ Cannot sign transactions</div>
                                                        <div>✗ Cannot spend Bitcoin</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Test Examples */}
                <div className="mt-6 p-4 bg-bg-tertiary rounded-lg">
                    <div className="text-sm font-medium text-text-secondary mb-3">
                        Quick Test Examples:
                    </div>
                    <div className="space-y-2 text-xs">
                        <button
                            onClick={() => {
                                setXpub('tpubDFH9dgzveyD8zTbPUFuLrGmCydNvxehyNdUXKJAQN62j3S3L3zHNhYLm8vGZb9SSBG3pXnXdDVaK7i1cqwqVgqVvPVXdoFKqGLPqvBPqUUa');
                                setNetwork('TESTNET');
                            }}
                            className="block w-full text-left p-2 rounded hover:bg-bg-secondary transition-colors"
                        >
                            <span className="text-primary">Testnet xpub (tpub):</span>
                            <br />
                            <code className="text-text-muted break-all">
                                tpubDFH9dgzveyD8zTbPUFuLrGmCydNvxehyNdUXKJAQN62j3S3L3zHNhYLm8vGZb9SSBG3pXnXdDVaK7i1cqwqVgqVvPVXdoFKqGLPqvBPqUUa
                            </code>
                        </button>
                        <button
                            onClick={() => {
                                setXpub('xpub6CUGRUonZSQ4TWtTMmzXdrXDtypWKiKrhko4egpiMZbpiaQL2jkwSB1icqYh2cfDfVxdx4df189oLKnC5fSwqPfgyP3hooxujYzAu3fDVmz');
                                setNetwork('MAINNET');
                            }}
                            className="block w-full text-left p-2 rounded hover:bg-bg-secondary transition-colors"
                        >
                            <span className="text-primary">Mainnet xpub:</span>
                            <br />
                            <code className="text-text-muted break-all">
                                xpub6CUGRUonZSQ4TWtTMmzXdrXDtypWKiKrhko4egpiMZbpiaQL2jkwSB1icqYh2cfDfVxdx4df189oLKnC5fSwqPfgyP3hooxujYzAu3fDVmz
                            </code>
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}