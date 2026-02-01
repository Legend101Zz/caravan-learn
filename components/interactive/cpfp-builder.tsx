/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Baby,
    ArrowRight,
    ArrowDown,
    Coins,
    Send,
    AlertTriangle,
    CheckCircle2,
    Info,
    Zap,
    Calculator,
    Code
} from 'lucide-react';

interface ParentTx {
    txid: string;
    vout: number;
    amount: number;
    address: string;
    fee: number;
    size: number;
}

const EXAMPLE_PARENT_TX: ParentTx = {
    txid: 'parent_tx_abc123...',
    vout: 0,
    amount: 50000,
    address: 'bc1q_your_address...',
    fee: 200,
    size: 200
};

export function CPFPBuilder() {
    const [parentTx] = useState<ParentTx>(EXAMPLE_PARENT_TX);
    const [targetFeeRate, setTargetFeeRate] = useState(20);
    const [recipientAddress, setRecipientAddress] = useState('bc1q_final_destination...');
    const [recipientAmount, setRecipientAmount] = useState(40000);
    const [estimatedChildSize, setEstimatedChildSize] = useState(150);

    // Calculate parent fee rate
    const parentFeeRate = parentTx.fee / parentTx.size;

    // Calculate required child fee
    const totalPackageSize = parentTx.size + estimatedChildSize;
    const targetTotalFee = targetFeeRate * totalPackageSize;
    const requiredChildFee = targetTotalFee - parentTx.fee;

    // Calculate actual package fee rate
    const actualPackageFeeRate = targetTotalFee / totalPackageSize;
    const childFeeRate = requiredChildFee / estimatedChildSize;

    // Calculate change
    const changeAmount = parentTx.amount - recipientAmount - requiredChildFee;

    const isValid = changeAmount >= 0 && recipientAmount > 0 && requiredChildFee > 0;
    const hasChange = changeAmount >= 546;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 text-purple-400 mb-4 border border-purple-500/30">
                    <Baby className="w-5 h-5" />
                    <span className="font-semibold">CPFP Transaction Builder</span>
                </div>
                <p className="text-sm text-text-secondary max-w-2xl mx-auto">
                    Create a child transaction that pays for its stuck parent. The high child fee makes the package attractive to miners.
                </p>
            </div>

            {/* Parent Transaction Info */}
            <Card className="bg-bg-secondary border-yellow-500/30">
                <CardContent className="pt-6">
                    <h4 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                        Parent Transaction (Stuck)
                    </h4>

                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="p-3 bg-bg-tertiary rounded-lg text-center">
                            <div className="text-xs text-text-muted mb-1">Fee Rate</div>
                            <div className="text-lg font-bold text-yellow-400">{parentFeeRate.toFixed(1)} sat/vB</div>
                        </div>
                        <div className="p-3 bg-bg-tertiary rounded-lg text-center">
                            <div className="text-xs text-text-muted mb-1">Fee Paid</div>
                            <div className="text-lg font-bold text-text-primary">{parentTx.fee} sats</div>
                        </div>
                        <div className="p-3 bg-bg-tertiary rounded-lg text-center">
                            <div className="text-xs text-text-muted mb-1">Your Output</div>
                            <div className="text-lg font-bold text-text-primary">{parentTx.amount.toLocaleString()} sats</div>
                        </div>
                        <div className="p-3 bg-bg-tertiary rounded-lg text-center">
                            <div className="text-xs text-text-muted mb-1">Size</div>
                            <div className="text-lg font-bold text-text-primary">{parentTx.size} vB</div>
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm">
                        <div className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <div className="text-yellow-400 font-medium mb-1">You control output #{parentTx.vout}</div>
                                <div className="text-text-secondary text-xs">
                                    Someone sent you {parentTx.amount.toLocaleString()} sats, but the transaction is stuck because of low fees.
                                    You can spend this output in a child transaction with high fees to get both confirmed.
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Child Transaction Builder */}
            <Card className="bg-bg-secondary border-purple-500/30">
                <CardContent className="pt-6">
                    <h4 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-purple-400" />
                        Build Child Transaction
                    </h4>

                    <div className="space-y-4">
                        {/* Target Fee Rate */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <Label className="text-sm text-text-secondary">Target Package Fee Rate</Label>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl font-bold text-purple-400">{targetFeeRate}</span>
                                    <span className="text-sm text-text-muted">sat/vB</span>
                                </div>
                            </div>
                            <input
                                type="range"
                                min="5"
                                max="100"
                                value={targetFeeRate}
                                onChange={(e) => setTargetFeeRate(parseInt(e.target.value))}
                                className="w-full accent-purple-500"
                            />
                            <div className="flex justify-between text-xs text-text-muted mt-1">
                                <span>Low Priority</span>
                                <span>Standard</span>
                                <span>High Priority</span>
                            </div>
                        </div>

                        {/* Recipient */}
                        <div>
                            <Label className="text-sm text-text-secondary mb-2">Recipient Address</Label>
                            <Input
                                value={recipientAddress}
                                onChange={(e) => setRecipientAddress(e.target.value)}
                                placeholder="bc1q..."
                                className="bg-bg-tertiary border-border font-mono text-sm"
                            />
                        </div>

                        {/* Amount */}
                        <div>
                            <Label className="text-sm text-text-secondary mb-2">
                                Amount to Send (sats)
                                <span className="text-xs text-text-muted ml-2">Max: {parentTx.amount.toLocaleString()}</span>
                            </Label>
                            <Input
                                type="number"
                                value={recipientAmount}
                                onChange={(e) => setRecipientAmount(parseInt(e.target.value) || 0)}
                                max={parentTx.amount}
                                className="bg-bg-tertiary border-border font-mono"
                            />
                        </div>

                        {/* Estimated Child Size */}
                        <div>
                            <Label className="text-sm text-text-secondary mb-2">
                                Estimated Child TX Size (vB)
                            </Label>
                            <Input
                                type="number"
                                value={estimatedChildSize}
                                onChange={(e) => setEstimatedChildSize(parseInt(e.target.value) || 100)}
                                className="bg-bg-tertiary border-border font-mono"
                            />
                            <p className="text-xs text-text-muted mt-1">
                                Typical: ~140 vB (1 input, 2 outputs, P2WPKH)
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* CPFP Calculation */}
            <Card className="bg-bg-secondary border-purple-500/30">
                <CardContent className="pt-6">
                    <h4 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-purple-400" />
                        CPFP Fee Calculation
                    </h4>

                    {/* Visual Flow */}
                    <div className="flex flex-col items-center gap-4 mb-6">
                        {/* Parent */}
                        <div className="w-full max-w-md p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium text-yellow-400">Parent TX</div>
                                    <div className="text-xs text-text-muted">{parentTx.size} vB × {parentFeeRate.toFixed(1)} sat/vB</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-yellow-400">{parentTx.fee} sats</div>
                                    <div className="text-xs text-text-muted">fee paid</div>
                                </div>
                            </div>
                        </div>

                        {/* Connection */}
                        <div className="flex flex-col items-center">
                            <ArrowDown className="w-6 h-6 text-purple-400" />
                            <div className="text-xs text-purple-400 font-medium">spends output</div>
                        </div>

                        {/* Child */}
                        <div className="w-full max-w-md p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm font-medium text-purple-400">Child TX</div>
                                    <div className="text-xs text-text-muted">{estimatedChildSize} vB × {childFeeRate.toFixed(1)} sat/vB</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-purple-400">{requiredChildFee.toFixed(0)} sats</div>
                                    <div className="text-xs text-text-muted">fee required</div>
                                </div>
                            </div>
                        </div>

                        {/* Package Result */}
                        <div className="w-full max-w-md p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <div className="text-center">
                                <div className="text-sm font-medium text-green-400 mb-2">Package Fee Rate</div>
                                <div className="text-3xl font-bold text-green-400">{actualPackageFeeRate.toFixed(1)} sat/vB</div>
                                <div className="text-xs text-text-muted mt-1">
                                    ({targetTotalFee.toFixed(0)} sats ÷ {totalPackageSize} vB)
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Formula Breakdown */}
                    <div className="p-4 bg-bg-tertiary rounded-lg">
                        <h5 className="font-medium text-text-primary mb-3 text-sm">Formula Breakdown</h5>
                        <div className="space-y-2 font-mono text-xs">
                            <div className="flex justify-between">
                                <span className="text-text-muted">Total Package Size:</span>
                                <span className="text-text-primary">{parentTx.size} + {estimatedChildSize} = {totalPackageSize} vB</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-muted">Target Total Fee:</span>
                                <span className="text-text-primary">{targetFeeRate} × {totalPackageSize} = {targetTotalFee.toFixed(0)} sats</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-border">
                                <span className="text-purple-400">Child Fee Needed:</span>
                                <span className="text-purple-400 font-bold">{targetTotalFee.toFixed(0)} - {parentTx.fee} = {requiredChildFee.toFixed(0)} sats</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Transaction Summary */}
            <Card className="bg-bg-secondary border-border">
                <CardContent className="pt-6">
                    <h4 className="font-semibold text-text-primary mb-4">Child Transaction Summary</h4>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-text-muted">Input (from parent):</span>
                            <span className="font-mono text-text-primary">{parentTx.amount.toLocaleString()} sats</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-muted">To Recipient:</span>
                            <span className="font-mono text-text-primary">{recipientAmount.toLocaleString()} sats</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-muted">Child Fee:</span>
                            <span className="font-mono text-purple-400">{requiredChildFee.toFixed(0)} sats</span>
                        </div>
                        <div className="flex justify-between pb-2">
                            <span className="text-text-muted">Change:</span>
                            <span className={`font-mono ${hasChange ? 'text-text-primary' : 'text-red-400'}`}>
                                {changeAmount >= 0 ? changeAmount.toFixed(0) : '0'} sats
                                {!hasChange && changeAmount > 0 && ' (dust)'}
                            </span>
                        </div>
                    </div>

                    {/* Validation */}
                    <div className="mt-4 space-y-2">
                        {changeAmount < 0 && (
                            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                Insufficient funds! Reduce recipient amount or lower target fee rate.
                            </div>
                        )}
                        {changeAmount >= 0 && changeAmount < 546 && changeAmount > 0 && (
                            <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm text-yellow-400 flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                Change below dust threshold. Will be added to fee.
                            </div>
                        )}
                        {isValid && hasChange && (
                            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-sm text-green-400 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                Transaction valid! Both parent and child will confirm together.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Action Button */}
            <Button
                disabled={!isValid}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/30 h-12 text-base"
            >
                <Baby className="w-5 h-5 mr-2" />
                Create CPFP Child Transaction
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
                            {`import { createCPFPTransaction } from '@caravan/fees';

const cpfpTx = createCPFPTransaction({
  parentTransaction: {
    txid: '${parentTx.txid}',
    vout: ${parentTx.vout},
    amount: ${parentTx.amount},
    fee: ${parentTx.fee},
    size: ${parentTx.size}
  },
  targetFeeRate: ${targetFeeRate},
  recipientAddress: '${recipientAddress}',
  recipientAmount: ${recipientAmount},
  estimatedChildSize: ${estimatedChildSize}
});

// Result:
// Child fee: ${requiredChildFee.toFixed(0)} sats
// Package fee rate: ${actualPackageFeeRate.toFixed(1)} sat/vB
// Status: ${isValid ? 'Ready to broadcast' : 'Needs adjustment'}`}
                        </pre>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}