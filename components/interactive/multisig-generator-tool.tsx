'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, AlertCircle, Check } from 'lucide-react';
import * as CaravanBitcoin from '@caravan/bitcoin';

export function MultisigGeneratorTool() {
    const [requiredSigners, setRequiredSigners] = useState(2);
    const [publicKeys, setPublicKeys] = useState<string[]>([
        '02678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb6',
        '03e7b6c4b5e8c9d3a1b2f4d6c8e0a2b4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8',
    ]);
    const [addressType, setAddressType] = useState<'P2SH' | 'P2SH-P2WSH' | 'P2WSH'>('P2WSH');
    const [network, setNetwork] = useState<'MAINNET' | 'TESTNET'>('TESTNET');
    const [result, setResult] = useState<{
        address?: string;
        redeemScript?: string;
        witnessScript?: string;
        error?: string;
    } | null>(null);

    const addPublicKey = () => {
        setPublicKeys([...publicKeys, '']);
    };

    const removePublicKey = (index: number) => {
        setPublicKeys(publicKeys.filter((_, i) => i !== index));
    };

    const updatePublicKey = (index: number, value: string) => {
        const newKeys = [...publicKeys];
        newKeys[index] = value;
        setPublicKeys(newKeys);
    };

    const generateAddress = () => {
        // Validate inputs
        const validKeys = publicKeys.filter(key => key.trim() !== '');

        if (validKeys.length < 2) {
            setResult({ error: 'Need at least 2 public keys' });
            return;
        }

        if (requiredSigners > validKeys.length) {
            setResult({ error: `Required signers (${requiredSigners}) cannot exceed total keys (${validKeys.length})` });
            return;
        }

        if (requiredSigners < 1) {
            setResult({ error: 'Required signers must be at least 1' });
            return;
        }

        try {
            // Validate each public key
            for (const key of validKeys) {
                const error = CaravanBitcoin.validatePublicKey(key);
                if (error) {
                    setResult({ error: `Invalid public key: ${error}` });
                    return;
                }
            }

            // Generate multisig address
            const multisig = CaravanBitcoin.generateMultisigFromPublicKeys(
                CaravanBitcoin.Network[network],
                addressType,
                requiredSigners,
                ...validKeys
            );

            const address = CaravanBitcoin.multisigAddress(multisig);

            setResult({
                address,
                redeemScript: CaravanBitcoin.multisigRedeemScript(multisig).toString('hex'),
                witnessScript: addressType === 'P2WSH' || addressType === 'P2SH-P2WSH'
                    ? CaravanBitcoin.multisigWitnessScript(multisig).toString('hex')
                    : undefined,
            });
        } catch (error) {
            setResult({
                error: error instanceof Error ? error.message : 'Failed to generate address'
            });
        }
    };

    return (
        <Card className="my-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">🏗️</span>
                    Multisig Address Generator
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Configuration */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-text-secondary mb-2 block">
                            Required Signers (M)
                        </label>
                        <Input
                            type="number"
                            min="1"
                            max={publicKeys.length}
                            value={requiredSigners}
                            onChange={(e) => setRequiredSigners(parseInt(e.target.value) || 1)}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-text-secondary mb-2 block">
                            Total Keys (N): {publicKeys.filter(k => k.trim()).length}
                        </label>
                        <div className="h-10 flex items-center px-3 bg-bg-tertiary rounded-lg text-text-secondary">
                            {requiredSigners}-of-{publicKeys.filter(k => k.trim()).length} Multisig
                        </div>
                    </div>
                </div>

                {/* Network & Address Type */}
                <div className="grid md:grid-cols-2 gap-4">
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
                        <div className="grid grid-cols-3 gap-2">
                            {(['P2SH', 'P2SH-P2WSH', 'P2WSH'] as const).map((type) => (
                                <Button
                                    key={type}
                                    variant={addressType === type ? 'default' : 'outline'}
                                    onClick={() => setAddressType(type)}
                                    size="sm"
                                    className="text-xs"
                                >
                                    {type}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Public Keys */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-text-secondary">
                            Public Keys
                        </label>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={addPublicKey}
                            className="h-7"
                        >
                            <Plus size={14} />
                            Add Key
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {publicKeys.map((key, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    value={key}
                                    onChange={(e) => updatePublicKey(index, e.target.value)}
                                    placeholder={`Public key ${index + 1} (hex format)`}
                                    className="font-mono text-xs"
                                />
                                {publicKeys.length > 2 && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removePublicKey(index)}
                                        className="flex-shrink-0"
                                    >
                                        <Trash2 size={14} className="text-red-400" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Generate Button */}
                <Button onClick={generateAddress} className="w-full">
                    Generate Multisig Address
                </Button>

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
                                            Multisig Address Generated!
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <div className="text-xs text-text-muted mb-1">Address:</div>
                                                <div className="p-3 bg-bg-tertiary rounded font-mono text-sm text-green-400 break-all">
                                                    {result.address}
                                                </div>
                                            </div>

                                            <div>
                                                <div className="text-xs text-text-muted mb-1">Redeem Script:</div>
                                                <div className="p-3 bg-bg-tertiary rounded font-mono text-xs text-text-secondary break-all">
                                                    {result.redeemScript}
                                                </div>
                                            </div>

                                            {result.witnessScript && (
                                                <div>
                                                    <div className="text-xs text-text-muted mb-1">Witness Script:</div>
                                                    <div className="p-3 bg-bg-tertiary rounded font-mono text-xs text-text-secondary break-all">
                                                        {result.witnessScript}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="pt-3 border-t border-green-500/20">
                                                <div className="text-xs text-text-secondary">
                                                    <strong>Configuration:</strong> {requiredSigners}-of-{publicKeys.filter(k => k.trim()).length} {addressType} on {network}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Quick Test */}
                <div className="p-4 bg-bg-tertiary rounded-lg">
                    <div className="text-sm font-medium text-text-secondary mb-3">
                        Quick Test - Load Example Keys:
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setPublicKeys([
                                '02678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb6',
                                '03e7b6c4b5e8c9d3a1b2f4d6c8e0a2b4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8',
                                '02a1633cafcc01ebfb6d78e39f687a1f0995c62fc95f51ead10a02ee0be551b5dc',
                            ]);
                            setRequiredSigners(2);
                            setAddressType('P2WSH');
                            setNetwork('TESTNET');
                        }}
                        className="w-full"
                    >
                        Load 2-of-3 Example
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}