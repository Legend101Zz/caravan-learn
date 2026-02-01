/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Plus,
    Minus,
    ArrowRight,
    Coins,
    Send,
    RefreshCw,
    Eye,
    AlertTriangle,
    CheckCircle2,
    Info,
    Trash2,
    Sparkles,
    FileText,
    ChevronRight,
    Zap
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UTXO {
    id: string;
    txid: string;
    vout: number;
    amount: number;
    address: string;
    selected: boolean;
}

interface Output {
    id: string;
    address: string;
    amount: number;
    type: 'recipient' | 'change';
}

// Preloaded example UTXOs
const EXAMPLE_UTXOS: UTXO[] = [
    {
        id: '1',
        txid: 'a1b2c3d4e5f6789...',
        vout: 0,
        amount: 100000,
        address: 'bc1q...utxo1',
        selected: false
    },
    {
        id: '2',
        txid: 'b2c3d4e5f6a1789...',
        vout: 1,
        amount: 50000,
        address: 'bc1q...utxo2',
        selected: false
    },
    {
        id: '3',
        txid: 'c3d4e5f6a1b2789...',
        vout: 0,
        amount: 200000,
        address: 'bc1q...utxo3',
        selected: false
    },
    {
        id: '4',
        txid: 'd4e5f6a1b2c3789...',
        vout: 2,
        amount: 75000,
        address: 'bc1q...utxo4',
        selected: false
    },
];

const EXAMPLE_OUTPUTS: Output[] = [
    {
        id: '1',
        address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        amount: 80000,
        type: 'recipient'
    }
];

