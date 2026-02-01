/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Callout } from '@/components/content/callout';
import { CodePlayground } from '@/components/interactive/code-playground';
import { PageNavigation } from '@/components/layout/page-navigation';
import { PsbtV2 } from '@caravan/psbt';
import { Buffer } from 'buffer';
import {
    ArrowRight,
    Plus,
    Minus,
    Lock,
    Unlock,
    Settings,
    GitCompare,
    CheckCircle2,
    XCircle,
    Zap,
    Layers,
    FileText,
    Key,
    Shield,
    RefreshCw,
    Eye,
    Code,
    Sparkles,
    Info,
    AlertTriangle,
    Clock,
    Binary,
    Network,
    ChevronRight,
    Database
} from 'lucide-react';

const MODIFIABLE = {
    INPUTS: "INPUTS",
    OUTPUTS: "OUTPUTS",
    SIGHASH_SINGLE: "SIGHASH_SINGLE"
};

// Hand-drawn underline component
const DoodleUnderline = ({ className = "" }: { className?: string }) => (
    <svg
        viewBox="0 0 200 20"
        className={`w-full h-3 absolute -bottom-2 left-0 ${className}`}
        fill="none"
    >
        <motion.path
            d="M 5 10 Q 50 5, 100 10 T 195 10"
            stroke="#8B5CF6"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
        />
    </svg>
);

// Animated Version Badge
const VersionBadge = ({ version, isActive }: { version: string; isActive: boolean }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        className={`
            px-6 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer
            ${isActive
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50'
                : 'bg-bg-tertiary text-text-secondary hover:bg-bg-card border-2 border-border'}
        `}
    >
        {version}
    </motion.div>
);

