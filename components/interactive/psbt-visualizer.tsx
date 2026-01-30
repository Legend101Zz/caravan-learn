'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Copy,
    Check,
    Eye,
    EyeOff,
    Layers,
    ArrowRight,
    Coins,
    Send,
    Key,
    FileText,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

interface PSBTInput {
    txid: string;
    vout: number;
    amount: number;
    witnessUtxo: boolean;
    partialSigs: number;
    requiredSigs: number;
}

interface PSBTOutput {
    address: string;
    amount: number;
    type: 'recipient' | 'change';
}

interface PSBTData {
    version: number;
    inputs: PSBTInput[];
    outputs: PSBTOutput[];
    fee: number;
    feeRate: number;
    size: number;
}

export function PSBTVisualizer({ psbt }: { psbt: PSBTData }) {
    const [copied, setCopied] = useState(false);
    const [showRaw, setShowRaw] = useState(false);
    const [expandedInput, setExpandedInput] = useState<number | null>(0);
    const [expandedOutput, setExpandedOutput] = useState<number | null>(0);

    // Generate mock PSBT base64
    const mockPSBTBase64 = 'cHNidP8BAgQCAAAAAQMEAAAAAAEEAQEBBQECAQYBBwH7BAIAAAAAAQBSAgAAAAHBqiVuIUuWoYIvk95Cv/O18/+NBRkwbjUV11FaXoBbEgAAAAAA/////wEYxpo7AAAAABYAFLCjrxRCCEEmk8p9FmhStS2wrvBuAAAAAAEBHxjGmjsAAAAAFgAUsKOvFEIIQSaTyn0WaFK1LbCu8G4BDiALCtkhQZwchxlzXXLcc5+eqeBjjR/kwe7w+ZRAhIFfyAEPBAAAAAABEAT+////AREEjI3EYgESBBAnAAAAIgIC1gH4SEamdV93a+AOPZ3o+xCsyTX7g8RfsBYtTK1at5IY9p2HPlQAAIABAACAAAAAgAAAAAAqAAAAAQMIAAivLwAAAAABBBYAFMQw9kxHVtoxDb0aCFVy7ymZJicsACICAuNvv/U91TQHDPj9OWYUaA81epuF23NAvxz6dF0q17NAGPadhz5UAACAAQAAgAAAAIABAAAAZAAAAAEDCIu96wsAAAAAAQQWABRN0ZOslkpWrBueHMqEVP4vR0+FEwA=' +
        Buffer.from(JSON.stringify(psbt)).toString('base64').slice(0, 50) + '...';

    const copyPSBT = async () => {
        await navigator.clipboard.writeText(mockPSBTBase64);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="bg-bg-secondary border-pkg-psbt/30 overflow-hidden">
            <CardHeader className="border-b border-border bg-pkg-psbt/5">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-pkg-psbt/20 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-pkg-psbt" />
                        </div>
                        <div>
                            <div className="text-lg">Generated PSBT</div>
                            <div className="text-sm text-text-muted font-normal">
                                Partially Signed Bitcoin Transaction
                            </div>
                        </div>
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowRaw(!showRaw)}
                        >
                            {showRaw ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                            {showRaw ? 'Hide Raw' : 'Show Raw'}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={copyPSBT}
                        >
                            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                            {copied ? 'Copied!' : 'Copy'}
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-6">
                {/* Visual PSBT Structure */}
                <div className="space-y-6">
                    {/* Header Stats */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="p-3 bg-bg-tertiary rounded-lg text-center">
                            <div className="text-2xl font-bold text-pkg-psbt">{psbt.version}</div>
                            <div className="text-xs text-text-muted">Version</div>
                        </div>
                        <div className="p-3 bg-bg-tertiary rounded-lg text-center">
                            <div className="text-2xl font-bold text-blue-400">{psbt.inputs.length}</div>
                            <div className="text-xs text-text-muted">Inputs</div>
                        </div>
                        <div className="p-3 bg-bg-tertiary rounded-lg text-center">
                            <div className="text-2xl font-bold text-green-400">{psbt.outputs.length}</div>
                            <div className="text-xs text-text-muted">Outputs</div>
                        </div>
                        <div className="p-3 bg-bg-tertiary rounded-lg text-center">
                            <div className="text-2xl font-bold text-pkg-fees">{psbt.fee}</div>
                            <div className="text-xs text-text-muted">Fee (sats)</div>
                        </div>
                    </div>

                    {/* Flow Visualization */}
                    <div className="flex items-start gap-4">
                        {/* Inputs */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                                <Coins className="w-5 h-5 text-blue-400" />
                                <span className="font-medium text-text-primary">Inputs</span>
                            </div>
                            <div className="space-y-2">
                                {psbt.inputs.map((input, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="border border-blue-500/30 rounded-lg overflow-hidden"
                                    >
                                        <button
                                            onClick={() => setExpandedInput(expandedInput === index ? null : index)}
                                            className="w-full p-3 bg-blue-500/5 hover:bg-blue-500/10 transition-colors flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-bold">
                                                    {index + 1}
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-mono text-xs text-text-muted">{input.txid}</div>
                                                    <div className="text-sm font-medium text-blue-400">
                                                        {input.amount.toLocaleString()} sats
                                                    </div>
                                                </div>
                                            </div>
                                            {expandedInput === index ? (
                                                <ChevronUp className="w-5 h-5 text-text-muted" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-text-muted" />
                                            )}
                                        </button>

                                        {expandedInput === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="p-3 bg-bg-tertiary border-t border-blue-500/20 space-y-2 text-sm"
                                            >
                                                <div className="flex justify-between">
                                                    <span className="text-text-muted">Previous Output Index</span>
                                                    <span className="font-mono text-text-primary">{input.vout}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-text-muted">Witness UTXO</span>
                                                    <span className={input.witnessUtxo ? 'text-green-400' : 'text-red-400'}>
                                                        {input.witnessUtxo ? '✓ Present' : '✗ Missing'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-text-muted">Signatures</span>
                                                    <span className="text-yellow-400">
                                                        {input.partialSigs} / {input.requiredSigs}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Arrow */}
                        <div className="flex flex-col items-center justify-center py-8">
                            <motion.div
                                animate={{ x: [0, 10, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <ArrowRight className="w-8 h-8 text-pkg-psbt" />
                            </motion.div>
                            <div className="text-xs text-text-muted mt-2 text-center">
                                <div className="font-mono text-pkg-fees">-{psbt.fee}</div>
                                <div>fee</div>
                            </div>
                        </div>

                        {/* Outputs */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                                <Send className="w-5 h-5 text-green-400" />
                                <span className="font-medium text-text-primary">Outputs</span>
                            </div>
                            <div className="space-y-2">
                                {psbt.outputs.map((output, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 + 0.3 }}
                                        className={`border rounded-lg overflow-hidden ${output.type === 'change'
                                            ? 'border-yellow-500/30'
                                            : 'border-green-500/30'
                                            }`}
                                    >
                                        <button
                                            onClick={() => setExpandedOutput(expandedOutput === index ? null : index)}
                                            className={`w-full p-3 transition-colors flex items-center justify-between ${output.type === 'change'
                                                ? 'bg-yellow-500/5 hover:bg-yellow-500/10'
                                                : 'bg-green-500/5 hover:bg-green-500/10'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${output.type === 'change'
                                                    ? 'bg-yellow-500/20 text-yellow-400'
                                                    : 'bg-green-500/20 text-green-400'
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                                <div className="text-left">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-xs text-text-muted">
                                                            {output.address.slice(0, 12)}...
                                                        </span>
                                                        {output.type === 'change' && (
                                                            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">
                                                                change
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className={`text-sm font-medium ${output.type === 'change' ? 'text-yellow-400' : 'text-green-400'
                                                        }`}>
                                                        {output.amount.toLocaleString()} sats
                                                    </div>
                                                </div>
                                            </div>
                                            {expandedOutput === index ? (
                                                <ChevronUp className="w-5 h-5 text-text-muted" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-text-muted" />
                                            )}
                                        </button>

                                        {expandedOutput === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className={`p-3 border-t space-y-2 text-sm ${output.type === 'change'
                                                    ? 'bg-bg-tertiary border-yellow-500/20'
                                                    : 'bg-bg-tertiary border-green-500/20'
                                                    }`}
                                            >
                                                <div className="flex justify-between">
                                                    <span className="text-text-muted">Full Address</span>
                                                </div>
                                                <div className="font-mono text-xs text-text-primary break-all bg-bg-secondary p-2 rounded">
                                                    {output.address}
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-text-muted">Type</span>
                                                    <span className="text-text-primary capitalize">{output.type}</span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Signing Status */}
                    <div className="p-4 bg-bg-tertiary rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Key className="w-5 h-5 text-yellow-400" />
                                <span className="font-medium text-text-primary">Signing Status</span>
                            </div>
                            <span className="text-sm text-yellow-400">
                                Awaiting Signatures
                            </span>
                        </div>
                        <div className="flex gap-2">
                            {[1, 2, 3].map((signer) => (
                                <div
                                    key={signer}
                                    className={`flex-1 p-3 rounded-lg text-center ${signer <= 0
                                        ? 'bg-green-500/10 border border-green-500/30'
                                        : 'bg-bg-secondary border border-border'
                                        }`}
                                >
                                    <div className={`text-sm font-medium ${signer <= 0 ? 'text-green-400' : 'text-text-muted'
                                        }`}>
                                        Signer {signer}
                                    </div>
                                    <div className="text-xs text-text-muted">
                                        {signer <= 0 ? '✓ Signed' : 'Pending'}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 text-xs text-text-muted text-center">
                            2-of-3 multisig: Need 2 signatures to broadcast
                        </div>
                    </div>

                    {/* Raw PSBT */}
                    {showRaw && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-4 bg-bg-tertiary rounded-lg"
                        >
                            <div className="text-sm text-text-muted mb-2">Raw PSBT (Base64)</div>
                            <div className="p-3 bg-bg-secondary rounded font-mono text-xs text-text-secondary break-all max-h-32 overflow-y-auto">
                                {mockPSBTBase64}
                            </div>
                        </motion.div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}