export function EnhancedTransactionBuilder() {
    const [utxos, setUtxos] = useState<UTXO[]>(EXAMPLE_UTXOS);
    const [outputs, setOutputs] = useState<Output[]>(EXAMPLE_OUTPUTS);
    const [feeRate, setFeeRate] = useState(5);
    const [showExplanation, setShowExplanation] = useState(true);
    const [currentStep, setCurrentStep] = useState<'inputs' | 'outputs' | 'review'>('inputs');
    const [scriptType, setScriptType] = useState<'P2WSH' | 'P2WPKH'>('P2WSH');
    const [multisigConfig, setMultisigConfig] = useState({ m: 2, n: 3 });

    // Calculate transaction size based on inputs/outputs and script type
    const calculateTransactionSize = useCallback(() => {
        const selectedCount = utxos.filter(u => u.selected).length;
        const outputCount = outputs.length;

        if (scriptType === 'P2WPKH') {
            // P2WPKH: ~68 vB per input, ~31 vB per output, ~11 vB overhead
            return 11 + (selectedCount * 68) + (outputCount * 31);
        } else {
            // P2WSH 2-of-3 multisig: ~104 vB per input, ~43 vB per output, ~11 vB overhead
            const witnessSize = 1 + 1 + (multisigConfig.m * 73) + multisigConfig.n * 34;
            const inputSize = 41 + Math.ceil(witnessSize / 4);
            return 11 + (selectedCount * inputSize) + (outputCount * 43);
        }
    }, [utxos, outputs, scriptType, multisigConfig]);

    // Calculations
    const selectedUtxos = useMemo(() => utxos.filter(u => u.selected), [utxos]);
    const totalInput = useMemo(() => selectedUtxos.reduce((sum, u) => sum + u.amount, 0), [selectedUtxos]);
    const totalOutput = useMemo(() => outputs.reduce((sum, o) => sum + o.amount, 0), [outputs]);
    const estimatedSize = useMemo(() => calculateTransactionSize(), [calculateTransactionSize]);
    const estimatedFee = useMemo(() => Math.ceil(estimatedSize * feeRate), [estimatedSize, feeRate]);
    const change = useMemo(() => totalInput - totalOutput - estimatedFee, [totalInput, totalOutput, estimatedFee]);
    const changeAfterAdjustment = useMemo(() => {
        if (change < 546) return 0; // Below dust threshold
        // Recalculate with change output included
        const sizeWithChange = scriptType === 'P2WPKH'
            ? estimatedSize + 31
            : estimatedSize + 43;
        const feeWithChange = Math.ceil(sizeWithChange * feeRate);
        return totalInput - totalOutput - feeWithChange;
    }, [change, totalInput, totalOutput, feeRate, estimatedSize, scriptType]);

    const isValid = totalInput > 0 && totalOutput > 0 && change >= 0;

    // Event handlers
    const toggleUtxo = (id: string) => {
        setUtxos(utxos.map(u => u.id === id ? { ...u, selected: !u.selected } : u));
    };

    const addUtxo = () => {
        const newUtxo: UTXO = {
            id: Date.now().toString(),
            txid: '',
            vout: 0,
            amount: 0,
            address: '',
            selected: true
        };
        setUtxos([...utxos, newUtxo]);
    };

    const updateUtxo = (id: string, field: keyof UTXO, value: any) => {
        setUtxos(utxos.map(u => u.id === id ? { ...u, [field]: value } : u));
    };

    const removeUtxo = (id: string) => {
        setUtxos(utxos.filter(u => u.id !== id));
    };

    const addOutput = () => {
        setOutputs([...outputs, {
            id: Date.now().toString(),
            address: '',
            amount: 0,
            type: 'recipient'
        }]);
    };

    const removeOutput = (id: string) => {
        setOutputs(outputs.filter(o => o.id !== id));
    };

    const updateOutput = (id: string, field: 'address' | 'amount', value: string | number) => {
        setOutputs(outputs.map(o => o.id === id ? { ...o, [field]: value } : o));
    };

    const resetToExample = () => {
        setUtxos(EXAMPLE_UTXOS);
        setOutputs(EXAMPLE_OUTPUTS);
        setFeeRate(5);
        setCurrentStep('inputs');
    };

    return (
        <div className="space-y-8">
            {/* Header with Reset */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                        <Sparkles className="text-pkg-fees" />
                        Build Your Transaction
                    </h3>
                    <p className="text-text-secondary text-sm mt-1">
                        Learn how Bitcoin transactions work by building one yourself
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={resetToExample}
                    className="border-pkg-fees/30 text-pkg-fees hover:bg-pkg-fees/10"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset to Example
                </Button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-4">
                {(['inputs', 'outputs', 'review'] as const).map((step, index) => (
                    <React.Fragment key={step}>
                        <motion.button
                            onClick={() => setCurrentStep(step)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm
                                transition-all cursor-pointer
                                ${currentStep === step
                                    ? 'bg-pkg-fees text-white shadow-lg shadow-pkg-fees/30'
                                    : 'bg-bg-tertiary text-text-secondary hover:bg-bg-card'}
                            `}
                        >
                            <span className={`
                                w-6 h-6 rounded-full flex items-center justify-center text-xs
                                ${currentStep === step ? 'bg-white/20' : 'bg-bg-secondary'}
                            `}>
                                {index + 1}
                            </span>
                            {step === 'inputs' ? 'Select Inputs' : step === 'outputs' ? 'Add Outputs' : 'Review & Build'}
                        </motion.button>
                        {index < 2 && (
                            <ChevronRight className="w-4 h-4 text-text-muted" />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Configuration Panel */}
            <Card className="bg-bg-secondary border-border">
                <CardContent className="pt-6">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <Label className="text-sm text-text-secondary mb-2 flex items-center gap-2">
                                Script Type
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Info className="w-3 h-3 text-text-muted" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-xs max-w-xs">
                                                P2WPKH: Single-sig SegWit (smaller)<br />
                                                P2WSH: Multisig SegWit (larger)
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </Label>
                            <select
                                value={scriptType}
                                onChange={(e) => setScriptType(e.target.value as 'P2WSH' | 'P2WPKH')}
                                className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded-lg text-text-primary text-sm"
                            >
                                <option value="P2WPKH">P2WPKH (Single-sig)</option>
                                <option value="P2WSH">P2WSH (Multisig)</option>
                            </select>
                        </div>

                        {scriptType === 'P2WSH' && (
                            <div>
                                <Label className="text-sm text-text-secondary mb-2">Multisig Config</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        min={1}
                                        max={multisigConfig.n}
                                        value={multisigConfig.m}
                                        onChange={(e) => setMultisigConfig({ ...multisigConfig, m: parseInt(e.target.value) })}
                                        className="w-16 bg-bg-tertiary border-border"
                                    />
                                    <span className="text-text-secondary flex items-center">of</span>
                                    <Input
                                        type="number"
                                        min={multisigConfig.m}
                                        max={15}
                                        value={multisigConfig.n}
                                        onChange={(e) => setMultisigConfig({ ...multisigConfig, n: parseInt(e.target.value) })}
                                        className="w-16 bg-bg-tertiary border-border"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <Label className="text-sm text-text-secondary mb-2 flex items-center justify-between">
                                <span>Fee Rate</span>
                                <span className="text-pkg-fees font-mono">{feeRate} sat/vB</span>
                            </Label>
                            <input
                                type="range"
                                min="1"
                                max="100"
                                value={feeRate}
                                onChange={(e) => setFeeRate(parseInt(e.target.value))}
                                className="w-full accent-pkg-fees"
                            />
                            <div className="flex justify-between text-xs text-text-muted mt-1">
                                <span>Economy</span>
                                <span>Standard</span>
                                <span>Priority</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Main Builder */}
            <Card className="bg-bg-secondary border-pkg-fees/30">
                <CardContent className="pt-6">
                    <AnimatePresence mode="wait">
                        {currentStep === 'inputs' && (
                            <motion.div
                                key="inputs"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Coins className="w-5 h-5 text-blue-400" />
                                        <h4 className="font-semibold text-text-primary">Select Inputs (UTXOs)</h4>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={addUtxo}
                                        className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add UTXO
                                    </Button>
                                </div>

                                {showExplanation && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg mb-4"
                                    >
                                        <div className="flex items-start gap-3">
                                            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <h5 className="font-medium text-blue-400 mb-1">What are Inputs?</h5>
                                                <p className="text-sm text-text-secondary">
                                                    Inputs are UTXOs (Unspent Transaction Outputs) from previous transactions.
                                                    Think of them as "bills" in your wallet that you'll spend. Each UTXO has
                                                    a specific amount that must be fully spent.
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setShowExplanation(false)}
                                                className="text-text-muted hover:text-text-secondary"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="space-y-3">
                                    {utxos.map((utxo, index) => (
                                        <motion.div
                                            key={utxo.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`
                                                p-4 rounded-lg border-2 transition-all
                                                ${utxo.selected
                                                    ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                                                    : 'border-border bg-bg-tertiary hover:border-blue-500/50'}
                                            `}
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <button
                                                    onClick={() => toggleUtxo(utxo.id)}
                                                    className={`
                                                        w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all
                                                        ${utxo.selected
                                                            ? 'bg-blue-500 border-blue-500'
                                                            : 'border-border bg-bg-secondary hover:border-blue-500/50'}
                                                    `}
                                                >
                                                    {utxo.selected && <CheckCircle2 className="w-4 h-4 text-white" />}
                                                </button>
                                                <div className="flex-1 grid grid-cols-3 gap-2">
                                                    <Input
                                                        placeholder="TXID"
                                                        value={utxo.txid}
                                                        onChange={(e) => updateUtxo(utxo.id, 'txid', e.target.value)}
                                                        className="font-mono text-xs bg-bg-secondary border-border"
                                                    />
                                                    <Input
                                                        type="number"
                                                        placeholder="vOut"
                                                        value={utxo.vout || ''}
                                                        onChange={(e) => updateUtxo(utxo.id, 'vout', parseInt(e.target.value) || 0)}
                                                        className="font-mono text-xs bg-bg-secondary border-border"
                                                    />
                                                    <Input
                                                        type="number"
                                                        placeholder="Amount (sats)"
                                                        value={utxo.amount || ''}
                                                        onChange={(e) => updateUtxo(utxo.id, 'amount', parseInt(e.target.value) || 0)}
                                                        className="font-mono text-xs bg-bg-secondary border-border"
                                                    />
                                                </div>
                                                {utxos.length > 1 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeUtxo(utxo.id)}
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                            {utxo.selected && (
                                                <div className="text-xs text-blue-400 font-medium">
                                                    ✓ {utxo.amount.toLocaleString()} sats selected
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="mt-6 p-4 bg-bg-tertiary rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-text-muted">Total Selected Input</span>
                                        <span className="text-2xl font-bold text-blue-400">
                                            {totalInput.toLocaleString()} <span className="text-sm">sats</span>
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => setCurrentStep('outputs')}
                                    disabled={selectedUtxos.length === 0}
                                    className="w-full bg-pkg-fees hover:bg-pkg-fees/80"
                                >
                                    Continue to Outputs
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </motion.div>
                        )}

                        {currentStep === 'outputs' && (
                            <motion.div
                                key="outputs"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Send className="w-5 h-5 text-green-400" />
                                        <h4 className="font-semibold text-text-primary">Add Outputs</h4>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={addOutput}
                                        className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Recipient
                                    </Button>
                                </div>

                                {showExplanation && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg mb-4"
                                    >
                                        <div className="flex items-start gap-3">
                                            <Info className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <h5 className="font-medium text-green-400 mb-1">What are Outputs?</h5>
                                                <p className="text-sm text-text-secondary">
                                                    Outputs specify where the Bitcoin goes. You need at least one output (the recipient).
                                                    If you have leftover funds after fees, they become "change" sent back to you.
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setShowExplanation(false)}
                                                className="text-text-muted hover:text-text-secondary"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="space-y-3">
                                    {outputs.map((output, index) => (
                                        <motion.div
                                            key={output.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="p-4 rounded-lg border-2 border-green-500/30 bg-green-500/5"
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-bold">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 grid grid-cols-2 gap-2">
                                                    <Input
                                                        placeholder="Recipient address (bc1q...)"
                                                        value={output.address}
                                                        onChange={(e) => updateOutput(output.id, 'address', e.target.value)}
                                                        className="font-mono text-xs bg-bg-tertiary border-border"
                                                    />
                                                    <Input
                                                        type="number"
                                                        placeholder="Amount (sats)"
                                                        value={output.amount || ''}
                                                        onChange={(e) => updateOutput(output.id, 'amount', parseInt(e.target.value) || 0)}
                                                        className="font-mono text-xs bg-bg-tertiary border-border"
                                                    />
                                                </div>
                                                {outputs.length > 1 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeOutput(output.id)}
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}

                                    {/* Change Output Preview */}
                                    {changeAfterAdjustment > 546 && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="p-4 rounded-lg border-2 border-dashed border-yellow-500/30 bg-yellow-500/5"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <RefreshCw className="w-5 h-5 text-yellow-400" />
                                                    <div>
                                                        <div className="text-sm font-medium text-text-primary">Change Output (Auto)</div>
                                                        <div className="text-xs text-text-muted">Will be sent back to your wallet</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-lg font-bold text-yellow-400">
                                                        {changeAfterAdjustment.toLocaleString()} <span className="text-xs">sats</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {changeAfterAdjustment > 0 && changeAfterAdjustment < 546 && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-xs text-yellow-400 flex items-center gap-2"
                                        >
                                            <AlertTriangle className="w-4 h-4" />
                                            Change ({changeAfterAdjustment} sats) below dust threshold (546 sats). Will be added to fee.
                                        </motion.div>
                                    )}
                                </div>

                                <div className="mt-6 p-4 bg-bg-tertiary rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-text-muted">Total Output Amount</span>
                                        <span className="text-2xl font-bold text-green-400">
                                            {totalOutput.toLocaleString()} <span className="text-sm">sats</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentStep('inputs')}
                                        className="flex-1"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        onClick={() => setCurrentStep('review')}
                                        disabled={outputs.length === 0 || totalOutput === 0}
                                        className="flex-1 bg-pkg-fees hover:bg-pkg-fees/80"
                                    >
                                        Review Transaction
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {currentStep === 'review' && (
                            <motion.div
                                key="review"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                <div className="text-center mb-6">
                                    <FileText className="w-16 h-16 text-pkg-fees mx-auto mb-3" />
                                    <h4 className="text-xl font-bold text-text-primary mb-2">Transaction Summary</h4>
                                    <p className="text-sm text-text-secondary">Review your transaction before building the PSBT</p>
                                </div>

                                {/* Flow Visualization */}
                                <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
                                    {/* Inputs Summary */}
                                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Coins className="w-5 h-5 text-blue-400" />
                                            <span className="font-semibold text-blue-400">Inputs</span>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-text-muted">Count:</span>
                                                <span className="text-text-primary font-mono">{selectedUtxos.length}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-text-muted">Total:</span>
                                                <span className="text-blue-400 font-mono font-bold">
                                                    {totalInput.toLocaleString()} sats
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <div className="flex flex-col items-center">
                                        <motion.div
                                            animate={{ x: [0, 10, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            <ArrowRight className="w-8 h-8 text-pkg-fees" />
                                        </motion.div>
                                        <div className="mt-2 text-center">
                                            <div className="text-xs text-text-muted">Fee</div>
                                            <div className="text-sm font-mono text-pkg-fees font-bold">
                                                -{estimatedFee}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Outputs Summary */}
                                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Send className="w-5 h-5 text-green-400" />
                                            <span className="font-semibold text-green-400">Outputs</span>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-text-muted">Recipients:</span>
                                                <span className="text-text-primary font-mono">{outputs.length}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-text-muted">Change:</span>
                                                <span className="text-yellow-400 font-mono">
                                                    {changeAfterAdjustment > 546 ? changeAfterAdjustment.toLocaleString() : '0'} sats
                                                </span>
                                            </div>
                                            <div className="flex justify-between pt-2 border-t border-green-500/20">
                                                <span className="text-text-muted">Total:</span>
                                                <span className="text-green-400 font-mono font-bold">
                                                    {totalOutput.toLocaleString()} sats
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Transaction Details */}
                                <Card className="bg-bg-tertiary border-border">
                                    <CardContent className="pt-4">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-pkg-fees">{estimatedSize}</div>
                                                <div className="text-xs text-text-muted">vBytes</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-pkg-fees">{feeRate}</div>
                                                <div className="text-xs text-text-muted">sat/vB</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-pkg-fees">{estimatedFee}</div>
                                                <div className="text-xs text-text-muted">Total Fee (sats)</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-green-400">
                                                    {((estimatedFee / totalInput) * 100).toFixed(2)}%
                                                </div>
                                                <div className="text-xs text-text-muted">Fee %</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Validation */}
                                <div className="space-y-2">
                                    {change < 0 && (
                                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400 flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5" />
                                            <span>
                                                <strong>Insufficient funds!</strong> You need {Math.abs(change).toLocaleString()} more satoshis.
                                                Add more inputs or reduce output amounts.
                                            </span>
                                        </div>
                                    )}

                                    {isValid && (
                                        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-sm text-green-400 flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5" />
                                            <span><strong>Transaction is valid!</strong> Ready to build PSBT.</span>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentStep('outputs')}
                                        className="flex-1"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        disabled={!isValid}
                                        className="flex-1 bg-pkg-fees hover:bg-pkg-fees/80 text-white shadow-lg shadow-pkg-fees/30"
                                    >
                                        <Zap className="w-5 h-5 mr-2" />
                                        Build PSBT
                                    </Button>
                                </div>

                                {/* Educational Note */}
                                <div className="p-4 bg-pkg-fees/5 border border-pkg-fees/20 rounded-lg">
                                    <h5 className="font-semibold text-pkg-fees mb-2 flex items-center gap-2">
                                        <Info className="w-4 h-4" />
                                        What happens next?
                                    </h5>
                                    <ul className="text-sm text-text-secondary space-y-1 ml-6 list-disc">
                                        <li>PSBT (Partially Signed Bitcoin Transaction) is created</li>
                                        <li>Hardware wallets or signers will sign the transaction</li>
                                        <li>Once all required signatures are collected, it can be broadcast</li>
                                        <li>Miners will include it in a block based on your fee rate</li>
                                    </ul>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    );
}