// Enhanced Version Comparison Visual
const VersionComparisonVisual = () => {
    const [showV2, setShowV2] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex justify-center gap-4">
                <button onClick={() => setShowV2(false)}>
                    <VersionBadge version="PSBTv0 (BIP-174)" isActive={!showV2} />
                </button>
                <button onClick={() => setShowV2(true)}>
                    <VersionBadge version="PSBTv2 (BIP-370)" isActive={showV2} />
                </button>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={showV2 ? 'v2' : 'v0'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                >
                    {/* Global Map */}
                    <div className="p-6 rounded-xl border-2 border-green-500/50 bg-gradient-to-br from-green-500/10 to-green-500/5">
                        <div className="flex items-center gap-3 mb-4">
                            <Database className="w-6 h-6 text-green-400" />
                            <div className="text-lg font-bold text-green-400">Global Map</div>
                            <div className="ml-auto text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                                Transaction-level data
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                            {!showV2 ? (
                                <>
                                    <motion.div
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        className="p-3 bg-green-500/20 rounded-lg border border-green-500/30"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <FileText className="w-4 h-4 text-green-400" />
                                            <span className="font-mono text-sm text-green-400">UNSIGNED_TX</span>
                                        </div>
                                        <div className="text-xs text-text-secondary">
                                            Contains the entire unsigned transaction (required)
                                        </div>
                                    </motion.div>
                                    <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Key className="w-4 h-4 text-green-400/70" />
                                            <span className="font-mono text-sm text-green-400/70">XPUB</span>
                                        </div>
                                        <div className="text-xs text-text-muted">Extended public keys (optional)</div>
                                    </div>
                                    <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Binary className="w-4 h-4 text-green-400/70" />
                                            <span className="font-mono text-sm text-green-400/70">VERSION</span>
                                        </div>
                                        <div className="text-xs text-text-muted">Version 0 (default if omitted)</div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <motion.div
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <Sparkles className="w-4 h-4 text-purple-400" />
                                            <span className="font-mono text-sm text-purple-400">TX_VERSION</span>
                                        </div>
                                        <div className="text-xs text-text-secondary">Transaction version (required)</div>
                                    </motion.div>
                                    <motion.div
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.05 }}
                                        className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <Sparkles className="w-4 h-4 text-purple-400" />
                                            <span className="font-mono text-sm text-purple-400">INPUT_COUNT</span>
                                        </div>
                                        <div className="text-xs text-text-secondary">Number of inputs (required)</div>
                                    </motion.div>
                                    <motion.div
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="p-3 bg-purple-500/20 rounded-lg border border-purple-500/30"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <Sparkles className="w-4 h-4 text-purple-400" />
                                            <span className="font-mono text-sm text-purple-400">OUTPUT_COUNT</span>
                                        </div>
                                        <div className="text-xs text-text-secondary">Number of outputs (required)</div>
                                    </motion.div>
                                    <motion.div
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.15 }}
                                        className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <Clock className="w-4 h-4 text-purple-400/70" />
                                            <span className="font-mono text-sm text-purple-400/70">FALLBACK_LOCKTIME</span>
                                        </div>
                                        <div className="text-xs text-text-muted">Default locktime (optional)</div>
                                    </motion.div>
                                    <motion.div
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <Settings className="w-4 h-4 text-purple-400/70" />
                                            <span className="font-mono text-sm text-purple-400/70">TX_MODIFIABLE</span>
                                        </div>
                                        <div className="text-xs text-text-muted">Modifiable flags (optional)</div>
                                    </motion.div>
                                    <motion.div
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.25 }}
                                        className="p-3 bg-red-500/20 rounded-lg border border-red-500/30"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <XCircle className="w-4 h-4 text-red-400" />
                                            <span className="font-mono text-sm text-red-400 line-through">UNSIGNED_TX</span>
                                        </div>
                                        <div className="text-xs text-red-400">Removed in v2!</div>
                                    </motion.div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Input/Output Maps */}
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Input Map */}
                        <div className="p-6 rounded-xl border-2 border-blue-500/50 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
                            <div className="flex items-center gap-3 mb-4">
                                <ArrowRight className="w-6 h-6 text-blue-400" />
                                <div className="text-lg font-bold text-blue-400">Input Map</div>
                            </div>
                            <div className="space-y-2">
                                {!showV2 ? (
                                    <>
                                        <div className="p-2 bg-blue-500/10 rounded text-xs">
                                            <span className="font-mono text-blue-400">WITNESS_UTXO</span>
                                        </div>
                                        <div className="p-2 bg-blue-500/10 rounded text-xs">
                                            <span className="font-mono text-blue-400">PARTIAL_SIG</span>
                                        </div>
                                        <div className="p-2 bg-blue-500/10 rounded text-xs">
                                            <span className="font-mono text-blue-400">SIGHASH_TYPE</span>
                                        </div>
                                        <div className="p-2 bg-blue-500/10 rounded text-xs">
                                            <span className="font-mono text-blue-400">BIP32_DERIVATION</span>
                                        </div>
                                        <div className="text-xs text-text-muted mt-2">
                                            Metadata only - input data in UNSIGNED_TX
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <motion.div
                                            initial={{ x: -10, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            className="p-2 bg-purple-500/20 rounded text-xs border border-purple-500/30"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Sparkles className="w-3 h-3 text-purple-400" />
                                                <span className="font-mono text-purple-400">PREVIOUS_TXID</span>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            initial={{ x: -10, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.05 }}
                                            className="p-2 bg-purple-500/20 rounded text-xs border border-purple-500/30"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Sparkles className="w-3 h-3 text-purple-400" />
                                                <span className="font-mono text-purple-400">OUTPUT_INDEX</span>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            initial={{ x: -10, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.1 }}
                                            className="p-2 bg-purple-500/20 rounded text-xs border border-purple-500/30"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Sparkles className="w-3 h-3 text-purple-400" />
                                                <span className="font-mono text-purple-400">SEQUENCE</span>
                                            </div>
                                        </motion.div>
                                        <div className="p-2 bg-blue-500/10 rounded text-xs">
                                            <span className="font-mono text-blue-400">+ all v0 fields</span>
                                        </div>
                                        <div className="text-xs text-purple-400 mt-2 font-medium">
                                            ✨ Self-contained input data!
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Output Map */}
                        <div className="p-6 rounded-xl border-2 border-pink-500/50 bg-gradient-to-br from-pink-500/10 to-pink-500/5">
                            <div className="flex items-center gap-3 mb-4">
                                <ArrowRight className="w-6 h-6 text-pink-400 rotate-180" />
                                <div className="text-lg font-bold text-pink-400">Output Map</div>
                            </div>
                            <div className="space-y-2">
                                {!showV2 ? (
                                    <>
                                        <div className="p-2 bg-pink-500/10 rounded text-xs">
                                            <span className="font-mono text-pink-400">REDEEM_SCRIPT</span>
                                        </div>
                                        <div className="p-2 bg-pink-500/10 rounded text-xs">
                                            <span className="font-mono text-pink-400">WITNESS_SCRIPT</span>
                                        </div>
                                        <div className="p-2 bg-pink-500/10 rounded text-xs">
                                            <span className="font-mono text-pink-400">BIP32_DERIVATION</span>
                                        </div>
                                        <div className="text-xs text-text-muted mt-2">
                                            Metadata only - output data in UNSIGNED_TX
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <motion.div
                                            initial={{ x: 10, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            className="p-2 bg-purple-500/20 rounded text-xs border border-purple-500/30"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Sparkles className="w-3 h-3 text-purple-400" />
                                                <span className="font-mono text-purple-400">AMOUNT</span>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            initial={{ x: 10, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.05 }}
                                            className="p-2 bg-purple-500/20 rounded text-xs border border-purple-500/30"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Sparkles className="w-3 h-3 text-purple-400" />
                                                <span className="font-mono text-purple-400">SCRIPT</span>
                                            </div>
                                        </motion.div>
                                        <div className="p-2 bg-pink-500/10 rounded text-xs">
                                            <span className="font-mono text-pink-400">+ all v0 fields</span>
                                        </div>
                                        <div className="text-xs text-purple-400 mt-2 font-medium">
                                            ✨ Self-contained output data!
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Key Insight */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl border-2 border-purple-500/30"
                    >
                        <div className="flex items-start gap-4">
                            <Zap className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-bold text-purple-400 mb-2">Key Difference</h4>
                                <p className="text-sm text-text-secondary">
                                    {!showV2 ? (
                                        <>
                                            <strong>PSBTv0:</strong> All transaction structure is locked inside the
                                            UNSIGNED_TX field in the global map. Inputs and outputs cannot be modified
                                            after creation - only metadata can be added.
                                        </>
                                    ) : (
                                        <>
                                            <strong>PSBTv2:</strong> Transaction structure is distributed across
                                            individual input and output maps. This allows the <span className="text-purple-400 font-semibold">Constructor role</span> to
                                            dynamically add or remove inputs/outputs, enabling protocols like CoinJoin and PayJoin!
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// Enhanced Modifiable Flags Visual
const ModifiableFlagsVisual = () => {
    const [flags, setFlags] = useState({
        inputs: true,
        outputs: true,
        sighashSingle: false
    });

    const toggleFlag = (flag: keyof typeof flags) => {
        setFlags(prev => ({ ...prev, [flag]: !prev[flag] }));
    };

    const binaryValue = (flags.inputs ? 1 : 0) | (flags.outputs ? 2 : 0) | (flags.sighashSingle ? 4 : 0);

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h4 className="text-lg font-bold text-text-primary mb-2">Interactive Modifiable Flags</h4>
                <p className="text-sm text-text-secondary">
                    Click flags to toggle them and see how they affect the transaction
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                {[
                    {
                        key: 'inputs',
                        label: 'Inputs Modifiable',
                        bit: 'Bit 0',
                        value: 0x01,
                        desc: 'Constructor can add/remove inputs',
                        detail: 'Cleared when signer adds signature without SIGHASH_ANYONECANPAY'
                    },
                    {
                        key: 'outputs',
                        label: 'Outputs Modifiable',
                        bit: 'Bit 1',
                        value: 0x02,
                        desc: 'Constructor can add/remove outputs',
                        detail: 'Cleared when signer adds signature without SIGHASH_NONE/SINGLE'
                    },
                    {
                        key: 'sighashSingle',
                        label: 'Has SIGHASH_SINGLE',
                        bit: 'Bit 2',
                        value: 0x04,
                        desc: 'Transaction contains SIGHASH_SINGLE signature',
                        detail: 'Set by signer when adding SIGHASH_SINGLE signature'
                    }
                ].map((flag) => (
                    <motion.button
                        key={flag.key}
                        onClick={() => toggleFlag(flag.key as keyof typeof flags)}
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
                            p-6 rounded-xl border-2 transition-all text-left
                            ${flags[flag.key as keyof typeof flags]
                                ? 'border-green-500/50 bg-gradient-to-br from-green-500/20 to-green-500/10 shadow-lg shadow-green-500/20'
                                : 'border-border bg-bg-tertiary hover:border-purple-500/30'}
                        `}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-400 text-xs font-mono">
                                {flag.bit}
                            </span>
                            <motion.div
                                animate={{
                                    rotate: flags[flag.key as keyof typeof flags] ? 0 : 180,
                                    scale: flags[flag.key as keyof typeof flags] ? 1.1 : 1
                                }}
                                transition={{ type: 'spring', stiffness: 200 }}
                            >
                                {flags[flag.key as keyof typeof flags] ? (
                                    <Unlock className="w-5 h-5 text-green-400" />
                                ) : (
                                    <Lock className="w-5 h-5 text-text-muted" />
                                )}
                            </motion.div>
                        </div>
                        <div className="font-bold text-sm mb-2 text-text-primary">{flag.label}</div>
                        <div className="text-xs text-text-secondary mb-2">{flag.desc}</div>
                        <div className="text-xs text-text-muted italic">{flag.detail}</div>
                        <div className="mt-3 pt-3 border-t border-border/50">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-text-muted">Hex Value:</span>
                                <span className="font-mono text-purple-400">0x{flag.value.toString(16).padStart(2, '0')}</span>
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Result Display */}
            <motion.div
                key={binaryValue}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border-2 border-purple-500/30"
            >
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <div className="text-sm font-semibold text-text-primary mb-1">
                            PSBT_GLOBAL_TX_MODIFIABLE Value
                        </div>
                        <div className="text-xs text-text-muted">
                            This byte determines what can still be modified in the PSBT
                        </div>
                    </div>
                    <motion.div
                        key={binaryValue}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                    >
                        {binaryValue}
                    </motion.div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-xs">
                    <div className="p-3 bg-bg-tertiary rounded-lg">
                        <div className="text-text-muted mb-1">Binary</div>
                        <div className="font-mono text-purple-400">{binaryValue.toString(2).padStart(8, '0')}</div>
                    </div>
                    <div className="p-3 bg-bg-tertiary rounded-lg">
                        <div className="text-text-muted mb-1">Hexadecimal</div>
                        <div className="font-mono text-pink-400">0x{binaryValue.toString(16).padStart(2, '0')}</div>
                    </div>
                    <div className="p-3 bg-bg-tertiary rounded-lg">
                        <div className="text-text-muted mb-1">Decimal</div>
                        <div className="font-mono text-blue-400">{binaryValue}</div>
                    </div>
                </div>
            </motion.div>

            {/* Explanation */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-text-secondary">
                        <strong className="text-blue-400">How it works:</strong> Each bit represents a different flag.
                        The flags are ORed together to create the final value. For example, if both inputs and outputs
                        are modifiable, the value is 0x01 | 0x02 = 0x03.
                    </div>
                </div>
            </div>
        </div>
    );
};

// Enhanced Constructor Role Visual
const ConstructorRoleVisual = () => {
    const [inputs, setInputs] = useState([
        { id: 1, amount: 50000, txid: 'abc123...', vout: 0 }
    ]);
    const [outputs, setOutputs] = useState([
        { id: 1, amount: 40000, address: 'bc1q...' }
    ]);
    const [step, setStep] = useState(0);

    const addInput = () => {
        if (inputs.length < 4) {
            setInputs([...inputs, {
                id: Date.now(),
                amount: 30000,
                txid: `def456${inputs.length}...`,
                vout: inputs.length
            }]);
            setStep(1);
        }
    };

    const addOutput = () => {
        if (outputs.length < 4) {
            setOutputs([...outputs, {
                id: Date.now(),
                amount: 10000,
                address: `bc1q...${outputs.length}`
            }]);
            setStep(2);
        }
    };

    const removeInput = () => {
        if (inputs.length > 1) {
            setInputs(inputs.slice(0, -1));
            setStep(3);
        }
    };

    const removeOutput = () => {
        if (outputs.length > 1) {
            setOutputs(outputs.slice(0, -1));
            setStep(4);
        }
    };

    const totalIn = inputs.reduce((sum, i) => sum + i.amount, 0);
    const totalOut = outputs.reduce((sum, o) => sum + o.amount, 0);
    const fee = Math.max(0, totalIn - totalOut);
    const isValid = totalIn >= totalOut && totalOut > 0;

    const steps = [
        'Initial PSBT created',
        'Constructor adds input',
        'Constructor adds output',
        'Constructor removes input',
        'Constructor removes output'
    ];

    return (
        <div className="space-y-6">
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
                {steps.map((label, i) => (
                    <div
                        key={i}
                        className={`
                            px-3 py-1 rounded-full text-xs font-medium transition-all
                            ${i === step
                                ? 'bg-purple-500 text-white'
                                : i < step
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-bg-tertiary text-text-muted'}
                        `}
                    >
                        {label}
                    </div>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Inputs Column */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ArrowRight className="w-5 h-5 text-blue-400" />
                            <span className="font-semibold text-blue-400">Inputs</span>
                            <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                                {inputs.length}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={removeInput}
                                disabled={inputs.length <= 1}
                                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                            >
                                <Minus className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={addInput}
                                disabled={inputs.length >= 4}
                                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <AnimatePresence mode="popLayout">
                        {inputs.map((input, i) => (
                            <motion.div
                                key={input.id}
                                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -20, scale: 0.9 }}
                                layout
                                className="p-4 rounded-lg bg-gradient-to-r from-blue-500/20 to-blue-500/10 border border-blue-500/30"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-blue-400 font-semibold">Input #{i}</span>
                                    <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-mono">
                                        {input.amount.toLocaleString()} sats
                                    </span>
                                </div>
                                <div className="space-y-1 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-text-muted">TXID:</span>
                                        <span className="font-mono text-text-primary">{input.txid}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-text-muted">vOut:</span>
                                        <span className="font-mono text-text-primary">{input.vout}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 text-center">
                        <div className="text-xs text-text-muted">Total Input</div>
                        <div className="text-lg font-bold text-blue-400">{totalIn.toLocaleString()} sats</div>
                    </div>
                </div>

                {/* Outputs Column */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ArrowRight className="w-5 h-5 text-pink-400 rotate-180" />
                            <span className="font-semibold text-pink-400">Outputs</span>
                            <span className="text-xs px-2 py-1 rounded-full bg-pink-500/20 text-pink-400">
                                {outputs.length}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={removeOutput}
                                disabled={outputs.length <= 1}
                                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                            >
                                <Minus className="w-4 h-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={addOutput}
                                disabled={outputs.length >= 4}
                                className="border-pink-500/30 text-pink-400 hover:bg-pink-500/10"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <AnimatePresence mode="popLayout">
                        {outputs.map((output, i) => (
                            <motion.div
                                key={output.id}
                                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                                layout
                                className="p-4 rounded-lg bg-gradient-to-r from-pink-500/20 to-pink-500/10 border border-pink-500/30"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-pink-400 font-semibold">Output #{i}</span>
                                    <span className="px-2 py-1 rounded bg-pink-500/20 text-pink-400 text-xs font-mono">
                                        {output.amount.toLocaleString()} sats
                                    </span>
                                </div>
                                <div className="space-y-1 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-text-muted">Address:</span>
                                        <span className="font-mono text-text-primary">{output.address}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <div className="p-3 bg-pink-500/10 rounded-lg border border-pink-500/20 text-center">
                        <div className="text-xs text-text-muted">Total Output</div>
                        <div className="text-lg font-bold text-pink-400">{totalOut.toLocaleString()} sats</div>
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className={`
                p-4 rounded-lg border-2 transition-all
                ${isValid
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'}
            `}>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-xs text-text-muted mb-1">Fee</div>
                        <div className="text-xl font-bold text-purple-400">{fee.toLocaleString()} sats</div>
                    </div>
                    <div>
                        <div className="text-xs text-text-muted mb-1">Fee Rate (est.)</div>
                        <div className="text-xl font-bold text-purple-400">
                            {totalIn > 0 ? ((fee / 200) || 0).toFixed(1) : 0} sat/vB
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-text-muted mb-1">Status</div>
                        <div className={`text-xl font-bold ${isValid ? 'text-green-400' : 'text-red-400'}`}>
                            {isValid ? '✓ Valid' : '✗ Invalid'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Explanation */}
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-text-secondary">
                        <strong className="text-purple-400">PSBTv2 Constructor Role:</strong> The Constructor can dynamically
                        add and remove inputs/outputs as long as the TX_MODIFIABLE flags permit it. This enables interactive
                        protocols like CoinJoin where multiple parties contribute inputs and outputs to a single transaction.
                    </div>
                </div>
            </div>
        </div>
    );
};

// Locktime Determination Visual
const LocktimeDeterminationVisual = () => {
    const [input0Time, setInput0Time] = useState<number | null>(null);
    const [input0Height, setInput0Height] = useState<number | null>(800000);
    const [input1Time, setInput1Time] = useState<number | null>(null);
    const [input1Height, setInput1Height] = useState<number | null>(800500);
    const [fallbackLocktime, setFallbackLocktime] = useState(0);

    const determineLocktime = () => {
        const inputs = [
            { time: input0Time, height: input0Height },
            { time: input1Time, height: input1Height }
        ];

        // Check if any input has locktime requirements
        const hasAnyLocktime = inputs.some(i => i.time !== null || i.height !== null);

        if (!hasAnyLocktime) {
            return { value: fallbackLocktime, type: 'fallback', reason: 'No input locktime requirements' };
        }

        // Check if all inputs support height
        const allHaveHeight = inputs.every(i => i.height !== null);
        if (allHaveHeight) {
            const maxHeight = Math.max(...inputs.map(i => i.height!));
            return { value: maxHeight, type: 'height', reason: 'All inputs support height locktime' };
        }

        // Check if all inputs support time
        const allHaveTime = inputs.every(i => i.time !== null);
        if (allHaveTime) {
            const maxTime = Math.max(...inputs.map(i => i.time!));
            return { value: maxTime, type: 'time', reason: 'All inputs support time locktime' };
        }

        return { value: null, type: 'error', reason: 'Conflicting locktime types - cannot determine' };
    };

    const result = determineLocktime();

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
                {/* Input 0 */}
                <Card className="bg-bg-secondary border-blue-500/30">
                    <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                            <ArrowRight className="w-4 h-4 text-blue-400" />
                            Input #0 Locktime Requirements
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <label className="text-xs text-text-muted mb-1 block">
                                REQUIRED_TIME_LOCKTIME (Unix timestamp)
                            </label>
                            <input
                                type="number"
                                value={input0Time || ''}
                                onChange={(e) => setInput0Time(e.target.value ? parseInt(e.target.value) : null)}
                                placeholder="None"
                                className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded text-sm font-mono"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-text-muted mb-1 block">
                                REQUIRED_HEIGHT_LOCKTIME (Block height)
                            </label>
                            <input
                                type="number"
                                value={input0Height || ''}
                                onChange={(e) => setInput0Height(e.target.value ? parseInt(e.target.value) : null)}
                                placeholder="None"
                                className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded text-sm font-mono"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Input 1 */}
                <Card className="bg-bg-secondary border-blue-500/30">
                    <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                            <ArrowRight className="w-4 h-4 text-blue-400" />
                            Input #1 Locktime Requirements
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <label className="text-xs text-text-muted mb-1 block">
                                REQUIRED_TIME_LOCKTIME (Unix timestamp)
                            </label>
                            <input
                                type="number"
                                value={input1Time || ''}
                                onChange={(e) => setInput1Time(e.target.value ? parseInt(e.target.value) : null)}
                                placeholder="None"
                                className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded text-sm font-mono"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-text-muted mb-1 block">
                                REQUIRED_HEIGHT_LOCKTIME (Block height)
                            </label>
                            <input
                                type="number"
                                value={input1Height || ''}
                                onChange={(e) => setInput1Height(e.target.value ? parseInt(e.target.value) : null)}
                                placeholder="None"
                                className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded text-sm font-mono"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Fallback Locktime */}
            <Card className="bg-bg-secondary border-purple-500/30">
                <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-400" />
                        PSBT_GLOBAL_FALLBACK_LOCKTIME
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <input
                        type="number"
                        value={fallbackLocktime}
                        onChange={(e) => setFallbackLocktime(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-bg-tertiary border border-border rounded text-sm font-mono"
                    />
                    <p className="text-xs text-text-muted mt-2">
                        Used only if no inputs have locktime requirements
                    </p>
                </CardContent>
            </Card>

            {/* Result */}
            <motion.div
                key={`${result.value}-${result.type}`}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`
                    p-6 rounded-xl border-2
                    ${result.type === 'error'
                        ? 'bg-red-500/10 border-red-500/30'
                        : 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30'}
                `}
            >
                <div className="text-center mb-4">
                    <div className="text-sm text-text-muted mb-2">Final Transaction Locktime</div>
                    <div className={`text-4xl font-bold ${result.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>
                        {result.value !== null ? result.value.toLocaleString() : '—'}
                    </div>
                    {result.type !== 'error' && result.type !== 'fallback' && (
                        <div className="text-sm text-text-muted mt-1">
                            ({result.type === 'height' ? 'Block Height' : 'Unix Timestamp'})
                        </div>
                    )}
                </div>

                <div className="p-3 bg-bg-tertiary rounded-lg">
                    <div className="text-xs text-text-muted mb-1">Determination Logic</div>
                    <div className="text-sm text-text-secondary">{result.reason}</div>
                </div>

                {result.type === 'height' && (
                    <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-xs text-blue-400">
                        <strong>Why height over time?</strong> Bitcoin's native time unit is blocks, so height
                        locktimes are preferred when all inputs support them.
                    </div>
                )}
            </motion.div>
        </div>
    );
};

// Workflow Diagram
const PSBTv2WorkflowDiagram = () => {
    const [currentRole, setCurrentRole] = useState<number>(0);

    const roles = [
        {
            name: 'Creator',
            icon: Sparkles,
            color: 'blue',
            actions: [
                'Creates new PSBTv2',
                'Sets TX_VERSION, INPUT_COUNT, OUTPUT_COUNT',
                'Sets TX_MODIFIABLE flags',
                'May add initial inputs/outputs'
            ]
        },
        {
            name: 'Constructor',
            icon: Settings,
            color: 'purple',
            actions: [
                'Adds/removes inputs (if flag set)',
                'Adds/removes outputs (if flag set)',
                'Sets input PREVIOUS_TXID, OUTPUT_INDEX, SEQUENCE',
                'Sets output AMOUNT, SCRIPT'
            ]
        },
        {
            name: 'Updater',
            icon: RefreshCw,
            color: 'green',
            actions: [
                'Adds WITNESS_UTXO for each input',
                'Adds WITNESS_SCRIPT, REDEEM_SCRIPT',
                'Adds BIP32_DERIVATION paths',
                'Cannot modify transaction structure'
            ]
        },
        {
            name: 'Signer',
            icon: Key,
            color: 'pink',
            actions: [
                'Adds PARTIAL_SIG for inputs',
                'Updates TX_MODIFIABLE flags based on sighash',
                'Cannot add/remove inputs/outputs',
                'Multiple signers can participate'
            ]
        },
        {
            name: 'Finalizer',
            icon: CheckCircle2,
            color: 'emerald',
            actions: [
                'Converts PSBT to final transaction',
                'Constructs scriptSig and scriptWitness',
                'Computes final locktime from inputs',
                'Removes all PSBT metadata'
            ]
        },
        {
            name: 'Extractor',
            icon: FileText,
            color: 'orange',
            actions: [
                'Extracts ready-to-broadcast transaction',
                'Verifies all signatures present',
                'Outputs raw transaction hex',
                'Can be broadcast to network'
            ]
        }
    ];

    const currentRoleData = roles[currentRole];

    return (
        <div className="space-y-6">
            {/* Role Navigator */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
                {roles.map((role, i) => {
                    const Icon = role.icon;
                    return (
                        <button
                            key={i}
                            onClick={() => setCurrentRole(i)}
                            className={`
                                px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2
                                ${i === currentRole
                                    ? `bg-${role.color}-500 text-white shadow-lg shadow-${role.color}-500/30`
                                    : 'bg-bg-tertiary text-text-secondary hover:bg-bg-card'}
                            `}
                        >
                            <Icon className="w-4 h-4" />
                            {role.name}
                        </button>
                    );
                })}
            </div>

            {/* Role Details */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentRole}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`p-8 rounded-xl border-2 bg-gradient-to-br from-${currentRoleData.color}-500/20 to-${currentRoleData.color}-500/5 border-${currentRoleData.color}-500/30`}
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`w-16 h-16 rounded-full bg-${currentRoleData.color}-500/20 flex items-center justify-center`}>
                            <currentRoleData.icon className={`w-8 h-8 text-${currentRoleData.color}-400`} />
                        </div>
                        <div>
                            <h3 className={`text-2xl font-bold text-${currentRoleData.color}-400`}>
                                {currentRoleData.name}
                            </h3>
                            <p className="text-sm text-text-muted">Step {currentRole + 1} of {roles.length}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {currentRoleData.actions.map((action, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start gap-3 p-3 bg-bg-tertiary rounded-lg"
                            >
                                <CheckCircle2 className={`w-5 h-5 text-${currentRoleData.color}-400 flex-shrink-0 mt-0.5`} />
                                <span className="text-sm text-text-secondary">{action}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => setCurrentRole(Math.max(0, currentRole - 1))}
                    disabled={currentRole === 0}
                >
                    Previous Role
                </Button>
                <Button
                    variant="outline"
                    onClick={() => setCurrentRole(Math.min(roles.length - 1, currentRole + 1))}
                    disabled={currentRole === roles.length - 1}
                >
                    Next Role
                    <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        </div>
    );
};

export default function BIP370Page() {
    return (
        <div className="prose prose-invert max-w-none">
            {/* Hero Section */}
            <div className="not-prose mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                >
                    <div className="inline-block px-4 py-2 rounded-full bg-purple-500/20 text-purple-400 text-sm font-bold mb-4 border-2 border-purple-500/50">
                        BIP-370
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 relative inline-block">
                        <span className="text-text-primary">PSBTv2: </span>
                        <span className="text-purple-400 relative">
                            Dynamic Transactions
                            <DoodleUnderline />
                        </span>
                    </h1>
                    <p className="text-xl text-text-secondary max-w-3xl">
                        BIP-370 revolutionizes Bitcoin transaction construction with dynamic input/output management,
                        sophisticated locktime handling, and the powerful Constructor role—enabling protocols like
                        CoinJoin, PayJoin, and interactive multi-party transactions.
                    </p>
                </motion.div>
            </div>

            {/* Why PSBTv2 Section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="not-prose mb-16"
            >
                <h2 className="text-3xl font-bold mb-6 text-text-primary flex items-center gap-3">
                    <Zap className="text-purple-400" />
                    Why PSBTv2 Was Created
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-400">
                                <XCircle className="w-5 h-5" />
                                PSBTv0 Limitations
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2" />
                                <div>
                                    <strong className="text-red-400">Fixed Structure:</strong> Transaction inputs and outputs
                                    locked in UNSIGNED_TX at creation
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2" />
                                <div>
                                    <strong className="text-red-400">No Dynamic Construction:</strong> Impossible to add/remove
                                    inputs or outputs after PSBT creation
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2" />
                                <div>
                                    <strong className="text-red-400">Limited Locktime:</strong> Single locktime value,
                                    no per-input requirements
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2" />
                                <div>
                                    <strong className="text-red-400">Blocks CoinJoin:</strong> Multiple parties can't
                                    collaboratively build a transaction
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border-green-500/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-400">
                                <CheckCircle2 className="w-5 h-5" />
                                PSBTv2 Solutions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2" />
                                <div>
                                    <strong className="text-green-400">Distributed Data:</strong> Transaction data spread
                                    across individual input/output maps
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2" />
                                <div>
                                    <strong className="text-green-400">Constructor Role:</strong> New role can dynamically
                                    add/remove inputs and outputs
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2" />
                                <div>
                                    <strong className="text-green-400">Advanced Locktime:</strong> Per-input locktime
                                    requirements with smart computation
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2" />
                                <div>
                                    <strong className="text-green-400">Enables Protocols:</strong> Makes CoinJoin, PayJoin,
                                    and collaborative transactions possible
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Callout type="info" title="Real-World Impact">
                    <p className="text-sm">
                        PSBTv2 is essential for privacy-enhancing protocols like <strong>CoinJoin</strong> (where multiple
                        users combine their transactions to obscure ownership) and <strong>PayJoin</strong> (where the sender
                        and receiver collaboratively build a transaction). These protocols require the ability to dynamically
                        construct transactions as multiple parties contribute inputs and outputs.
                    </p>
                </Callout>
            </motion.section>

            {/* Version Comparison */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="not-prose mb-16"
            >
                <h2 className="text-3xl font-bold mb-6 text-text-primary flex items-center gap-3">
                    <GitCompare className="text-purple-400" />
                    PSBTv0 vs PSBTv2: Interactive Comparison
                </h2>

                <Card className="bg-bg-secondary border-purple-500/30">
                    <CardContent className="pt-6">
                        <VersionComparisonVisual />
                    </CardContent>
                </Card>
            </motion.section>

            {/* TX Modifiable Flags */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="not-prose mb-16"
            >
                <h2 className="text-3xl font-bold mb-6 text-text-primary flex items-center gap-3">
                    <Settings className="text-purple-400" />
                    TX_MODIFIABLE Flags
                </h2>

                <p className="text-text-secondary mb-6">
                    The <code className="text-purple-400">PSBT_GLOBAL_TX_MODIFIABLE</code> field is a byte-level bitfield
                    that controls what operations are still permitted on the PSBT. Each bit represents a different capability:
                </p>

                <Card className="bg-bg-secondary border-purple-500/30">
                    <CardContent className="pt-6">
                        <ModifiableFlagsVisual />
                    </CardContent>
                </Card>
            </motion.section>

            {/* Constructor Role */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="not-prose mb-16"
            >
                <h2 className="text-3xl font-bold mb-6 text-text-primary flex items-center gap-3">
                    <Layers className="text-purple-400" />
                    The Constructor Role
                </h2>

                <p className="text-text-secondary mb-6">
                    PSBTv2 introduces the <strong className="text-purple-400">Constructor</strong> role, which can dynamically
                    modify the transaction structure. This is the key innovation that enables collaborative transaction building.
                </p>

                <Card className="bg-bg-secondary border-purple-500/30">
                    <CardContent className="pt-6">
                        <ConstructorRoleVisual />
                    </CardContent>
                </Card>
            </motion.section>

            {/* Locktime Determination */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="not-prose mb-16"
            >
                <h2 className="text-3xl font-bold mb-6 text-text-primary flex items-center gap-3">
                    <Clock className="text-purple-400" />
                    Advanced Locktime Determination
                </h2>

                <p className="text-text-secondary mb-6">
                    PSBTv2 introduces sophisticated locktime handling with per-input requirements. The final transaction
                    locktime is computed using a specific algorithm:
                </p>

                <Card className="bg-bg-secondary border-purple-500/30 mb-6">
                    <CardContent className="pt-6">
                        <LocktimeDeterminationVisual />
                    </CardContent>
                </Card>

                <Callout type="tip" title="Locktime Algorithm">
                    <ol className="text-sm space-y-2 ml-4">
                        <li>
                            <strong>Check all inputs:</strong> Look for REQUIRED_TIME_LOCKTIME and REQUIRED_HEIGHT_LOCKTIME fields
                        </li>
                        <li>
                            <strong>If no requirements:</strong> Use PSBT_GLOBAL_FALLBACK_LOCKTIME (or 0 if not present)
                        </li>
                        <li>
                            <strong>If requirements exist:</strong> Determine which type (time or height) ALL inputs support
                        </li>
                        <li>
                            <strong>Prefer height:</strong> If both types possible, use height (Bitcoin's native unit)
                        </li>
                        <li>
                            <strong>Use maximum:</strong> Take the highest value among all input requirements of the chosen type
                        </li>
                    </ol>
                </Callout>
            </motion.section>

            {/* PSBTv2 Workflow */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="not-prose mb-16"
            >
                <h2 className="text-3xl font-bold mb-6 text-text-primary flex items-center gap-3">
                    <Network className="text-purple-400" />
                    PSBTv2 Workflow & Roles
                </h2>

                <p className="text-text-secondary mb-6">
                    A PSBTv2 moves through multiple roles before becoming a final transaction. Each role has specific
                    responsibilities and limitations:
                </p>

                <Card className="bg-bg-secondary border-purple-500/30">
                    <CardContent className="pt-6">
                        <PSBTv2WorkflowDiagram />
                    </CardContent>
                </Card>
            </motion.section>

            {/* Code Examples */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="not-prose mb-16"
            >
                <h2 className="text-3xl font-bold mb-6 text-text-primary flex items-center gap-3">
                    <Code className="text-purple-400" />
                    Code Examples
                </h2>

                <div className="space-y-8">
                    {/* Creating PSBTv2 */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-text-primary">Creating a PSBTv2</h3>
                        <CodePlayground
                            title="Create PSBTv2 with Constructor"
                            initialCode={`import { PsbtV2 } from '@caravan/psbt';

// Create a new PsbtV2
const psbt = new PsbtV2();

// 1. Set Version (using property setter)
psbt.PSBT_GLOBAL_TX_VERSION = 2;

// 2. Set Modifiable Flags
// In V2, this is an array of strings, not a bitmask
const flags = ["INPUTS", "OUTPUTS"];
psbt.PSBT_GLOBAL_TX_MODIFIABLE = flags;

// 3. Set Fallback Locktime
psbt.PSBT_GLOBAL_FALLBACK_LOCKTIME = 0;

console.log("PSBTv2 created!");
console.log("Version:", psbt.PSBT_GLOBAL_TX_VERSION);
console.log("Input Count:", psbt.PSBT_GLOBAL_INPUT_COUNT); // Starts at 0
console.log("Modifiable:", psbt.PSBT_GLOBAL_TX_MODIFIABLE);`}
                            imports={{
                                PsbtV2,
                                Buffer
                            }}
                            height="380px"
                        />
                    </div>

                    {/* Adding Inputs/Outputs */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-text-primary">Constructor Adding Inputs & Outputs</h3>
                        <CodePlayground
                            title="Dynamic Transaction Construction"
                            initialCode={`import { PsbtV2 } from '@caravan/psbt';
import { Buffer } from 'buffer';

const psbt = new PsbtV2();
psbt.PSBT_GLOBAL_TX_VERSION = 2;

// Constructor adds first input
psbt.addInput({
  // FIX: Explicitly convert the hex string to a Buffer
  previousTxId: Buffer.from('759d6679b3595f9211f4864c8d502f90246a3666736277028131338634810852', 'hex'),
  outputIndex: 0,
  sequence: 0xfffffffe, // Enable RBF
  witnessUtxo: {
    amount: 100000, 
    script: Buffer.from('0014d85c2b71d0060b09c9886aeb815e809916124d9d', 'hex')
  }
});

// Constructor adds recipient output
psbt.addOutput({
  amount: 80000, 
  script: Buffer.from('0014d85c2b71d0060b09c9886aeb815e809916124d9d', 'hex')
});

// Constructor adds change output
psbt.addOutput({
  amount: 18000,
  script: Buffer.from('0014d85c2b71d0060b09c9886aeb815e809916124d9d', 'hex')
});

console.log("Transaction structure built!",psbt);
console.log("Total inputs:", psbt.PSBT_GLOBAL_INPUT_COUNT);
console.log("Total outputs:", psbt.PSBT_GLOBAL_OUTPUT_COUNT);`}
                            imports={{
                                PsbtV2,
                                Buffer
                            }}
                            height="450px"
                        />
                    </div>

                    {/* Signer Updating Flags */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-text-primary">Signer Updating Modifiable Flags</h3>
                        <CodePlayground
                            title="Updating Flags After Signing"
                            initialCode={`import { PsbtV2 } from '@caravan/psbt';

const psbt = new PsbtV2();
// Initialize as fully modifiable
psbt.PSBT_GLOBAL_TX_MODIFIABLE = ["INPUTS", "OUTPUTS"];

// Get current flags
let flags = psbt.PSBT_GLOBAL_TX_MODIFIABLE;
console.log("Current flags:", flags);

// ... Signing happens here (Signer adds SIGHASH_ALL) ...

// To lock the transaction, we remove "INPUTS" and "OUTPUTS" from the array
// Filter out the flags we want to remove
const lockedFlags = flags.filter(f => f !== "INPUTS" && f !== "OUTPUTS");

// Update the PSBT
psbt.PSBT_GLOBAL_TX_MODIFIABLE = lockedFlags;

console.log("Updated flags:", psbt.PSBT_GLOBAL_TX_MODIFIABLE);
console.log("Is Empty (Fully Locked)?", psbt.PSBT_GLOBAL_TX_MODIFIABLE.length === 0);`}
                            imports={{
                                PsbtV2,
                                Buffer
                            }}
                            height="420px"
                        />
                    </div>


                </div>
            </motion.section>

            {/* New Global Fields Reference */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="not-prose mb-16"
            >
                <h2 className="text-3xl font-bold mb-6 text-text-primary flex items-center gap-3">
                    <Database className="text-purple-400" />
                    PSBTv2 Field Reference
                </h2>

                <div className="space-y-4">
                    {[
                        {
                            name: 'PSBT_GLOBAL_TX_VERSION',
                            hex: '0x02',
                            desc: 'The version number of the transaction. Must be 2 or greater for PSBTv2.',
                            format: '4-byte signed integer (little-endian)',
                            required: true,
                            example: '02 00 00 00 (version 2)'
                        },
                        {
                            name: 'PSBT_GLOBAL_FALLBACK_LOCKTIME',
                            hex: '0x03',
                            desc: 'Default locktime to use if no inputs specify required locktimes.',
                            format: '4-byte unsigned integer (little-endian)',
                            required: false,
                            example: '00 00 00 00 (locktime 0)'
                        },
                        {
                            name: 'PSBT_GLOBAL_INPUT_COUNT',
                            hex: '0x04',
                            desc: 'The number of inputs in the PSBT. Must match actual input count.',
                            format: 'Compact size unsigned integer',
                            required: true,
                            example: '02 (2 inputs)'
                        },
                        {
                            name: 'PSBT_GLOBAL_OUTPUT_COUNT',
                            hex: '0x05',
                            desc: 'The number of outputs in the PSBT. Must match actual output count.',
                            format: 'Compact size unsigned integer',
                            required: true,
                            example: '02 (2 outputs)'
                        },
                        {
                            name: 'PSBT_GLOBAL_TX_MODIFIABLE',
                            hex: '0x06',
                            desc: 'Bitfield indicating what aspects of the transaction are still modifiable.',
                            format: '1-byte bitfield (bit 0: inputs, bit 1: outputs, bit 2: has SIGHASH_SINGLE)',
                            required: false,
                            example: '03 (inputs and outputs modifiable)'
                        },
                        {
                            name: 'PSBT_IN_PREVIOUS_TXID',
                            hex: '0x0e',
                            desc: 'The transaction ID of the UTXO being spent by this input.',
                            format: '32 bytes (internal byte order)',
                            required: true,
                            example: '71 0e a7 6a b4 5c...'
                        },
                        {
                            name: 'PSBT_IN_OUTPUT_INDEX',
                            hex: '0x0f',
                            desc: 'The index of the output in the previous transaction.',
                            format: '4-byte unsigned integer (little-endian)',
                            required: true,
                            example: '01 00 00 00 (output 1)'
                        },
                        {
                            name: 'PSBT_IN_SEQUENCE',
                            hex: '0x10',
                            desc: 'The sequence number for this input. Used for RBF and timelocks.',
                            format: '4-byte unsigned integer (little-endian)',
                            required: true,
                            example: 'ff ff ff fe (RBF enabled)'
                        },
                        {
                            name: 'PSBT_IN_REQUIRED_TIME_LOCKTIME',
                            hex: '0x11',
                            desc: 'Minimum Unix timestamp that the transaction locktime must be >= to spend this input.',
                            format: '4-byte unsigned integer (little-endian)',
                            required: false,
                            example: '00 ca 9a 3b (Unix timestamp)'
                        },
                        {
                            name: 'PSBT_IN_REQUIRED_HEIGHT_LOCKTIME',
                            hex: '0x12',
                            desc: 'Minimum block height that the transaction locktime must be >= to spend this input.',
                            format: '4-byte unsigned integer (little-endian)',
                            required: false,
                            example: '00 35 0c 00 (block 800,000)'
                        },
                        {
                            name: 'PSBT_OUT_AMOUNT',
                            hex: '0x03',
                            desc: 'The amount in satoshis being sent to this output.',
                            format: '8-byte signed integer (little-endian)',
                            required: true,
                            example: '00 4e 72 00 00 00 00 00 (30,000 sats)'
                        },
                        {
                            name: 'PSBT_OUT_SCRIPT',
                            hex: '0x04',
                            desc: 'The scriptPubKey for this output.',
                            format: 'Variable-length byte array',
                            required: true,
                            example: '00 14 75 1e 76 e8... (P2WPKH)'
                        }
                    ].map((field, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card className="bg-bg-secondary border-border hover:border-purple-500/30 transition-colors">
                                <CardContent className="pt-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 font-mono text-sm font-bold">
                                                {field.hex}
                                            </span>
                                            <span className="font-bold text-text-primary">{field.name}</span>
                                        </div>
                                        {field.required && (
                                            <span className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs font-semibold">
                                                Required
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-text-secondary mb-2">{field.desc}</p>
                                    <div className="grid md:grid-cols-2 gap-2 text-xs">
                                        <div className="p-2 bg-bg-tertiary rounded">
                                            <span className="text-text-muted">Format: </span>
                                            <span className="text-text-primary">{field.format}</span>
                                        </div>
                                        <div className="p-2 bg-bg-tertiary rounded font-mono">
                                            <span className="text-text-muted">Example: </span>
                                            <span className="text-purple-400">{field.example}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Comparison Summary */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="not-prose mb-16"
            >
                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/5">
                        <CardHeader>
                            <CardTitle className="text-green-400 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                PSBTv2 Advantages
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <strong>Dynamic Construction:</strong> Add/remove inputs and outputs after creation
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <strong>Self-Contained:</strong> Each input/output contains its own data
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <strong>Advanced Locktime:</strong> Per-input locktime requirements with smart computation
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <strong>Modifiable Flags:</strong> Fine-grained control over what can be changed
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <strong>Enables Protocols:</strong> Makes CoinJoin, PayJoin, and collaborative TXs possible
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Sparkles className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <strong>Constructor Role:</strong> New role for dynamic transaction building
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-orange-500/5">
                        <CardHeader>
                            <CardTitle className="text-yellow-400 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5" />
                                Compatibility & Considerations
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                                <Info className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <strong>Hardware Wallet Support:</strong> Not all hardware wallets support PSBTv2 yet
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Info className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <strong>Software Compatibility:</strong> Some wallets may require PSBTv0 format
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Info className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <strong>Version Conversion:</strong> Can convert between v0 and v2, but may lose features
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <strong>Caravan Support:</strong> Full support with automatic conversion
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <strong>Future-Proof:</strong> PSBTv2 is the way forward for advanced protocols
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </motion.section>

            {/* Navigation */}
            <PageNavigation
                prev={{ href: '/learn/psbt/bip174', title: 'BIP-174: PSBTv0' }}
                next={{ href: '/learn/psbt/explorer', title: 'PSBT Explorer Tool' }}
            />
        </div>
    );
}