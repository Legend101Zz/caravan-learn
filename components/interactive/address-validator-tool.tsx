'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X, AlertCircle } from 'lucide-react';
import * as CaravanBitcoin from '@caravan/bitcoin';

export function AddressValidatorTool() {
    const [address, setAddress] = useState('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq');
    const [network, setNetwork] = useState<'MAINNET' | 'TESTNET' | 'REGTEST'>('MAINNET');
    const [result, setResult] = useState<{
        valid: boolean;
        error?: string;
        details?: {
            type: string;
            network: string;
            length: number;
        };
    } | null>(null);

    const validate = () => {
        const error = CaravanBitcoin.validateAddress(
            address,
            CaravanBitcoin.Network[network]
        );

        if (error) {
            setResult({ valid: false, error });
        } else {
            // Determine address type
            let type = 'Unknown';
            if (address.startsWith('1')) type = 'P2PKH (Legacy)';
            else if (address.startsWith('3')) type = 'P2SH';
            else if (address.startsWith('bc1q') && address.length === 42) type = 'P2WPKH (Native SegWit)';
            else if (address.startsWith('bc1q') && address.length === 62) type = 'P2WSH (Native SegWit)';
            else if (address.startsWith('bc1p')) type = 'P2TR (Taproot)';
            else if (address.startsWith('tb1')) type = 'Testnet SegWit';
            else if (address.startsWith('bcrt1')) type = 'Regtest SegWit';
            else if (address.startsWith('m') || address.startsWith('n')) type = 'Testnet Legacy';
            else if (address.startsWith('2')) type = 'Testnet P2SH';

            setResult({
                valid: true,
                details: {
                    type,
                    network: network,
                    length: address.length,
                },
            });
        }
    };

    return (
        <Card className="my-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🔍</span>
                    Address Validator Tool
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

                {/* Address Input */}
                <div>
                    <label className="text-sm font-medium text-text-secondary mb-2 block">
                        Bitcoin Address
                    </label>
                    <Input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter a Bitcoin address..."
                        className="font-mono text-sm"
                    />
                </div>

                {/* Validate Button */}
                <Button onClick={validate} className="w-full">
                    Validate Address
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
                                    {result.valid ? 'Valid Address!' : 'Invalid Address'}
                                </div>
                                {result.error ? (
                                    <div className="text-sm text-red-300">{result.error}</div>
                                ) : (
                                    result.details && (
                                        <div className="space-y-1 text-sm text-text-secondary">
                                            <div className="flex justify-between">
                                                <span>Type:</span>
                                                <span className="font-mono text-green-400">
                                                    {result.details.type}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Network:</span>
                                                <span className="font-mono text-green-400">
                                                    {result.details.network}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Length:</span>
                                                <span className="font-mono text-green-400">
                                                    {result.details.length} characters
                                                </span>
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
                            onClick={() => setAddress('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq')}
                            className="block w-full text-left p-2 rounded hover:bg-bg-secondary transition-colors"
                        >
                            <span className="text-primary">Mainnet P2WPKH:</span>
                            <br />
                            <code className="text-text-muted">bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq</code>
                        </button>
                        <button
                            onClick={() => setAddress('3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy')}
                            className="block w-full text-left p-2 rounded hover:bg-bg-secondary transition-colors"
                        >
                            <span className="text-primary">Mainnet P2SH:</span>
                            <br />
                            <code className="text-text-muted">3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy</code>
                        </button>
                        <button
                            onClick={() => setAddress('tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx')}
                            className="block w-full text-left p-2 rounded hover:bg-bg-secondary transition-colors"
                        >
                            <span className="text-primary">Testnet SegWit:</span>
                            <br />
                            <code className="text-text-muted">tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx</code>
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}