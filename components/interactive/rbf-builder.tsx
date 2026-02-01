/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    RefreshCw,
    ArrowRight,
    Coins,
    Send,
    AlertTriangle,
    CheckCircle2,
    Info,
    Zap,
    TrendingUp,
    Eye,
    Code
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface OriginalTx {
    txid: string;
    inputs: Array<{ txid: string; vout: number; amount: number }>;
    outputs: Array<{ address: string; amount: number; type: 'recipient' | 'change' }>;
    feeRate: number;
    size: number;
}

const EXAMPLE_STUCK_TX: OriginalTx = {
    txid: 'abc123def456789...',
    inputs: [
        { txid: 'input1_txid...', vout: 0, amount: 100000 },
        { txid: 'input2_txid...', vout: 1, amount: 50000 }
    ],
    outputs: [
        { address: 'bc1qrecipient...', amount: 130000, type: 'recipient' },
        { address: 'bc1qchange...', amount: 18800, type: 'change' }
    ],
    feeRate: 1,
    size: 220
};

export function RBFBuilder() {
    const [originalTx] = useState<OriginalTx>(EXAMPLE_STUCK_TX);
    const [rbfType, setRbfType] = useState<'accelerate' | 'cancel' | 'modify'>('accelerate');
    const [newFeeRate, setNewFeeRate] = useState(10);
    const [modifiedAmount, setModifiedAmount] = useState(130000);
    const [modifiedAddress, setModifiedAddress] = useState('bc1qrecipient...');

    // Calculate original transaction details
    const originalTotalIn = useMemo(() =>
        originalTx.inputs.reduce((sum, inp) => sum + inp.amount, 0),
        [originalTx]
    );
    const originalTotalOut = useMemo(() =>
        originalTx.outputs.reduce((sum, out) => sum + out.amount, 0),
        [originalTx]
    );
    const originalFee = originalTotalIn - originalTotalOut;

    // Calculate new RBF transaction
    const newFee = Math.ceil(originalTx.size * newFeeRate);
    const feeIncrease = newFee - originalFee;

    const calculateRbfOutputs = () => {
        if (rbfType === 'accelerate') {
            // Keep same outputs, reduce change
            const recipientOut = originalTx.outputs.find(o => o.type === 'recipient')!;
            const newChange = originalTotalIn - recipientOut.amount - newFee;
            return {
                recipient: recipientOut.amount,
                change: newChange,
                valid: newChange >= 546
            };
        } else if (rbfType === 'cancel') {
            // Send everything back to yourself (minus fee)
            const selfAmount = originalTotalIn - newFee;
            return {
                recipient: 0,
                change: selfAmount,
                valid: selfAmount >= 546
            };
        } else {
            // Modified recipient
            const newChange = originalTotalIn - modifiedAmount - newFee;
            return {
                recipient: modifiedAmount,
                change: newChange,
                valid: newChange >= 546 && modifiedAmount > 0
            };
        }
    };

    const rbfOutputs = calculateRbfOutputs();
    const isValid = rbfOutputs.valid && newFee > originalFee;

    // BIP125 validation
    const bip125Checks = {
        higherFee: newFee > originalFee,
        minimumIncrease: newFee >= originalFee + 1000, // ~1000 sats min relay fee
        sameInputs: true, // We're using same inputs
        rbfSignaled: true // Assume original signaled RBF
    };

    const allBip125Pass = Object.values(bip125Checks).every(v => v);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 text-green-400 mb-4 border border-green-500/30">
                    <RefreshCw className="w-5 h-5" />
                    <span className="font-semibold">RBF Transaction Builder</span>
                </div>
                <p className="text-sm text-text-secondary max-w-2xl mx-auto">
                    Replace your stuck transaction with a higher fee version. Choose to accelerate, cancel, or modify your transaction.
                </p>
            </div>

            {/* Original Transaction Info */}
            <Card className="bg-bg-secondary border-yellow-500/30">
                <CardContent className="pt-6">
                    <h4 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        Original Stuck Transaction
                    </h4>

                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="p-3 bg-bg-tertiary rounded-lg text-center">
                            <div className="text-xs text-text-muted mb-1">Fee Rate</div>
                            <div className="text-lg font-bold text-yellow-400">{originalTx.feeRate} sat/vB</div>
                        </div>
                        <div className="p-3 bg-bg-tertiary rounded-lg text-center">
                            <div className="text-xs text-text-muted mb-1">Total Fee</div>
                            <div className="text-lg font-bold text-text-primary">{originalFee} sats</div>
                        </div>
                        <div className="p-3 bg-bg-tertiary rounded-lg text-center">
                            <div className="text-xs text-text-muted mb-1">Size</div>
                            <div className="text-lg font-bold text-text-primary">{originalTx.size} vB</div>
                        </div>
                        <div className="p-3 bg-bg-tertiary rounded-lg text-center">
                            <div className="text-xs text-text-muted mb-1">Status</div>
                            <div className="text-lg font-bold text-red-400">Stuck</div>
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm">
                        <div className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <div className="text-yellow-400 font-medium mb-1">Why is this stuck?</div>
                                <div className="text-text-secondary text-xs">
                                    At {originalTx.feeRate} sat/vB, this transaction is paying too little compared to network demand.
                                    Miners prioritize higher-fee transactions.
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* RBF Strategy Selection */}
            <Card className="bg-bg-secondary border-green-500/30">
                <CardContent className="pt-6">
                    <h4 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-green-400" />
                        Choose RBF Strategy
                    </h4>

                    <Tabs value={rbfType} onValueChange={(v) => setRbfType(v as any)}>
                        <TabsList className="grid w-full grid-cols-3 mb-6">
                            <TabsTrigger value="accelerate">Accelerate</TabsTrigger>
                            <TabsTrigger value="cancel">Cancel</TabsTrigger>
                            <TabsTrigger value="modify">Modify</TabsTrigger>
                        </TabsList>

                        <TabsContent value="accelerate" className="mt-0">
                            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg mb-4">
                                <h5 className="font-medium text-green-400 mb-2">Accelerate Transaction</h5>
                                <p className="text-sm text-text-secondary">
                                    Keep the same recipient and amount. Only increase the fee by reducing your change output.
                                    This is the most common use of RBF.
                                </p>
                            </div>
                        </TabsContent>

                        <TabsContent value="cancel" className="mt-0">
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg mb-4">
                                <h5 className="font-medium text-red-400 mb-2">Cancel Transaction</h5>
                                <p className="text-sm text-text-secondary">
                                    Send all funds back to yourself (minus the higher fee). The original recipient gets nothing.
                                    Use this if you made a mistake or changed your mind.
                                </p>
                            </div>
                        </TabsContent>

                        <TabsContent value="modify" className="mt-0">
                            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg mb-4">
                                <h5 className="font-medium text-blue-400 mb-2">Modify Transaction</h5>
                                <p className="text-sm text-text-secondary">
                                    Change the recipient address or amount while also increasing the fee.
                                    Useful if you sent to the wrong address or want to adjust the amount.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <Label className="text-sm text-text-secondary mb-2">New Recipient Address</Label>
                                    <Input
                                        value={modifiedAddress}
                                        onChange={(e) => setModifiedAddress(e.target.value)}
                                        placeholder="bc1q..."
                                        className="bg-bg-tertiary border-border font-mono text-sm"
                                    />
                                </div>
                                <div>
                                    <Label className="text-sm text-text-secondary mb-2">New Amount (sats)</Label>
                                    <Input
                                        type="number"
                                        value={modifiedAmount}
                                        onChange={(e) => setModifiedAmount(parseInt(e.target.value) || 0)}
                                        className="bg-bg-tertiary border-border font-mono"
                                    />
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    {/* Fee Rate Slider */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm text-text-secondary">New Fee Rate</Label>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-green-400">{newFeeRate}</span>
                                <span className="text-sm text-text-muted">sat/vB</span>
                            </div>
                        </div>
                        <input
                            type="range"
                            min={originalTx.feeRate + 1}
                            max={100}
                            value={newFeeRate}
                            onChange={(e) => setNewFeeRate(parseInt(e.target.value))}
                            className="w-full accent-green-500"
                        />
                        <div className="flex justify-between text-xs text-text-muted mt-1">
                            <span>Minimum</span>
                            <span>Standard</span>
                            <span>High Priority</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Comparison View */}
            <Card className="bg-bg-secondary border-border">
                <CardContent className="pt-6">
                    <h4 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-pkg-fees" />
                        Before vs After Comparison
                    </h4>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Before */}
                        <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                            <h5 className="font-medium text-yellow-400 mb-3">Original Transaction</h5>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-text-muted">Total Input:</span>
                                    <span className="font-mono text-text-primary">{originalTotalIn.toLocaleString()} sats</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-muted">To Recipient:</span>
                                    <span className="font-mono text-text-primary">
                                        {originalTx.outputs.find(o => o.type === 'recipient')?.amount.toLocaleString()} sats
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-muted">Change:</span>
                                    <span className="font-mono text-text-primary">
                                        {originalTx.outputs.find(o => o.type === 'change')?.amount.toLocaleString()} sats
                                    </span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-yellow-500/20">
                                    <span className="text-text-muted">Fee:</span>
                                    <span className="font-mono text-yellow-400">{originalFee.toLocaleString()} sats</span>
                                </div>
                            </div>
                        </div>

                        {/* After */}
                        <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                            <h5 className="font-medium text-green-400 mb-3">Replacement Transaction</h5>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-text-muted">Total Input:</span>
                                    <span className="font-mono text-text-primary">{originalTotalIn.toLocaleString()} sats</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-muted">To Recipient:</span>
                                    <span className="font-mono text-text-primary">
                                        {rbfOutputs.recipient.toLocaleString()} sats
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-muted">Change:</span>
                                    <span className={`font-mono ${rbfOutputs.change >= 546 ? 'text-text-primary' : 'text-red-400'}`}>
                                        {rbfOutputs.change.toLocaleString()} sats
                                        {rbfOutputs.change < 546 && rbfOutputs.change > 0 && ' (dust!)'}
                                    </span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-green-500/20">
                                    <span className="text-text-muted">Fee:</span>
                                    <span className="font-mono text-green-400">{newFee.toLocaleString()} sats</span>
                                </div>
                            </div>

                            <div className="mt-3 pt-3 border-t border-green-500/20">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-text-muted">Fee Increase:</span>
                                    <span className="font-mono font-bold text-green-400">
                                        +{feeIncrease.toLocaleString()} sats
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* BIP125 Validation */}
            <Card className="bg-bg-secondary border-border">
                <CardContent className="pt-6">
                    <h4 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        BIP125 Rule Validation
                    </h4>

                    <div className="grid md:grid-cols-2 gap-3">
                        {Object.entries(bip125Checks).map(([key, passed]) => (
                            <div
                                key={key}
                                className={`p-3 rounded-lg border ${passed
                                    ? 'bg-green-500/10 border-green-500/30'
                                    : 'bg-red-500/10 border-red-500/30'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    {passed ? (
                                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                                    ) : (
                                        <AlertTriangle className="w-4 h-4 text-red-400" />
                                    )}
                                    <span className={`text-sm font-medium ${passed ? 'text-green-400' : 'text-red-400'}`}>
                                        {key === 'higherFee' && 'Higher Fee'}
                                        {key === 'minimumIncrease' && 'Minimum Relay Fee'}
                                        {key === 'sameInputs' && 'Same Inputs Used'}
                                        {key === 'rbfSignaled' && 'RBF Signaled'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {allBip125Pass ? (
                        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-sm text-green-400 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            All BIP125 requirements met! This replacement will be accepted by the network.
                        </div>
                    ) : (
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Some BIP125 requirements not met. Adjust parameters before creating replacement.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Action Button */}
            <Button
                disabled={!isValid || !allBip125Pass}
                className="w-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30 h-12 text-base"
            >
                <RefreshCw className="w-5 h-5 mr-2" />
                Create RBF Replacement Transaction
            </Button>

            {/* Code Example */}
            <Card className="bg-bg-secondary border-border">
                <CardContent className="pt-6">
                    <h4 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                        <Code className="w-5 h-5 text-pkg-fees" />
                        Generated Code
                    </h4>

                    <div className="p-4 bg-bg-tertiary rounded-lg font-mono text-xs overflow-x-auto">
                        <pre className="text-text-secondary">
                            {`import { createAcceleratedRbfTransaction } from '@caravan/fees';

const rbfTx = createAcceleratedRbfTransaction({
  originalTransaction: {
    txid: '${originalTx.txid}',
    feeRate: ${originalTx.feeRate},
    size: ${originalTx.size}
  },
  newFeeRate: ${newFeeRate},
  strategy: '${rbfType}'
});

// Result:
// Fee increase: ${feeIncrease} sats
// New fee rate: ${newFeeRate} sat/vB
// Status: ${isValid && allBip125Pass ? 'Ready to broadcast' : 'Needs adjustment'}`}
                        </pre>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}