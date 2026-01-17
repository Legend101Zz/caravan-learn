/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';
import * as CaravanBitcoin from '@caravan/bitcoin';

interface XpubInput {
    xpub: string;
    name: string;
}

export function BraidBuilderTool() {
    const [network, setNetwork] = useState<'MAINNET' | 'TESTNET'>('TESTNET');
    const [addressType, setAddressType] = useState<'P2SH' | 'P2SH-P2WSH' | 'P2WSH'>('P2WSH');
    const [requiredSigners, setRequiredSigners] = useState(2);
    const [xpubs, setXpubs] = useState<XpubInput[]>([
        {
            name: 'Key 1',
            xpub: 'tpubDFH9dgzveyD8zTbPUFuLrGmCydNvxehyNdUXKJAQN62j3S3L3zHNhYLm8vGZb9SSBG3pXnXdDVaK7i1cqwqVgqVvPVXdoFKqGLPqvBPqUUa',
        },
        {
            name: 'Key 2',
            xpub: 'tpubDFH9dgzveyD8zTbPUFuLrGmCydNvxehyNdUXKJAQN62j3S3L3zHNhYLm8vGZb9SSBG3pXnXdDVaK7i1cqwqVgqVvPVXdoFKqGLPqvBPqUUa',
        },
    ]);
    const [showAddresses, setShowAddresses] = useState(false);
    const [numAddresses, setNumAddresses] = useState(3);
    const [result, setResult] = useState<{
        braid?: any;
        addresses?: string[];
        error?: string;
    } | null>(null);

    const addXpub = () => {
        setXpubs([...xpubs, { name: `Key ${xpubs.length + 1}`, xpub: '' }]);
    };

    const removeXpub = (index: number) => {
        setXpubs(xpubs.filter((_, i) => i !== index));
    };

    const updateXpub = (index: number, field: 'name' | 'xpub', value: string) => {
        const newXpubs = [...xpubs];
        newXpubs[index][field] = value;
        setXpubs(newXpubs);
    };

    const generateBraid = () => {
        try {
            // Validate inputs
            const validXpubs = xpubs.filter(x => x.xpub.trim() !== '');

            if (validXpubs.length < 2) {
                setResult({ error: 'Need at least 2 extended public keys' });
                return;
            }

            if (requiredSigners > validXpubs.length) {
                setResult({
                    error: `Required signers (${requiredSigners}) cannot exceed total keys (${validXpubs.length})`
                });
                return;
            }

            // Validate each xpub
            for (const { xpub, name } of validXpubs) {
                const error = CaravanBitcoin.validateExtendedPublicKey(
                    xpub,
                    CaravanBitcoin.Network[network]
                );
                if (error) {
                    setResult({ error: `Invalid xpub for ${name}: ${error}` });
                    return;
                }
            }

            // Create extended public key objects
            const extendedPublicKeys = validXpubs.map(({ xpub }) => ({
                base58String: xpub,
                path: "m/48'/0'/0'/2'", // Standard BIP48 path
            }));

            // Generate the Braid
            const braid = CaravanBitcoin.generateBraid(
                CaravanBitcoin.Network[network],
                addressType,
                extendedPublicKeys,
                requiredSigners,
                '0' // Receive addresses (0 = receive, 1 = change)
            );

            // Generate sample addresses
            const addresses: string[] = [];
            for (let i = 0; i < numAddresses; i++) {
                const multisig = CaravanBitcoin.deriveMultisigByIndex(braid, i);
                const address = CaravanBitcoin.multisigAddress(multisig);
                addresses.push(address);
            }

            setResult({ braid, addresses });
            setShowAddresses(true);
        } catch (error) {
            setResult({
                error: error instanceof Error ? error.message : 'Failed to generate Braid',
            });
        }
    };

    return (
        <Card className="my-8 border-primary/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🧬</span>
                    Braid Builder - The Caravan Way
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Configuration */}
                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-sm font-medium text-text-secondary mb-2 block">
                            Network
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {(['MAINNET', 'TESTNET'] as const).map((net) => (
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

                    <div>
                        <label className="text-sm font-medium text-text-secondary mb-2 block">
                            Address Type
                        </label>
                        <select
                            value={addressType}
                            onChange={(e) => setAddressType(e.target.value as any)}
                            className="w-full h-9 px-3 rounded-md bg-bg-tertiary border border-border text-sm"
                        >
                            <option value="P2WSH">P2WSH (Recommended)</option>
                            <option value="P2SH-P2WSH">P2SH-P2WSH</option>
                            <option value="P2SH">P2SH</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-text-secondary mb-2 block">
                            Required Signers (M-of-N)
                        </label>
                        <Input
                            type="number"
                            min="1"
                            max={xpubs.length}
                            value={requiredSigners}
                            onChange={(e) => setRequiredSigners(parseInt(e.target.value) || 1)}
                        />
                    </div>
                </div>

                {/* Extended Public Keys */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-text-secondary">
                            Extended Public Keys ({xpubs.filter(x => x.xpub.trim()).length} total)
                        </label>
                        <Button variant="outline" size="sm" onClick={addXpub} className="h-7">
                            <Plus size={14} />
                            Add Key
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {xpubs.map((xpub, index) => (
                            <div key={index} className="p-4 bg-bg-tertiary rounded-lg border border-border">
                                <div className="flex items-start gap-3">
                                    <div className="flex-1 space-y-2">
                                        <Input
                                            value={xpub.name}
                                            onChange={(e) => updateXpub(index, 'name', e.target.value)}
                                            placeholder="Key name"
                                            className="text-sm"
                                        />
                                        <Input
                                            value={xpub.xpub}
                                            onChange={(e) => updateXpub(index, 'xpub', e.target.value)}
                                            placeholder="tpub... or xpub..."
                                            className="font-mono text-xs"
                                        />
                                    </div>
                                    {xpubs.length > 2 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeXpub(index)}
                                            className="flex-shrink-0 mt-1"
                                        >
                                            <Trash2 size={14} className="text-red-400" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Generate Button */}
                <div className="flex gap-3">
                    <Button onClick={generateBraid} className="flex-1">
                        🧬 Generate Braid
                    </Button>
                    {result && !result.error && (
                        <Button
                            variant="outline"
                            onClick={() => setShowAddresses(!showAddresses)}
                            className="flex items-center gap-2"
                        >
                            {showAddresses ? <EyeOff size={16} /> : <Eye size={16} />}
                            {showAddresses ? 'Hide' : 'Show'} Addresses
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
                                    <Check className="text-green-400 flex-shrink-0 mt-1" size={20} />
                                    <div className="flex-1">
                                        <div className="font-semibold text-green-400 mb-3">
                                            🎉 Braid Generated Successfully!
                                        </div>

                                        {/* Braid Summary */}
                                        <div className="p-4 bg-bg-tertiary rounded-lg mb-4">
                                            <div className="text-sm font-semibold text-primary mb-3">
                                                Braid Configuration
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-3 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-text-muted">Quorum:</span>
                                                    <span className="font-mono text-green-400">
                                                        {requiredSigners}-of-{xpubs.filter(x => x.xpub.trim()).length}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-text-muted">Network:</span>
                                                    <span className="font-mono text-green-400">{network}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-text-muted">Type:</span>
                                                    <span className="font-mono text-green-400">{addressType}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-text-muted">Index:</span>
                                                    <span className="font-mono text-green-400">0 (Receive)</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Visual Representation */}
                                        <div className="p-4 bg-bg-secondary rounded-lg border border-primary/30 mb-4">
                                            <div className="text-sm font-semibold text-primary mb-3">
                                                Braid Structure
                                            </div>
                                            <div className="space-y-2">
                                                {xpubs.filter(x => x.xpub.trim()).map((xpub, i) => (
                                                    <div key={i} className="flex items-center gap-3 text-xs">
                                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">
                                                            {i + 1}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="font-semibold text-text-secondary mb-1">
                                                                {xpub.name}
                                                            </div>
                                                            <div className="font-mono text-text-muted truncate">
                                                                {xpub.xpub.substring(0, 40)}...
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="flex items-center gap-3 text-xs pt-3 border-t border-border">
                                                    <div className="text-primary">→</div>
                                                    <div className="text-green-400">
                                                        Derives to <strong>{result.addresses?.length}</strong> multisig addresses
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Derived Addresses */}
                                        {showAddresses && result.addresses && (
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm font-semibold text-primary">
                                                        Derived Addresses
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <label className="text-xs text-text-muted">Show:</label>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            max="20"
                                                            value={numAddresses}
                                                            onChange={(e) => {
                                                                setNumAddresses(parseInt(e.target.value) || 1);
                                                                generateBraid();
                                                            }}
                                                            className="w-16 h-7 text-xs"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    {result.addresses.map((address, index) => (
                                                        <div
                                                            key={index}
                                                            className="p-3 bg-bg-tertiary rounded border border-green-500/20"
                                                        >
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="text-xs text-text-muted">
                                                                    Address #{index}
                                                                </span>
                                                                <span className="text-xs text-green-400">
                                                                    Path: .../0/{index}
                                                                </span>
                                                            </div>
                                                            <div className="font-mono text-xs text-green-400 break-all">
                                                                {address}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="p-3 bg-blue-950/20 border border-blue-500/30 rounded">
                                                    <div className="text-xs text-blue-300">
                                                        <strong>💡 Key Insight:</strong> All participants with the same xpubs will
                                                        derive the exact same addresses in the same order. This is the power of
                                                        the Braid!
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Export Option */}
                                        <div className="pt-4 border-t border-green-500/20">
                                            <div className="text-xs text-text-muted mb-2">
                                                In a real application, you would save this Braid configuration to:
                                            </div>
                                            <div className="space-y-1 text-xs text-text-secondary">
                                                <div>• Export as JSON file</div>
                                                <div>• Store in secure wallet configuration</div>
                                                <div>• Share with other participants</div>
                                                <div>• Use for transaction building</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Quick Load Examples */}
                <div className="p-4 bg-bg-tertiary rounded-lg">
                    <div className="text-sm font-medium text-text-secondary mb-3">
                        Quick Test - Load Example Configuration:
                    </div>
                    <div className="grid md:grid-cols-2 gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setXpubs([
                                    {
                                        name: 'Hardware Wallet 1',
                                        xpub: 'tpubDFH9dgzveyD8zTbPUFuLrGmCydNvxehyNdUXKJAQN62j3S3L3zHNhYLm8vGZb9SSBG3pXnXdDVaK7i1cqwqVgqVvPVXdoFKqGLPqvBPqUUa',
                                    },
                                    {
                                        name: 'Hardware Wallet 2',
                                        xpub: 'tpubDFH9dgzveyD8zTbPUFuLrGmCydNvxehyNdUXKJAQN62j3S3L3zHNhYLm8vGZb9SSBG3pXnXdDVaK7i1cqwqVgqVvPVXdoFKqGLPqvBPqUUa',
                                    },
                                    {
                                        name: 'Hardware Wallet 3',
                                        xpub: 'tpubDFH9dgzveyD8zTbPUFuLrGmCydNvxehyNdUXKJAQN62j3S3L3zHNhYLm8vGZb9SSBG3pXnXdDVaK7i1cqwqVgqVvPVXdoFKqGLPqvBPqUUa',
                                    },
                                ]);
                                setRequiredSigners(2);
                                setNetwork('TESTNET');
                                setAddressType('P2WSH');
                            }}
                            className="w-full"
                        >
                            2-of-3 Testnet Setup
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setXpubs([
                                    {
                                        name: 'Partner A',
                                        xpub: 'tpubDFH9dgzveyD8zTbPUFuLrGmCydNvxehyNdUXKJAQN62j3S3L3zHNhYLm8vGZb9SSBG3pXnXdDVaK7i1cqwqVgqVvPVXdoFKqGLPqvBPqUUa',
                                    },
                                    {
                                        name: 'Partner B',
                                        xpub: 'tpubDFH9dgzveyD8zTbPUFuLrGmCydNvxehyNdUXKJAQN62j3S3L3zHNhYLm8vGZb9SSBG3pXnXdDVaK7i1cqwqVgqVvPVXdoFKqGLPqvBPqUUa',
                                    },
                                ]);
                                setRequiredSigners(2);
                                setNetwork('TESTNET');
                                setAddressType('P2WSH');
                            }}
                            className="w-full"
                        >
                            2-of-2 Joint Account
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}