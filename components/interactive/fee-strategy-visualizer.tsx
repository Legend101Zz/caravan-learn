'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    RefreshCw,
    Baby,
    ArrowRight,
    ArrowDown,
    Coins,
    Send,
    CheckCircle2,
    Clock,
    Zap
} from 'lucide-react';

type Strategy = 'rbf' | 'cpfp';

export function FeeStrategyVisualizer() {
    const [activeStrategy, setActiveStrategy] = useState<Strategy>('rbf');
    const [animationStep, setAnimationStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const playAnimation = () => {
        setIsPlaying(true);
        setAnimationStep(0);

        const steps = activeStrategy === 'rbf' ? 4 : 4;
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

    return (
        <div className="space-y-6">
            {/* Strategy Selector */}
            <div className="flex gap-4 justify-center">
                <Button
                    variant={activeStrategy === 'rbf' ? 'default' : 'outline'}
                    onClick={() => { setActiveStrategy('rbf'); setAnimationStep(0); }}
                    className={activeStrategy === 'rbf' ? 'bg-green-500 hover:bg-green-600' : ''}
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    RBF (Replace-By-Fee)
                </Button>
                <Button
                    variant={activeStrategy === 'cpfp' ? 'default' : 'outline'}
                    onClick={() => { setActiveStrategy('cpfp'); setAnimationStep(0); }}
                    className={activeStrategy === 'cpfp' ? 'bg-purple-500 hover:bg-purple-600' : ''}
                >
                    <Baby className="w-4 h-4 mr-2" />
                    CPFP (Child-Pays-For-Parent)
                </Button>
            </div>

            {/* Animation Container */}
            <Card className="bg-bg-secondary border-2 border-dashed border-border">
                <CardContent className="pt-6">
                    <div className="min-h-[400px] relative">
                        <AnimatePresence mode="wait">
                            {activeStrategy === 'rbf' ? (
                                <RBFVisualization step={animationStep} key="rbf" />
                            ) : (
                                <CPFPVisualization step={animationStep} key="cpfp" />
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Play Button */}
                    <div className="text-center mt-6">
                        <Button
                            onClick={playAnimation}
                            disabled={isPlaying}
                            size="lg"
                            className={activeStrategy === 'rbf' ? 'bg-green-500 hover:bg-green-600' : 'bg-purple-500 hover:bg-purple-600'}
                        >
                            {isPlaying ? (
                                <>
                                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                                    Playing...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-4 h-4 mr-2" />
                                    Watch {activeStrategy.toUpperCase()} in Action
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function RBFVisualization({ step }: { step: number }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-8"
        >
            {/* Step Labels */}
            <div className="flex justify-center gap-4 mb-4">
                {['Original TX', 'Low Fee', 'Create Replace', 'Confirmed!'].map((label, i) => (
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
            <div className="flex items-center gap-8">
                {/* Original Transaction */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: step >= 0 ? 1 : 0, opacity: step >= 2 ? 0.3 : 1 }}
                    className={`relative ${step >= 2 ? 'line-through' : ''}`}
                >
                    <TransactionBox
                        label="Original TX"
                        fee="1 sat/vB"
                        status={step === 0 ? 'pending' : step === 1 ? 'stuck' : 'replaced'}
                        color="yellow"
                    />
                    {step === 1 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded whitespace-nowrap"
                        >
                            Stuck in mempool! 😢
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
                            fee="10 sat/vB"
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
                className="text-center max-w-md"
            >
                {step === 0 && (
                    <p className="text-text-secondary">
                        You broadcast a transaction with a <span className="text-yellow-400">low fee rate</span>.
                    </p>
                )}
                {step === 1 && (
                    <p className="text-text-secondary">
                        The transaction is <span className="text-red-400">stuck in the mempool</span> because
                        miners prefer higher-fee transactions.
                    </p>
                )}
                {step === 2 && (
                    <p className="text-text-secondary">
                        You create a <span className="text-green-400">replacement transaction</span> spending
                        the same inputs with a <span className="text-green-400">higher fee</span>.
                    </p>
                )}
                {step >= 3 && (
                    <p className="text-text-secondary">
                        <span className="text-green-400">Success!</span> The replacement is confirmed.
                        The original transaction is now invalid.
                    </p>
                )}
            </motion.div>
        </motion.div>
    );
}

function CPFPVisualization({ step }: { step: number }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-8"
        >
            {/* Step Labels */}
            <div className="flex justify-center gap-4 mb-4">
                {['Parent TX', 'Stuck', 'Create Child', 'Both Confirmed!'].map((label, i) => (
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
            <div className="flex items-center gap-4">
                {/* Parent Transaction */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative"
                >
                    <TransactionBox
                        label="Parent TX"
                        fee="1 sat/vB"
                        status={step >= 3 ? 'confirmed' : step >= 1 ? 'stuck' : 'pending'}
                        color="yellow"
                    />
                    {step === 1 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded whitespace-nowrap"
                        >
                            Stuck! 😢
                        </motion.div>
                    )}
                </motion.div>

                {/* Connection Line */}
                {step >= 2 && (
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        className="flex items-center"
                    >
                        <div className="w-8 h-0.5 bg-purple-500" />
                        <ArrowDown className="w-6 h-6 text-purple-500 rotate-[-90deg]" />
                    </motion.div>
                )}

                {/* Child Transaction */}
                {step >= 2 && (
                    <motion.div
                        initial={{ scale: 0, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ type: 'spring', bounce: 0.5 }}
                    >
                        <TransactionBox
                            label="Child TX"
                            fee="50 sat/vB"
                            status={step >= 3 ? 'confirmed' : 'pending'}
                            color="purple"
                            highlight
                        />
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-center mt-2 text-xs text-purple-400"
                        >
                            Spends parent&apos;s output
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
                            <div className="px-3 py-1 bg-purple-500/20 rounded-full text-xs text-purple-400 mb-2">
                                Package: ~25 sat/vB
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
                className="text-center max-w-md"
            >
                {step === 0 && (
                    <p className="text-text-secondary">
                        Someone sends you Bitcoin, but the transaction has a <span className="text-yellow-400">low fee</span>.
                    </p>
                )}
                {step === 1 && (
                    <p className="text-text-secondary">
                        The transaction is <span className="text-red-400">stuck in the mempool</span>.
                        You want your funds faster!
                    </p>
                )}
                {step === 2 && (
                    <p className="text-text-secondary">
                        You create a <span className="text-purple-400">child transaction</span> that
                        spends your output with a <span className="text-purple-400">very high fee</span>.
                    </p>
                )}
                {step >= 3 && (
                    <p className="text-text-secondary">
                        <span className="text-purple-400">Success!</span> Miners include both transactions
                        because the combined fee rate is attractive.
                    </p>
                )}
            </motion.div>
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
        replaced: 'bg-gray-500/20 text-gray-400 line-through',
    };

    return (
        <div className={`
            p-4 rounded-xl border-2 ${colors[color]}
            ${highlight ? 'ring-2 ring-offset-2 ring-offset-bg-secondary ring-' + color + '-500' : ''}
            min-w-[140px]
        `}>
            <div className="text-center">
                <Send className={`w-8 h-8 mx-auto mb-2 text-${color}-400`} />
                <div className="font-medium text-text-primary text-sm">{label}</div>
                <div className="text-xs text-text-muted mt-1">Fee: {fee}</div>
                <div className={`text-xs mt-2 px-2 py-1 rounded-full ${statusColors[status]}`}>
                    {status === 'confirmed' && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
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
                boxShadow: ['0 0 0 rgba(34, 197, 94, 0)', '0 0 30px rgba(34, 197, 94, 0.5)', '0 0 0 rgba(34, 197, 94, 0)']
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-4 rounded-xl border-2 border-green-500/50 bg-green-500/10"
        >
            <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <div className="font-medium text-green-400 text-sm">Block</div>
                <div className="text-xs text-text-muted">Confirmed!</div>
            </div>
        </motion.div>
    );
}