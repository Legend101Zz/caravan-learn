/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    RefreshCw,
    Baby,
    ArrowRight,
    Coins,
    Send,
    CheckCircle2,
    Clock,
    Zap,
    Info,
    Play,
    RotateCcw,
    TrendingUp,
    AlertCircle
} from 'lucide-react';

export function InteractiveFeeStrategy() {
    const [strategy, setStrategy] = useState<'rbf' | 'cpfp'>('rbf');
    const [animationStep, setAnimationStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    // User-modifiable parameters
    const [originalFee, setOriginalFee] = useState(200);
    const [originalFeeRate, setOriginalFeeRate] = useState(1);
    const [parentSize, setParentSize] = useState(200);
    const [newFeeRate, setNewFeeRate] = useState(10);
    const [childSize, setChildSize] = useState(150);

    // Calculate CPFP child fee
    const targetPackageRate = newFeeRate;
    const totalPackageSize = parentSize + childSize;
    const targetTotalFee = targetPackageRate * totalPackageSize;
    const childFee = targetTotalFee - originalFee;
    const actualChildFeeRate = childFee / childSize;
    const actualPackageFeeRate = targetTotalFee / totalPackageSize;

    const playAnimation = () => {
        setIsPlaying(true);
        setAnimationStep(0);

        const steps = 4;
        let current = 0;

        const interval = setInterval(() => {
            current++;
            setAnimationStep(current);
            if (current >= steps) {
                clearInterval(interval);
                setIsPlaying(false);
            }
        }, 1500);
    };

    const reset = () => {
        setAnimationStep(0);
        setIsPlaying(false);
    };

    return (
        <div className="space-y-6">
            {/* Strategy Selector */}
            <div className="flex gap-4 justify-center">
                <Button
                    variant={strategy === 'rbf' ? 'default' : 'outline'}
                    onClick={() => { setStrategy('rbf'); reset(); }}
                    className={strategy === 'rbf' ? 'bg-green-500 hover:bg-green-600' : ''}
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    RBF (Replace-By-Fee)
                </Button>
                <Button
                    variant={strategy === 'cpfp' ? 'default' : 'outline'}
                    onClick={() => { setStrategy('cpfp'); reset(); }}
                    className={strategy === 'cpfp' ? 'bg-purple-500 hover:bg-purple-600' : ''}
                >
                    <Baby className="w-4 h-4 mr-2" />
                    CPFP (Child-Pays-For-Parent)
                </Button>
            </div>

            {/* Parameters Panel */}
            <Card className="bg-bg-secondary border-border">
                <CardContent className="pt-6">
                    <h4 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-pkg-fees" />
                        Adjust Parameters
                    </h4>

                    <div className="grid md:grid-cols-2 gap-4">
                        {strategy === 'rbf' ? (
                            <>
                                <div>
                                    <Label className="text-sm text-text-secondary mb-2">Original Fee Rate</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min={1}
                                            value={originalFeeRate}
                                            onChange={(e) => setOriginalFeeRate(parseInt(e.target.value) || 1)}
                                            className="bg-bg-tertiary border-border"
                                        />
                                        <span className="text-sm text-text-muted">sat/vB</span>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm text-text-secondary mb-2">New Fee Rate</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min={originalFeeRate + 1}
                                            value={newFeeRate}
                                            onChange={(e) => setNewFeeRate(parseInt(e.target.value) || originalFeeRate + 1)}
                                            className="bg-bg-tertiary border-border"
                                        />
                                        <span className="text-sm text-text-muted">sat/vB</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <Label className="text-sm text-text-secondary mb-2">Parent Fee</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min={1}
                                            value={originalFee}
                                            onChange={(e) => setOriginalFee(parseInt(e.target.value) || 1)}
                                            className="bg-bg-tertiary border-border"
                                        />
                                        <span className="text-sm text-text-muted">sats</span>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm text-text-secondary mb-2">Parent Size</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min={100}
                                            value={parentSize}
                                            onChange={(e) => setParentSize(parseInt(e.target.value) || 100)}
                                            className="bg-bg-tertiary border-border"
                                        />
                                        <span className="text-sm text-text-muted">vB</span>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm text-text-secondary mb-2">Child Size</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min={100}
                                            value={childSize}
                                            onChange={(e) => setChildSize(parseInt(e.target.value) || 100)}
                                            className="bg-bg-tertiary border-border"
                                        />
                                        <span className="text-sm text-text-muted">vB</span>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm text-text-secondary mb-2">Target Package Rate</Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="number"
                                            min={1}
                                            value={newFeeRate}
                                            onChange={(e) => setNewFeeRate(parseInt(e.target.value) || 1)}
                                            className="bg-bg-tertiary border-border"
                                        />
                                        <span className="text-sm text-text-muted">sat/vB</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* CPFP Calculation Display */}
                    {strategy === 'cpfp' && (
                        <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                            <h5 className="font-semibold text-purple-400 mb-3 text-sm">Calculated Child Fee</h5>
                            <div className="space-y-2 text-sm font-mono">
                                <div className="flex justify-between">
                                    <span className="text-text-muted">Total Package Size:</span>
                                    <span className="text-text-primary">{totalPackageSize} vB</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-muted">Target Total Fee:</span>
                                    <span className="text-text-primary">{targetTotalFee.toFixed(0)} sats</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-purple-500/20">
                                    <span className="text-purple-400">Child Fee Required:</span>
                                    <span className="text-purple-400 font-bold">{childFee.toFixed(0)} sats</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-muted">Child Fee Rate:</span>
                                    <span className="text-text-primary">{actualChildFeeRate.toFixed(1)} sat/vB</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-muted">Package Fee Rate:</span>
                                    <span className="text-green-400">{actualPackageFeeRate.toFixed(1)} sat/vB</span>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Animation Container */}
            <Card className={`bg-bg-secondary border-2 ${strategy === 'rbf' ? 'border-green-500/30' : 'border-purple-500/30'}`}>
                <CardContent className="pt-6">
                    <div className="min-h-[500px] relative flex flex-col">
                        <AnimatePresence mode="wait">
                            {strategy === 'rbf' ? (
                                <RBFVisualization
                                    key="rbf"
                                    step={animationStep}
                                    originalFeeRate={originalFeeRate}
                                    newFeeRate={newFeeRate}
                                />
                            ) : (
                                <CPFPVisualization
                                    key="cpfp"
                                    step={animationStep}
                                    parentFee={originalFee}
                                    parentFeeRate={originalFee / parentSize}
                                    childFee={childFee}
                                    childFeeRate={actualChildFeeRate}
                                    packageFeeRate={actualPackageFeeRate}
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-3 mt-6">
                        <Button
                            onClick={playAnimation}
                            disabled={isPlaying}
                            className={`flex-1 ${strategy === 'rbf' ? 'bg-green-500 hover:bg-green-600' : 'bg-purple-500 hover:bg-purple-600'}`}
                        >
                            {isPlaying ? (
                                <>
                                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                                    Playing...
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4 mr-2" />
                                    Watch Animation
                                </>
                            )}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={reset}
                            disabled={isPlaying}
                        >
                            <RotateCcw className="w-4 h-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Add these to the interactive-fee-strategy.tsx file

function RBFVisualization({
    step,
    originalFeeRate,
    newFeeRate
}: {
    step: number;
    originalFeeRate: number;
    newFeeRate: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-8 flex-1"
        >
            {/* Step Labels */}
            <div className="flex justify-center gap-4 mb-4 flex-wrap">
                {['Broadcast Low Fee', 'TX Stuck in Mempool', 'Create Replacement', 'Confirmed!'].map((label, i) => (
                    <div
                        key={i}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${step >= i
                            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                            : 'bg-bg-tertiary text-text-muted'
                            }`}
                    >
                        {label}
                    </div>
                ))}
            </div>

            {/* Visual Flow */}
            <div className="flex items-center gap-8 flex-wrap justify-center">
                {/* Original Transaction */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{
                        scale: step >= 0 ? 1 : 0,
                        opacity: step >= 2 ? 0.3 : 1
                    }}
                    className="relative"
                >
                    <TransactionBox
                        label="Original TX"
                        fee={`${originalFeeRate} sat/vB`}
                        status={step === 0 ? 'pending' : step === 1 ? 'stuck' : 'replaced'}
                        color="yellow"
                    />
                    {step === 1 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded whitespace-nowrap border border-red-500/30"
                        >
                            ⚠️ Stuck in mempool!
                        </motion.div>
                    )}
                    {step >= 2 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="w-full h-0.5 bg-red-500 rotate-45"></div>
                            <div className="w-full h-0.5 bg-red-500 -rotate-45 absolute"></div>
                        </motion.div>
                    )}
                </motion.div>

                {/* Arrow */}
                {step >= 2 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <ArrowRight className="w-8 h-8 text-green-500" />
                    </motion.div>
                )}

                {/* Replacement Transaction */}
                {step >= 2 && (
                    <motion.div
                        initial={{ scale: 0, x: -50 }}
                        animate={{ scale: 1, x: 0 }}
                        transition={{ type: 'spring', bounce: 0.5 }}
                    >
                        <TransactionBox
                            label="Replacement TX"
                            fee={`${newFeeRate} sat/vB`}
                            status={step >= 3 ? 'confirmed' : 'pending'}
                            color="green"
                            highlight
                        />
                    </motion.div>
                )}

                {/* Mempool to Block */}
                {step >= 3 && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <ArrowRight className="w-8 h-8 text-green-500" />
                        </motion.div>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', bounce: 0.5 }}
                        >
                            <BlockBox confirmed />
                        </motion.div>
                    </>
                )}
            </div>

            {/* Explanation */}
            <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-2xl p-4 bg-bg-tertiary rounded-lg border border-green-500/20"
            >
                {step === 0 && (
                    <p className="text-text-secondary">
                        You broadcast a transaction with a <span className="text-yellow-400 font-semibold">{originalFeeRate} sat/vB</span> fee rate.
                        It enters the mempool waiting for confirmation.
                    </p>
                )}
                {step === 1 && (
                    <p className="text-text-secondary">
                        The transaction is <span className="text-red-400 font-semibold">stuck in the mempool</span> because
                        miners are prioritizing transactions with higher fees. Your transaction might take hours or days!
                    </p>
                )}
                {step === 2 && (
                    <p className="text-text-secondary">
                        You create a <span className="text-green-400 font-semibold">replacement transaction</span> spending
                        the same inputs with a much higher fee of <span className="text-green-400 font-semibold">{newFeeRate} sat/vB</span>.
                        The network replaces the old transaction with this new one.
                    </p>
                )}
                {step >= 3 && (
                    <p className="text-text-secondary">
                        <span className="text-green-400 font-semibold">Success!</span> The replacement transaction is confirmed in the next block.
                        The original transaction is now invalid and will never confirm.
                    </p>
                )}
            </motion.div>

            {/* Key Points */}
            {step >= 2 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-2xl p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
                >
                    <h5 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        RBF Requirements (BIP125)
                    </h5>
                    <ul className="text-sm text-text-secondary space-y-1 ml-6 list-disc">
                        <li>Original TX must signal RBF (sequence &lt; 0xfffffffe)</li>
                        <li>New fee must be higher than original fee</li>
                        <li>Must spend at least one input from original TX</li>
                        <li>New fee ≥ original fee + relay fee increment</li>
                    </ul>
                </motion.div>
            )}
        </motion.div>
    );
}

function CPFPVisualization({
    step,
    parentFee,
    parentFeeRate,
    childFee,
    childFeeRate,
    packageFeeRate
}: {
    step: number;
    parentFee: number;
    parentFeeRate: number;
    childFee: number;
    childFeeRate: number;
    packageFeeRate: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-8 flex-1"
        >
            {/* Step Labels */}
            <div className="flex justify-center gap-4 mb-4 flex-wrap">
                {['Parent TX Stuck', 'You Receive Output', 'Create Child TX', 'Package Confirmed!'].map((label, i) => (
                    <div
                        key={i}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${step >= i
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                            : 'bg-bg-tertiary text-text-muted'
                            }`}
                    >
                        {label}
                    </div>
                ))}
            </div>

            {/* Visual Flow */}
            <div className="flex items-center gap-6 flex-wrap justify-center">
                {/* Parent Transaction */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative"
                >
                    <TransactionBox
                        label="Parent TX"
                        fee={`${parentFeeRate.toFixed(1)} sat/vB`}
                        status={step >= 3 ? 'confirmed' : step >= 1 ? 'stuck' : 'pending'}
                        color="yellow"
                    />
                    {step === 1 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded whitespace-nowrap border border-red-500/30"
                        >
                            ⚠️ Low fee, stuck!
                        </motion.div>
                    )}
                </motion.div>

                {/* Connection Line & Output Indicator */}
                {step >= 2 && (
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        className="flex flex-col items-center"
                    >
                        <div className="flex items-center">
                            <div className="w-12 h-0.5 bg-purple-500" />
                            <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
                            <div className="w-12 h-0.5 bg-purple-500" />
                        </div>
                        <div className="text-xs text-purple-400 mt-1">spends output</div>
                    </motion.div>
                )}

                {/* Child Transaction */}
                {step >= 2 && (
                    <motion.div
                        initial={{ scale: 0, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ type: 'spring', bounce: 0.5 }}
                        className="relative"
                    >
                        <TransactionBox
                            label="Child TX"
                            fee={`${childFeeRate.toFixed(1)} sat/vB`}
                            status={step >= 3 ? 'confirmed' : 'pending'}
                            color="purple"
                            highlight
                        />
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center text-xs text-purple-400 whitespace-nowrap"
                        >
                            High fee: {childFee.toFixed(0)} sats
                        </motion.div>
                    </motion.div>
                )}

                {/* Package to Block */}
                {step >= 3 && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center"
                        >
                            <div className="px-3 py-2 bg-purple-500/20 rounded-lg border border-purple-500/30 mb-2">
                                <div className="text-xs text-purple-400 mb-1">Package Rate</div>
                                <div className="text-sm font-bold text-purple-400">{packageFeeRate.toFixed(1)} sat/vB</div>
                            </div>
                            <ArrowRight className="w-8 h-8 text-purple-500" />
                        </motion.div>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', bounce: 0.5 }}
                        >
                            <BlockBox confirmed />
                        </motion.div>
                    </>
                )}
            </div>

            {/* Explanation */}
            <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-2xl p-4 bg-bg-tertiary rounded-lg border border-purple-500/20"
            >
                {step === 0 && (
                    <p className="text-text-secondary">
                        Someone sends you Bitcoin, but the transaction has a <span className="text-yellow-400 font-semibold">very low fee</span> of only {parentFeeRate.toFixed(1)} sat/vB.
                    </p>
                )}
                {step === 1 && (
                    <p className="text-text-secondary">
                        The transaction is <span className="text-red-400 font-semibold">stuck in the mempool</span>.
                        You can't spend the funds until it confirms. But you want your money faster!
                    </p>
                )}
                {step === 2 && (
                    <p className="text-text-secondary">
                        You create a <span className="text-purple-400 font-semibold">child transaction</span> that
                        spends the output from the stuck parent with a <span className="text-purple-400 font-semibold">very high fee</span> of {childFeeRate.toFixed(1)} sat/vB.
                        Miners see the combined package fee rate of {packageFeeRate.toFixed(1)} sat/vB.
                    </p>
                )}
                {step >= 3 && (
                    <p className="text-text-secondary">
                        <span className="text-purple-400 font-semibold">Success!</span> Miners include both the parent and child transactions
                        together because the combined fee rate is attractive. Both confirm in the same block!
                    </p>
                )}
            </motion.div>

            {/* CPFP Formula */}
            {step >= 2 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-2xl p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg"
                >
                    <h5 className="font-semibold text-purple-400 mb-3 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        CPFP Formula
                    </h5>
                    <div className="space-y-2 font-mono text-sm">
                        <div className="p-3 bg-bg-secondary rounded">
                            child_fee = (target_rate × total_size) - parent_fee
                        </div>
                        <div className="p-3 bg-bg-tertiary rounded text-xs">
                            <div>child_fee = ({packageFeeRate.toFixed(1)} × total_vB) - {parentFee}</div>
                            <div className="text-purple-400 mt-1">child_fee = {childFee.toFixed(0)} sats</div>
                        </div>
                    </div>
                    <p className="text-xs text-text-secondary mt-3">
                        The child must pay enough fee to make the combined package attractive to miners.
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
}

function TransactionBox({
    label,
    fee,
    status,
    color,
    highlight
}: {
    label: string;
    fee: string;
    status: 'pending' | 'stuck' | 'confirmed' | 'replaced';
    color: 'yellow' | 'green' | 'purple';
    highlight?: boolean;
}) {
    const colors = {
        yellow: 'border-yellow-500/50 bg-yellow-500/10',
        green: 'border-green-500/50 bg-green-500/10',
        purple: 'border-purple-500/50 bg-purple-500/10',
    };

    const statusColors = {
        pending: 'bg-yellow-500/20 text-yellow-400',
        stuck: 'bg-red-500/20 text-red-400',
        confirmed: 'bg-green-500/20 text-green-400',
        replaced: 'bg-gray-500/20 text-gray-400',
    };

    const iconColors = {
        yellow: 'text-yellow-400',
        green: 'text-green-400',
        purple: 'text-purple-400',
    };

    return (
        <div className={`
            p-4 rounded-xl border-2 ${colors[color]}
            ${highlight ? `ring-2 ring-offset-2 ring-offset-bg-secondary ring-${color}-500` : ''}
            min-w-[160px] relative
        `}>
            <div className="text-center">
                <Send className={`w-10 h-10 mx-auto mb-2 ${iconColors[color]}`} />
                <div className="font-semibold text-text-primary text-sm mb-1">{label}</div>
                <div className="text-xs text-text-muted mb-2">Fee: {fee}</div>
                <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 ${statusColors[status]}`}>
                    {status === 'confirmed' && <CheckCircle2 className="w-3 h-3" />}
                    {status === 'stuck' && <AlertCircle className="w-3 h-3" />}
                    {status === 'pending' && <Clock className="w-3 h-3" />}
                    {status}
                </div>
            </div>
        </div>
    );
}

function BlockBox({ confirmed }: { confirmed?: boolean }) {
    return (
        <motion.div
            animate={confirmed ? {
                boxShadow: [
                    '0 0 0 rgba(34, 197, 94, 0)',
                    '0 0 30px rgba(34, 197, 94, 0.5)',
                    '0 0 0 rgba(34, 197, 94, 0)'
                ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-4 rounded-xl border-2 border-green-500/50 bg-green-500/10 min-w-[140px]"
        >
            <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-2 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <div className="font-semibold text-green-400 text-sm mb-1">Block</div>
                <div className="text-xs text-text-muted">Confirmed!</div>
            </div>
        </motion.div>
    );
}