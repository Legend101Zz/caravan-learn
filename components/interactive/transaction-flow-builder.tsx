'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Plus,
    Minus,
    ArrowRight,
    ArrowDown,
    Coins,
    Send,
    RefreshCw,
    Settings,
    Eye,
    Copy,
    Check,
    AlertTriangle,
    CheckCircle2,
    Zap,
    ChevronRight,
    Layers
} from 'lucide-react';
import { PSBTVisualizer } from './psbt-visualizer';

interface UTXO {
    id: string;
    txid: string;
    vout: number;
    amount: number;
    selected: boolean;
}

interface Output {
    id: string;
    address: string;
    amount: number;
    type: 'recipient' | 'change';
}

const SAMPLE_UTXOS: UTXO[] = [
    { id: '1', txid: 'a1b2c3d4e5f6...', vout: 0, amount: 50000, selected: false },
    { id: '2', txid: 'b2c3d4e5f6a1...', vout: 1, amount: 30000, selected: false },
    { id: '3', txid: 'c3d4e5f6a1b2...', vout: 0, amount: 100000, selected: false },
    { id: '4', txid: 'd4e5f6a1b2c3...', vout: 2, amount: 25000, selected: false },
];

export function TransactionFlowBuilder() {
    const [utxos, setUtxos] = useState<UTXO[]>(SAMPLE_UTXOS);
    const [outputs, setOutputs] = useState<Output[]>([
        { id: '1', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', amount: 40000, type: 'recipient' }
    ]);
    const [feeRate, setFeeRate] = useState(5);
    const [showPSBT, setShowPSBT] = useState(false);
    const [currentStep, setCurrentStep] = useState<'inputs' | 'outputs' | 'fees' | 'psbt'>('inputs');

    // Calculations
    const selectedUtxos = utxos.filter(u => u.selected);
    const totalInput = selectedUtxos.reduce((sum, u) => sum + u.amount, 0);
    const totalOutput = outputs.reduce((sum, o) => sum + o.amount, 0);

    // Estimate transaction size (simplified)
    const estimatedSize = 10 + (selectedUtxos.length * 68) + (outputs.length * 31) + 50; // P2WSH multisig rough estimate
    const estimatedFee = Math.ceil(estimatedSize * feeRate);
    const change = totalInput - totalOutput - estimatedFee;

    const isValid = totalInput > 0 && totalOutput > 0 && change >= 0;

    const toggleUtxo = (id: string) => {
        setUtxos(utxos.map(u => u.id === id ? { ...u, selected: !u.selected } : u));
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

    const buildPSBT = () => {
        setShowPSBT(true);
        setCurrentStep('psbt');
    };

    // Mock PSBT data for visualization
    const mockPSBT = useMemo(() => ({
        version: 0,
        inputs: selectedUtxos.map(u => ({
            txid: u.txid,
            vout: u.vout,
            amount: u.amount,
            witnessUtxo: true,
            partialSigs: 0,
            requiredSigs: 2
        })),
        outputs: [
            ...outputs.map(o => ({
                address: o.address || 'bc1q...',
                amount: o.amount,
                type: o.type
            })),
            ...(change > 546 ? [{
                address: 'bc1q_change...',
                amount: change,
                type: 'change' as const
            }] : [])
        ],
        fee: estimatedFee,
        feeRate: feeRate,
        size: estimatedSize
    }), [selectedUtxos, outputs, change, estimatedFee, feeRate, estimatedSize]);

    return (
        <div className="space-y-8">
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-4 mb-8">
                {(['inputs', 'outputs', 'fees', 'psbt'] as const).map((step, index) => (
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
                            {step.charAt(0).toUpperCase() + step.slice(1)}
                        </motion.button>
                        {index < 3 && (
                            <ChevronRight className="w-4 h-4 text-text-muted" />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Neural Network Style Flow */}
            <Card className="bg-bg-secondary border-pkg-fees/30 overflow-hidden">
                <CardContent className="pt-6">
                    <div className="grid lg:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 items-start">

                        {/* INPUTS Column */}
                        <div className={`transition-opacity ${currentStep === 'inputs' ? 'opacity-100' : 'opacity-60'}`}>
                            <div className="text-center mb-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium">
                                    <Coins className="w-4 h-4" />
                                    Inputs (UTXOs)
                                </div>
                            </div>

                            <div className="space-y-3">
                                {utxos.map((utxo, index) => (
                                    <motion.div
                                        key={utxo.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onClick={() => toggleUtxo(utxo.id)}
                                        className={`
                                            p-3 rounded-lg border-2 cursor-pointer transition-all
                                            ${utxo.selected
                                                ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                                                : 'border-border bg-bg-tertiary hover:border-blue-500/50'}
                                        `}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-mono text-xs text-text-muted">{utxo.txid}</div>
                                                <div className="text-sm font-medium text-text-primary">
                                                    {utxo.amount.toLocaleString()} sats
                                                </div>
                                            </div>
                                            <div className={`
                                                w-6 h-6 rounded-full flex items-center justify-center
                                                ${utxo.selected ? 'bg-blue-500 text-white' : 'bg-bg-secondary'}
                                            `}>
                                                {utxo.selected && <Check className="w-4 h-4" />}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-4 p-3 bg-bg-tertiary rounded-lg">
                                <div className="text-xs text-text-muted">Total Selected</div>
                                <div className="text-lg font-bold text-blue-400">
                                    {totalInput.toLocaleString()} sats
                                </div>
                            </div>
                        </div>

                        {/* Arrow 1 */}
                        <div className="hidden lg:flex items-center justify-center h-full">
                            <motion.div
                                animate={{ x: [0, 10, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <ArrowRight className="w-8 h-8 text-pkg-fees" />
                            </motion.div>
                        </div>

                        {/* TRANSACTION CENTER */}
                        <div className={`transition-opacity ${currentStep === 'fees' ? 'opacity-100' : 'opacity-60'}`}>
                            <div className="text-center mb-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pkg-fees/20 text-pkg-fees text-sm font-medium">
                                    <Settings className="w-4 h-4" />
                                    Transaction
                                </div>
                            </div>

                            <motion.div
                                animate={{
                                    boxShadow: isValid
                                        ? ['0 0 20px rgba(236, 72, 153, 0.2)', '0 0 40px rgba(236, 72, 153, 0.4)', '0 0 20px rgba(236, 72, 153, 0.2)']
                                        : '0 0 0 rgba(0,0,0,0)'
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="p-4 rounded-xl border-2 border-pkg-fees/50 bg-pkg-fees/5"
                            >
                                <div className="space-y-4">
                                    {/* Fee Rate Slider */}
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-text-secondary">Fee Rate</span>
                                            <span className="text-pkg-fees font-mono">{feeRate} sat/vB</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1"
                                            max="50"
                                            value={feeRate}
                                            onChange={(e) => setFeeRate(parseInt(e.target.value))}
                                            className="w-full accent-pkg-fees"
                                        />
                                        <div className="flex justify-between text-xs text-text-muted mt-1">
                                            <span>Economy</span>
                                            <span>Priority</span>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="p-2 bg-bg-tertiary rounded">
                                            <div className="text-xs text-text-muted">Est. Size</div>
                                            <div className="font-mono text-text-primary">{estimatedSize} vB</div>
                                        </div>
                                        <div className="p-2 bg-bg-tertiary rounded">
                                            <div className="text-xs text-text-muted">Total Fee</div>
                                            <div className="font-mono text-pkg-fees">{estimatedFee} sats</div>
                                        </div>
                                    </div>

                                    {/* Validation */}
                                    {change < 0 && (
                                        <div className="p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400 flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4" />
                                            Insufficient funds! Need {Math.abs(change)} more sats
                                        </div>
                                    )}
                                    {change > 0 && change < 546 && (
                                        <div className="p-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs text-yellow-400 flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4" />
                                            Change ({change} sats) below dust threshold
                                        </div>
                                    )}
                                    {isValid && change >= 546 && (
                                        <div className="p-2 bg-green-500/10 border border-green-500/30 rounded text-xs text-green-400 flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Transaction valid! Change: {change.toLocaleString()} sats
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* Arrow 2 */}
                        <div className="hidden lg:flex items-center justify-center h-full">
                            <motion.div
                                animate={{ x: [0, 10, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                            >
                                <ArrowRight className="w-8 h-8 text-pkg-fees" />
                            </motion.div>
                        </div>

                        {/* OUTPUTS Column */}
                        <div className={`transition-opacity ${currentStep === 'outputs' ? 'opacity-100' : 'opacity-60'}`}>
                            <div className="text-center mb-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">
                                    <Send className="w-4 h-4" />
                                    Outputs
                                </div>
                            </div>

                            <div className="space-y-3">
                                {outputs.map((output, index) => (
                                    <motion.div
                                        key={output.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="p-3 rounded-lg border-2 border-green-500/30 bg-green-500/5"
                                    >
                                        <div className="space-y-2">
                                            <Input
                                                placeholder="Recipient address"
                                                value={output.address}
                                                onChange={(e) => updateOutput(output.id, 'address', e.target.value)}
                                                className="font-mono text-xs bg-bg-tertiary border-border"
                                            />
                                            <div className="flex gap-2">
                                                <Input
                                                    type="number"
                                                    placeholder="Amount (sats)"
                                                    value={output.amount || ''}
                                                    onChange={(e) => updateOutput(output.id, 'amount', parseInt(e.target.value) || 0)}
                                                    className="font-mono text-sm bg-bg-tertiary border-border"
                                                />
                                                {outputs.length > 1 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeOutput(output.id)}
                                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Change Output */}
                                {change > 546 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-3 rounded-lg border-2 border-dashed border-yellow-500/30 bg-yellow-500/5"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-xs text-yellow-400 mb-1">Change Output</div>
                                                <div className="text-sm font-medium text-text-primary">
                                                    {change.toLocaleString()} sats
                                                </div>
                                            </div>
                                            <RefreshCw className="w-5 h-5 text-yellow-400" />
                                        </div>
                                    </motion.div>
                                )}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={addOutput}
                                    className="w-full border-dashed border-green-500/30 text-green-400 hover:bg-green-500/10"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Output
                                </Button>
                            </div>

                            <div className="mt-4 p-3 bg-bg-tertiary rounded-lg">
                                <div className="text-xs text-text-muted">Total Output</div>
                                <div className="text-lg font-bold text-green-400">
                                    {totalOutput.toLocaleString()} sats
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Build PSBT Button */}
                    <div className="mt-8 text-center">
                        <Button
                            onClick={buildPSBT}
                            disabled={!isValid}
                            size="lg"
                            className="bg-pkg-fees hover:bg-pkg-fees/80 text-white shadow-lg shadow-pkg-fees/30"
                        >
                            <Layers className="w-5 h-5 mr-2" />
                            Build PSBT
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* PSBT Output */}
            <AnimatePresence>
                {showPSBT && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <PSBTVisualizer psbt={mockPSBT} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}