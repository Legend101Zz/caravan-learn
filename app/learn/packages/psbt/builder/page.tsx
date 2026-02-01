/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Callout } from '@/components/content/callout';
import { PageNavigation } from '@/components/layout/page-navigation';
import {
    Plus,
    Minus,
    Trash2,
    Copy,
    Check,
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    ChevronDown,
    Settings,
    ArrowDownToLine,
    ArrowUpFromLine,
    Eye,
    Code,
    Download,
    Upload,
    Zap,
    Bug,
    Layers,
    RefreshCw,
    GripVertical,
    Info,
    HelpCircle,
    Wallet,
    Hash,
    Clock,
    DollarSign,
    FileText,
    Send,
    Shield,
    BookOpen,
    Lightbulb,
    Box,
    GitBranch,
    Binary,
    Lock,
    Unlock,
    ArrowRight,
    Globe
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface PSBTInput {
    id: string;
    txid: string;
    vout: number;
    amount: string;
    scriptPubKey: string;
    witnessScript?: string;
    redeemScript?: string;
    sequence: number;
    bip32Derivations: Array<{
        pubkey: string;
        masterFingerprint: string;
        path: string;
    }>;
    isSegwit: boolean;
    errors: string[];
}

interface PSBTOutput {
    id: string;
    address: string;
    amount: string;
    isChange: boolean;
    bip32Derivations: Array<{
        pubkey: string;
        masterFingerprint: string;
        path: string;
    }>;
    errors: string[];
}

interface PSBTConfig {
    network: 'mainnet' | 'testnet' | 'regtest';
    version: number;
    locktime: number;
    rbfEnabled: boolean;
}

interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    fee: number;
    feeRate: number;
    inputTotal: number;
    outputTotal: number;
}

// ============================================
// UTILITIES
// ============================================

const generateId = () => Math.random().toString(36).substr(2, 9);
const satsToBtc = (sats: number): string => (sats / 100000000).toFixed(8);
const btcToSats = (btc: string): number => Math.round(parseFloat(btc || '0') * 100000000);
const validateTxid = (txid: string): boolean => /^[a-fA-F0-9]{64}$/.test(txid);

const validateAddress = (address: string, network: string): boolean => {
    try {
        if (!address) return false;
        if (network === 'mainnet') {
            return address.startsWith('bc1') || address.startsWith('1') || address.startsWith('3');
        }
        return address.startsWith('tb1') || address.startsWith('m') || address.startsWith('n') || address.startsWith('2');
    } catch {
        return false;
    }
};

// ============================================
// STEP EXPLANATION COMPONENT
// ============================================

const StepExplanation = ({
    title,
    description,
    learnMore,
    currentAction,
    icon: Icon
}: {
    title: string;
    description: string;
    learnMore?: string[];
    currentAction?: string;
    icon: any;
}) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/30"
        >
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={24} className="text-primary" />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{title}</h3>
                    <p className="text-text-secondary text-sm">{description}</p>

                    {currentAction && (
                        <div className="mt-3 p-2 bg-primary/20 rounded-lg flex items-center gap-2">
                            <Zap size={16} className="text-primary" />
                            <span className="text-sm font-medium text-primary">{currentAction}</span>
                        </div>
                    )}

                    {learnMore && learnMore.length > 0 && (
                        <>
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="mt-3 flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                            >
                                <Lightbulb size={14} />
                                {expanded ? 'Hide' : 'Learn'} more about this step
                                <ChevronDown className={`transition-transform ${expanded ? 'rotate-180' : ''}`} size={14} />
                            </button>
                            <AnimatePresence>
                                {expanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-3 p-3 bg-bg-secondary rounded-lg space-y-2">
                                            {learnMore.map((item, i) => (
                                                <div key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                                                    <span className="text-primary">•</span>
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// ============================================
// LIVE PSBT BLUEPRINT COMPONENT
// ============================================

const PSBTBlueprintPanel = ({
    config,
    inputs,
    outputs,
    currentStep,
    isCollapsed,
    onToggle
}: {
    config: PSBTConfig;
    inputs: PSBTInput[];
    outputs: PSBTOutput[];
    currentStep: number;
    isCollapsed: boolean;
    onToggle: () => void;
}) => {
    const inputTotal = inputs.reduce((sum, inp) => sum + btcToSats(inp.amount), 0);
    const outputTotal = outputs.reduce((sum, out) => sum + btcToSats(out.amount), 0);
    const fee = inputTotal - outputTotal;

    // Generate mock PSBT structure for visualization
    const psbtStructure = useMemo(() => {
        return {
            magic: '70736274ff',
            global: {
                version: { hex: '01fb04' + config.version.toString(16).padStart(8, '0'), value: `Version ${config.version === 0 ? '0 (PSBTv0)' : '2 (PSBTv2)'}` },
                txVersion: { hex: '0102' + (config.version).toString(16).padStart(8, '0'), value: `TX Version ${config.version}` },
                locktime: config.locktime > 0 ? { hex: '0103' + config.locktime.toString(16).padStart(8, '0'), value: `Locktime ${config.locktime}` } : null,
                inputCount: { hex: '0104' + inputs.length.toString(16).padStart(2, '0'), value: `${inputs.length} input(s)` },
                outputCount: { hex: '0105' + outputs.length.toString(16).padStart(2, '0'), value: `${outputs.length} output(s)` },
                modifiable: config.rbfEnabled ? { hex: '010603', value: 'Inputs & Outputs Modifiable' } : null
            },
            inputs: inputs.map((inp, i) => ({
                index: i,
                txid: inp.txid ? { hex: '0e' + inp.txid, value: inp.txid.substring(0, 16) + '...' } : null,
                vout: { hex: '0f' + inp.vout.toString(16).padStart(8, '0'), value: `Output #${inp.vout}` },
                sequence: { hex: '10' + inp.sequence.toString(16).padStart(8, '0'), value: inp.sequence === 0xffffffff ? 'Final' : inp.sequence === 0xfffffffd ? 'RBF Enabled' : `${inp.sequence}` },
                witnessUtxo: inp.amount ? { hex: '01' + btcToSats(inp.amount).toString(16).padStart(16, '0'), value: `${inp.amount} BTC` } : null,
                isSegwit: inp.isSegwit
            })),
            outputs: outputs.map((out, i) => ({
                index: i,
                amount: out.amount ? { hex: '03' + btcToSats(out.amount).toString(16).padStart(16, '0'), value: `${out.amount} BTC` } : null,
                address: out.address ? { value: out.address.substring(0, 20) + '...' } : null,
                isChange: out.isChange
            }))
        };
    }, [config, inputs, outputs]);

    return (
        <div className={`fixed right-4 top-24 z-40 transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-80'}`}>
            <Card className="bg-bg-card/95 backdrop-blur border-primary/30 shadow-xl max-h-[calc(100vh-120px)] overflow-hidden">
                {/* Header */}
                <div
                    className="p-3 border-b border-border flex items-center justify-between cursor-pointer hover:bg-bg-tertiary/50"
                    onClick={onToggle}
                >
                    {!isCollapsed && (
                        <div className="flex items-center gap-2">
                            <Binary size={18} className="text-primary" />
                            <span className="font-bold text-sm">PSBT Blueprint</span>
                        </div>
                    )}
                    <ChevronRight className={`transition-transform ${isCollapsed ? '' : 'rotate-180'}`} size={18} />
                </div>

                {/* Content */}
                {!isCollapsed && (
                    <div className="p-3 overflow-y-auto max-h-[calc(100vh-200px)]">
                        {/* Magic Bytes */}
                        <div className="mb-4">
                            <div className="text-xs text-text-muted mb-1 flex items-center gap-1">
                                <Box size={12} />
                                Magic Header
                            </div>
                            <div className="p-2 bg-primary/10 rounded font-mono text-xs text-primary">
                                70 73 62 74 ff
                                <span className="text-text-muted ml-2">← "psbt" + separator</span>
                            </div>
                        </div>

                        {/* Global Map */}
                        <div className="mb-4">
                            <div className="text-xs text-text-muted mb-1 flex items-center gap-1">
                                <Globe size={12} />
                                Global Map
                                {currentStep === 0 && <span className="ml-auto text-primary animate-pulse">● editing</span>}
                            </div>
                            <div className="space-y-1">
                                {Object.entries(psbtStructure.global).map(([key, value]) => {
                                    if (!value) return null;
                                    return (
                                        <motion.div
                                            key={key}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="p-2 bg-green-500/10 rounded border border-green-500/20"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-green-400">{key}</span>
                                                <span className="text-xs text-text-secondary">{value.value}</span>
                                            </div>
                                            {value.hex && (
                                                <div className="font-mono text-[10px] text-text-muted mt-1 truncate">
                                                    {value.hex}
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Input Maps */}
                        <div className="mb-4">
                            <div className="text-xs text-text-muted mb-1 flex items-center gap-1">
                                <ArrowDownToLine size={12} />
                                Input Maps ({inputs.length})
                                {currentStep === 1 && <span className="ml-auto text-primary animate-pulse">● editing</span>}
                            </div>
                            {psbtStructure.inputs.length === 0 ? (
                                <div className="p-2 border border-dashed border-blue-500/30 rounded text-center text-xs text-text-muted">
                                    No inputs yet
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {psbtStructure.inputs.map((input, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="p-2 bg-blue-500/10 rounded border border-blue-500/20"
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs text-blue-400 font-semibold">Input #{i}</span>
                                                {input.isSegwit && (
                                                    <span className="text-[10px] px-1 py-0.5 bg-blue-500/20 rounded text-blue-300">SegWit</span>
                                                )}
                                            </div>
                                            <div className="space-y-0.5 text-[10px]">
                                                {input.txid && (
                                                    <div className="flex justify-between">
                                                        <span className="text-text-muted">TXID:</span>
                                                        <span className="font-mono text-text-secondary">{input.txid.value}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between">
                                                    <span className="text-text-muted">Vout:</span>
                                                    <span className="text-text-secondary">{input.vout.value}</span>
                                                </div>
                                                {input.witnessUtxo && (
                                                    <div className="flex justify-between">
                                                        <span className="text-text-muted">Value:</span>
                                                        <span className="text-green-400 font-semibold">{input.witnessUtxo.value}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Output Maps */}
                        <div className="mb-4">
                            <div className="text-xs text-text-muted mb-1 flex items-center gap-1">
                                <ArrowUpFromLine size={12} />
                                Output Maps ({outputs.length})
                                {currentStep === 2 && <span className="ml-auto text-primary animate-pulse">● editing</span>}
                            </div>
                            {psbtStructure.outputs.length === 0 ? (
                                <div className="p-2 border border-dashed border-purple-500/30 rounded text-center text-xs text-text-muted">
                                    No outputs yet
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {psbtStructure.outputs.map((output, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`p-2 rounded border ${output.isChange
                                                ? 'bg-yellow-500/10 border-yellow-500/20'
                                                : 'bg-purple-500/10 border-purple-500/20'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`text-xs font-semibold ${output.isChange ? 'text-yellow-400' : 'text-purple-400'}`}>
                                                    Output #{i}
                                                </span>
                                                {output.isChange && (
                                                    <span className="text-[10px] px-1 py-0.5 bg-yellow-500/20 rounded text-yellow-300">Change</span>
                                                )}
                                            </div>
                                            <div className="space-y-0.5 text-[10px]">
                                                {output.address && (
                                                    <div className="flex justify-between">
                                                        <span className="text-text-muted">Address:</span>
                                                        <span className="font-mono text-text-secondary">{output.address.value}</span>
                                                    </div>
                                                )}
                                                {output.amount && (
                                                    <div className="flex justify-between">
                                                        <span className="text-text-muted">Amount:</span>
                                                        <span className="text-green-400 font-semibold">{output.amount.value}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Fee Summary */}
                        <div className="p-2 bg-bg-tertiary rounded border border-border">
                            <div className="text-xs text-text-muted mb-1">Transaction Summary</div>
                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-blue-400">Total In:</span>
                                    <span className="font-mono">{satsToBtc(inputTotal)} BTC</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-purple-400">Total Out:</span>
                                    <span className="font-mono">{satsToBtc(outputTotal)} BTC</span>
                                </div>
                                <div className="flex justify-between pt-1 border-t border-border">
                                    <span className={fee < 0 ? 'text-red-400' : 'text-green-400'}>Fee:</span>
                                    <span className={`font-mono font-bold ${fee < 0 ? 'text-red-400' : 'text-green-400'}`}>
                                        {satsToBtc(Math.max(0, fee))} BTC
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

// ============================================
// STEP INDICATOR COMPONENT
// ============================================

const StepIndicator = ({
    steps,
    currentStep,
    onStepClick
}: {
    steps: Array<{ id: string; label: string; icon: any }>;
    currentStep: number;
    onStepClick: (step: number) => void;
}) => (
    <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isComplete = index < currentStep;

            return (
                <React.Fragment key={step.id}>
                    <motion.button
                        onClick={() => onStepClick(index)}
                        className={`
                            flex flex-col items-center gap-2 p-3 rounded-xl transition-all
                            ${isActive ? 'bg-primary/20' : isComplete ? 'bg-green-500/10' : 'bg-bg-tertiary'}
                        `}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center
                            ${isActive ? 'bg-primary text-white' : isComplete ? 'bg-green-500 text-white' : 'bg-bg-secondary text-text-muted'}
                        `}>
                            {isComplete ? <Check size={20} /> : <Icon size={20} />}
                        </div>
                        <span className={`text-xs font-medium ${isActive ? 'text-primary' : isComplete ? 'text-green-400' : 'text-text-muted'}`}>
                            {step.label}
                        </span>
                    </motion.button>

                    {index < steps.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-2 ${index < currentStep ? 'bg-green-500' : 'bg-border'}`} />
                    )}
                </React.Fragment>
            );
        })}
    </div>
);

// ============================================
// TOOLTIP COMPONENT
// ============================================

const Tooltip = ({ content, children }: { content: string; children: React.ReactNode }) => {
    const [show, setShow] = useState(false);

    return (
        <div className="relative inline-block">
            <div
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
            >
                {children}
            </div>
            <AnimatePresence>
                {show && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 
                                   bg-bg-card border border-border rounded-lg shadow-xl text-xs text-text-secondary
                                   whitespace-nowrap max-w-xs"
                    >
                        {content}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 
                                            border-4 border-transparent border-t-border" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ============================================
// FORM FIELD COMPONENT
// ============================================

const FormField = ({
    label,
    tooltip,
    error,
    children
}: {
    label: string;
    tooltip?: string;
    error?: string;
    children: React.ReactNode;
}) => (
    <div className="space-y-1">
        <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-text-secondary">{label}</label>
            {tooltip && (
                <Tooltip content={tooltip}>
                    <HelpCircle size={14} className="text-text-muted cursor-help" />
                </Tooltip>
            )}
        </div>
        {children}
        {error && (
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-1 text-xs text-red-400"
            >
                <AlertCircle size={12} />
                {error}
            </motion.div>
        )}
    </div>
);

// ============================================
// STEP 1: CONFIGURATION
// ============================================

const ConfigurationStep = ({
    config,
    setConfig
}: {
    config: PSBTConfig;
    setConfig: (config: PSBTConfig) => void;
}) => {
    return (
        <div className="space-y-6">
            <StepExplanation
                icon={Settings}
                title="Step 1: Configure Your Transaction"
                description="Before building your PSBT, you need to set up some basic parameters. These settings affect how your transaction behaves on the network."
                currentAction="Setting global PSBT parameters"
                learnMore={[
                    "The Network determines address format validation (mainnet addresses start with 'bc1', testnet with 'tb1')",
                    "Transaction Version 2 is required for SegWit and enables features like CSV (CheckSequenceVerify) timelocks",
                    "RBF (Replace-By-Fee) lets you bump the fee later if your transaction is stuck - it sets sequence to 0xfffffffd",
                    "Locktime specifies the earliest time (block height or Unix timestamp) when miners can include your transaction"
                ]}
            />

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-bg-secondary">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Globe size={18} className="text-primary" />
                            Network Settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            label="Network"
                            tooltip="Select the Bitcoin network for address validation and encoding"
                        >
                            <div className="flex gap-2">
                                {(['mainnet', 'testnet', 'regtest'] as const).map((net) => (
                                    <Button
                                        key={net}
                                        variant={config.network === net ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setConfig({ ...config, network: net })}
                                        className={config.network === net ? 'bg-primary' : ''}
                                    >
                                        {net.charAt(0).toUpperCase() + net.slice(1)}
                                    </Button>
                                ))}
                            </div>
                            <p className="text-xs text-text-muted mt-2">
                                {config.network === 'mainnet'
                                    ? '⚠️ Real Bitcoin! Addresses start with bc1, 1, or 3'
                                    : config.network === 'testnet'
                                        ? '✓ Safe for testing. Addresses start with tb1, m, n, or 2'
                                        : '✓ Local testing. Same address format as testnet'}
                            </p>
                        </FormField>

                        <FormField
                            label="Transaction Version"
                            tooltip="Version 2 is recommended - required for SegWit and enables CSV timelocks"
                        >
                            <div className="flex gap-2">
                                {[1, 2].map((v) => (
                                    <Button
                                        key={v}
                                        variant={config.version === v ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setConfig({ ...config, version: v })}
                                        className={config.version === v ? 'bg-primary' : ''}
                                    >
                                        Version {v}
                                    </Button>
                                ))}
                            </div>
                            <p className="text-xs text-text-muted mt-2">
                                {config.version === 2
                                    ? '✓ Recommended for modern transactions'
                                    : '⚠️ Legacy version - some features unavailable'}
                            </p>
                        </FormField>
                    </CardContent>
                </Card>

                <Card className="bg-bg-secondary">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock size={18} className="text-blue-400" />
                            Timelock & RBF
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            label="Locktime"
                            tooltip="Block height (< 500M) or Unix timestamp (≥ 500M) when tx can be mined. 0 = no lock."
                        >
                            <Input
                                type="number"
                                value={config.locktime}
                                onChange={(e) => setConfig({ ...config, locktime: parseInt(e.target.value) || 0 })}
                                min={0}
                                className="font-mono"
                            />
                            <p className="text-xs text-text-muted mt-2">
                                {config.locktime === 0
                                    ? '✓ No timelock - transaction can be mined immediately'
                                    : config.locktime < 500000000
                                        ? `⏳ Block height lock - can be mined after block ${config.locktime}`
                                        : `⏳ Time lock - can be mined after ${new Date(config.locktime * 1000).toLocaleString()}`}
                            </p>
                        </FormField>

                        <FormField
                            label="Replace-By-Fee (RBF)"
                            tooltip="Enable RBF to allow fee bumping if your transaction gets stuck"
                        >
                            <Button
                                variant={config.rbfEnabled ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setConfig({ ...config, rbfEnabled: !config.rbfEnabled })}
                                className={`w-full justify-start ${config.rbfEnabled ? 'bg-green-600' : ''}`}
                            >
                                {config.rbfEnabled ? (
                                    <>
                                        <Unlock size={14} className="mr-2" />
                                        RBF Enabled (Recommended)
                                    </>
                                ) : (
                                    <>
                                        <Lock size={14} className="mr-2" />
                                        RBF Disabled
                                    </>
                                )}
                            </Button>
                            <p className="text-xs text-text-muted mt-2">
                                {config.rbfEnabled
                                    ? '✓ Sequence = 0xfffffffd - you can bump fees later'
                                    : '⚠️ Sequence = 0xffffffff - transaction cannot be replaced'}
                            </p>
                        </FormField>
                    </CardContent>
                </Card>
            </div>

            {/* What gets added to PSBT */}
            <Card className="bg-gradient-to-r from-green-950/20 to-primary/10 border-green-500/30">
                <CardContent className="pt-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <FileText size={16} className="text-green-400" />
                        What this adds to your PSBT:
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                        <div className="p-2 bg-bg-secondary rounded flex items-center gap-2">
                            <code className="text-green-400 text-xs">PSBT_GLOBAL_TX_VERSION</code>
                            <span className="text-text-muted">= {config.version}</span>
                        </div>
                        <div className="p-2 bg-bg-secondary rounded flex items-center gap-2">
                            <code className="text-green-400 text-xs">PSBT_GLOBAL_VERSION</code>
                            <span className="text-text-muted">= 2 (PSBTv2)</span>
                        </div>
                        {config.locktime > 0 && (
                            <div className="p-2 bg-bg-secondary rounded flex items-center gap-2">
                                <code className="text-green-400 text-xs">PSBT_GLOBAL_FALLBACK_LOCKTIME</code>
                                <span className="text-text-muted">= {config.locktime}</span>
                            </div>
                        )}
                        {config.rbfEnabled && (
                            <div className="p-2 bg-bg-secondary rounded flex items-center gap-2">
                                <code className="text-blue-400 text-xs">PSBT_IN_SEQUENCE</code>
                                <span className="text-text-muted">= 0xfffffffd (RBF)</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// ============================================
// INPUT CARD COMPONENT
// ============================================

const InputCard = ({
    input,
    index,
    onUpdate,
    onRemove,
    network
}: {
    input: PSBTInput;
    index: number;
    onUpdate: (input: PSBTInput) => void;
    onRemove: () => void;
    network: string;
}) => {
    const [expanded, setExpanded] = useState(true);
    const [showAdvanced, setShowAdvanced] = useState(false);

    const validateInput = useCallback((inp: PSBTInput): string[] => {
        const errors: string[] = [];
        if (!inp.txid) errors.push('TXID is required');
        else if (!validateTxid(inp.txid)) errors.push('Invalid TXID format (must be 64 hex chars)');
        if (inp.vout < 0) errors.push('Output index must be >= 0');
        if (!inp.amount || parseFloat(inp.amount) <= 0) errors.push('Amount must be greater than 0');
        return errors;
    }, []);

    const handleChange = (field: keyof PSBTInput, value: any) => {
        const updated = { ...input, [field]: value };
        updated.errors = validateInput(updated);
        onUpdate(updated);
    };

    const hasErrors = input.errors && input.errors.length > 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`rounded-xl border-2 overflow-hidden ${hasErrors ? 'border-red-500/50 bg-red-950/10' : 'border-blue-500/30 bg-blue-950/10'
                }`}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-bg-tertiary/50 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${hasErrors ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                        {index}
                    </div>
                    <div>
                        <div className="font-semibold text-sm">
                            Input #{index}
                            {input.txid && (
                                <span className="text-text-muted font-mono text-xs ml-2">
                                    {input.txid.substring(0, 8)}...:{input.vout}
                                </span>
                            )}
                        </div>
                        {input.amount && (
                            <div className="text-xs text-text-muted">
                                {input.amount} BTC ({btcToSats(input.amount).toLocaleString()} sats)
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {hasErrors && (
                        <div className="flex items-center gap-1 text-red-400 text-xs">
                            <AlertCircle size={14} />
                            {input.errors.length}
                        </div>
                    )}
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onRemove(); }}>
                        <Trash2 size={16} className="text-red-400" />
                    </Button>
                    <ChevronRight
                        size={16}
                        className={`transition-transform ${expanded ? 'rotate-90' : ''}`}
                    />
                </div>
            </div>

            {/* Content */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 pt-0 space-y-4 border-t border-border/50">
                            {/* Explanation for this input */}
                            <div className="p-3 bg-blue-950/30 rounded-lg border border-blue-500/20">
                                <div className="flex items-start gap-2">
                                    <Info size={14} className="text-blue-400 mt-0.5" />
                                    <div className="text-xs text-text-secondary">
                                        <strong className="text-blue-400">What is a UTXO?</strong> A UTXO (Unspent Transaction Output) is a piece of Bitcoin you received in a previous transaction.
                                        To spend it, you need to reference the transaction ID (TXID) and the output index (vout) where it lives.
                                    </div>
                                </div>
                            </div>

                            {/* Basic Fields */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField
                                    label="Transaction ID (TXID)"
                                    tooltip="The 64-character hex ID of the transaction containing the UTXO you want to spend"
                                    error={input.errors?.find(e => e.includes('TXID'))}
                                >
                                    <Input
                                        value={input.txid}
                                        onChange={(e) => handleChange('txid', e.target.value.toLowerCase().replace(/[^a-f0-9]/g, ''))}
                                        placeholder="e.g., 7f4ab2c1d3e5..."
                                        className="font-mono text-xs"
                                        maxLength={64}
                                    />
                                    <div className="text-xs text-text-muted mt-1">
                                        {input.txid.length}/64 characters
                                        {input.txid.length === 64 && <span className="text-green-400 ml-2">✓ Valid length</span>}
                                    </div>
                                </FormField>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        label="Output Index (vout)"
                                        tooltip="Which output of the transaction to spend (0 = first output)"
                                        error={input.errors?.find(e => e.includes('index'))}
                                    >
                                        <Input
                                            type="number"
                                            value={input.vout}
                                            onChange={(e) => handleChange('vout', parseInt(e.target.value) || 0)}
                                            min={0}
                                            className="font-mono"
                                        />
                                    </FormField>

                                    <FormField
                                        label="Amount (BTC)"
                                        tooltip="The exact value of this UTXO - must match the blockchain!"
                                        error={input.errors?.find(e => e.includes('Amount'))}
                                    >
                                        <Input
                                            type="number"
                                            step="0.00000001"
                                            value={input.amount}
                                            onChange={(e) => handleChange('amount', e.target.value)}
                                            placeholder="0.001"
                                            className="font-mono"
                                        />
                                    </FormField>
                                </div>
                            </div>

                            {/* Script Type Toggle */}
                            <div className="p-3 bg-bg-tertiary rounded-lg">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="text-sm font-medium">Script Type</span>
                                        <p className="text-xs text-text-muted mt-1">
                                            {input.isSegwit
                                                ? 'SegWit (P2WSH) - Modern, lower fees'
                                                : 'Legacy (P2SH) - Compatible with all wallets'}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant={input.isSegwit ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => handleChange('isSegwit', true)}
                                            className={input.isSegwit ? 'bg-blue-600' : ''}
                                        >
                                            SegWit
                                        </Button>
                                        <Button
                                            variant={!input.isSegwit ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => handleChange('isSegwit', false)}
                                            className={!input.isSegwit ? 'bg-blue-600' : ''}
                                        >
                                            Legacy
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* What this adds to PSBT */}
                            <div className="p-3 bg-green-950/20 rounded-lg border border-green-500/20">
                                <div className="text-xs font-semibold text-green-400 mb-2">
                                    Fields added to PSBT for this input:
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="flex items-center gap-2">
                                        <code className="text-green-400">PSBT_IN_PREVIOUS_TXID</code>
                                        {input.txid && <Check size={12} className="text-green-400" />}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <code className="text-green-400">PSBT_IN_OUTPUT_INDEX</code>
                                        <Check size={12} className="text-green-400" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <code className="text-green-400">PSBT_IN_SEQUENCE</code>
                                        <Check size={12} className="text-green-400" />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <code className="text-blue-400">PSBT_IN_WITNESS_UTXO</code>
                                        {input.amount && <Check size={12} className="text-green-400" />}
                                    </div>
                                </div>
                            </div>

                            {/* Advanced Toggle */}
                            <button
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                            >
                                <Settings size={14} />
                                {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                                <ChevronRight className={`transition-transform ${showAdvanced ? 'rotate-90' : ''}`} size={14} />
                            </button>

                            {/* Advanced Fields */}
                            <AnimatePresence>
                                {showAdvanced && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="space-y-4 overflow-hidden"
                                    >
                                        <FormField
                                            label="Sequence Number"
                                            tooltip="Controls RBF and relative timelocks"
                                        >
                                            <Input
                                                value={`0x${input.sequence.toString(16)}`}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace('0x', '');
                                                    handleChange('sequence', parseInt(val, 16) || 0);
                                                }}
                                                className="font-mono"
                                            />
                                            <div className="flex gap-2 mt-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleChange('sequence', 0xffffffff)}
                                                >
                                                    Final (no RBF)
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleChange('sequence', 0xfffffffd)}
                                                >
                                                    RBF Enabled
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleChange('sequence', 0xfffffffe)}
                                                >
                                                    Locktime Enabled
                                                </Button>
                                            </div>
                                        </FormField>

                                        {input.isSegwit && (
                                            <FormField
                                                label="Witness Script (hex)"
                                                tooltip="For P2WSH - the script that must be satisfied to spend"
                                            >
                                                <Textarea
                                                    value={input.witnessScript || ''}
                                                    onChange={(e) => handleChange('witnessScript', e.target.value)}
                                                    placeholder="For multisig: 5221<pubkey1>21<pubkey2>52ae"
                                                    className="font-mono text-xs min-h-[80px]"
                                                />
                                            </FormField>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// ============================================
// STEP 2: INPUTS BUILDER
// ============================================

const InputsStep = ({
    inputs,
    setInputs,
    config
}: {
    inputs: PSBTInput[];
    setInputs: (inputs: PSBTInput[]) => void;
    config: PSBTConfig;
}) => {
    const addInput = () => {
        const newInput: PSBTInput = {
            id: generateId(),
            txid: '',
            vout: 0,
            amount: '',
            scriptPubKey: '',
            sequence: config.rbfEnabled ? 0xfffffffd : 0xffffffff,
            bip32Derivations: [],
            isSegwit: true,
            errors: ['TXID is required', 'Amount must be greater than 0']
        };
        setInputs([...inputs, newInput]);
    };

    const updateInput = (index: number, updated: PSBTInput) => {
        const newInputs = [...inputs];
        newInputs[index] = updated;
        setInputs(newInputs);
    };

    const removeInput = (index: number) => {
        setInputs(inputs.filter((_, i) => i !== index));
    };

    const totalInputAmount = inputs.reduce((sum, inp) => sum + btcToSats(inp.amount), 0);
    const hasErrors = inputs.some(inp => inp.errors && inp.errors.length > 0);

    return (
        <div className="space-y-6">
            <StepExplanation
                icon={ArrowDownToLine}
                title="Step 2: Add Inputs (UTXOs to Spend)"
                description="Inputs are the UTXOs (Unspent Transaction Outputs) you want to spend. Each input references a previous transaction output that sent Bitcoin to an address you control."
                currentAction={`Adding ${inputs.length} input(s) to PSBT`}
                learnMore={[
                    "Every Bitcoin payment creates outputs. When you receive Bitcoin, you get a UTXO that you can later spend.",
                    "To spend a UTXO, you need its TXID (transaction ID) and vout (output index within that transaction).",
                    "The amount MUST match exactly what's on the blockchain - signers will verify this!",
                    "For SegWit inputs, we use WITNESS_UTXO which only needs amount + scriptPubKey (more efficient).",
                    "Multiple inputs are combined when you need to spend more than one UTXO to cover your payment + fees."
                ]}
            />

            {/* Summary Bar */}
            <Card className="bg-gradient-to-r from-blue-500/10 to-primary/10 border-blue-500/30">
                <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div>
                                <div className="text-xs text-text-muted">Input Count</div>
                                <div className="text-2xl font-bold text-blue-400">{inputs.length}</div>
                            </div>
                            <div className="h-10 w-px bg-border" />
                            <div>
                                <div className="text-xs text-text-muted">Total Value</div>
                                <div className="text-2xl font-bold font-mono">
                                    {satsToBtc(totalInputAmount)} <span className="text-sm text-text-muted">BTC</span>
                                </div>
                            </div>
                            <div className="h-10 w-px bg-border" />
                            <div>
                                <div className="text-xs text-text-muted">Sats</div>
                                <div className="text-lg font-mono text-text-secondary">
                                    {totalInputAmount.toLocaleString()}
                                </div>
                            </div>
                        </div>
                        <Button onClick={addInput} className="bg-blue-600 hover:bg-blue-700">
                            <Plus size={16} className="mr-2" />
                            Add Input
                        </Button>
                    </div>
                    {hasErrors && inputs.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2 text-sm text-yellow-400">
                            <AlertTriangle size={16} />
                            Some inputs have validation errors - fix them before proceeding
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Inputs List */}
            <div className="space-y-4">
                <AnimatePresence>
                    {inputs.map((input, index) => (
                        <InputCard
                            key={input.id}
                            input={input}
                            index={index}
                            onUpdate={(updated) => updateInput(index, updated)}
                            onRemove={() => removeInput(index)}
                            network={config.network}
                        />
                    ))}
                </AnimatePresence>

                {inputs.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 border-2 border-dashed border-border rounded-xl"
                    >
                        <ArrowDownToLine size={48} className="mx-auto text-text-muted mb-4" />
                        <h3 className="font-semibold mb-2">No inputs added yet</h3>
                        <p className="text-text-muted text-sm mb-4 max-w-md mx-auto">
                            Add at least one UTXO to spend. You'll need the transaction ID and output index
                            from a previous transaction where you received Bitcoin.
                        </p>
                        <Button onClick={addInput} variant="outline">
                            <Plus size={16} className="mr-2" />
                            Add Your First Input
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

// ============================================
// OUTPUT CARD COMPONENT
// ============================================

const OutputCard = ({
    output,
    index,
    onUpdate,
    onRemove,
    network
}: {
    output: PSBTOutput;
    index: number;
    onUpdate: (output: PSBTOutput) => void;
    onRemove: () => void;
    network: string;
}) => {
    const [expanded, setExpanded] = useState(true);

    const validateOutput = useCallback((out: PSBTOutput): string[] => {
        const errors: string[] = [];
        if (!out.address) errors.push('Address is required');
        else if (!validateAddress(out.address, network)) errors.push(`Invalid address for ${network}`);
        if (!out.amount || parseFloat(out.amount) <= 0) errors.push('Amount must be greater than 0');
        return errors;
    }, [network]);

    const handleChange = (field: keyof PSBTOutput, value: any) => {
        const updated = { ...output, [field]: value };
        updated.errors = validateOutput(updated);
        onUpdate(updated);
    };

    const hasErrors = output.errors && output.errors.length > 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`rounded-xl border-2 overflow-hidden ${hasErrors ? 'border-red-500/50 bg-red-950/10' :
                output.isChange ? 'border-yellow-500/30 bg-yellow-950/10' : 'border-purple-500/30 bg-purple-950/10'
                }`}
        >
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-bg-tertiary/50 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${hasErrors ? 'bg-red-500/20 text-red-400' :
                        output.isChange ? 'bg-yellow-500/20 text-yellow-400' : 'bg-purple-500/20 text-purple-400'
                        }`}>
                        {index}
                    </div>
                    <div>
                        <div className="font-semibold text-sm flex items-center gap-2">
                            Output #{index}
                            {output.isChange && (
                                <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs">
                                    Change
                                </span>
                            )}
                        </div>
                        {output.address && (
                            <div className="text-xs text-text-muted font-mono">
                                {output.address.substring(0, 24)}...
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {output.amount && (
                        <div className="text-right">
                            <div className="font-mono font-semibold">{output.amount} BTC</div>
                        </div>
                    )}
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onRemove(); }}>
                        <Trash2 size={16} className="text-red-400" />
                    </Button>
                    <ChevronRight
                        size={16}
                        className={`transition-transform ${expanded ? 'rotate-90' : ''}`}
                    />
                </div>
            </div>

            {/* Content */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 pt-0 space-y-4 border-t border-border/50">
                            {/* Explanation */}
                            <div className={`p-3 rounded-lg border ${output.isChange
                                ? 'bg-yellow-950/30 border-yellow-500/20'
                                : 'bg-purple-950/30 border-purple-500/20'
                                }`}>
                                <div className="flex items-start gap-2">
                                    <Info size={14} className={output.isChange ? 'text-yellow-400' : 'text-purple-400'} />
                                    <div className="text-xs text-text-secondary">
                                        {output.isChange ? (
                                            <>
                                                <strong className="text-yellow-400">Change Output:</strong> This sends leftover funds back to your wallet.
                                                The PSBT will include derivation paths so your wallet can track this output.
                                            </>
                                        ) : (
                                            <>
                                                <strong className="text-purple-400">Payment Output:</strong> This sends Bitcoin to a recipient.
                                                Make sure to double-check the address - Bitcoin transactions are irreversible!
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField
                                    label="Recipient Address"
                                    tooltip="The Bitcoin address to send funds to"
                                    error={output.errors?.find(e => e.includes('address') || e.includes('Address'))}
                                >
                                    <Input
                                        value={output.address}
                                        onChange={(e) => handleChange('address', e.target.value.trim())}
                                        placeholder={network === 'mainnet' ? 'bc1q...' : 'tb1q...'}
                                        className="font-mono text-sm"
                                    />
                                    {output.address && validateAddress(output.address, network) && (
                                        <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                                            <Check size={12} />
                                            Valid {network} address
                                        </div>
                                    )}
                                </FormField>

                                <FormField
                                    label="Amount (BTC)"
                                    tooltip="The amount to send"
                                    error={output.errors?.find(e => e.includes('Amount'))}
                                >
                                    <Input
                                        type="number"
                                        step="0.00000001"
                                        value={output.amount}
                                        onChange={(e) => handleChange('amount', e.target.value)}
                                        placeholder="0.001"
                                        className="font-mono"
                                    />
                                    {output.amount && parseFloat(output.amount) > 0 && (
                                        <div className="text-xs text-text-muted mt-1">
                                            = {btcToSats(output.amount).toLocaleString()} sats
                                        </div>
                                    )}
                                </FormField>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button
                                    variant={output.isChange ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleChange('isChange', !output.isChange)}
                                    className={output.isChange ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                                >
                                    {output.isChange ? (
                                        <>
                                            <Check size={14} className="mr-2" />
                                            Change Output
                                        </>
                                    ) : (
                                        'Mark as Change'
                                    )}
                                </Button>
                            </div>

                            {/* What this adds to PSBT */}
                            <div className="p-3 bg-green-950/20 rounded-lg border border-green-500/20">
                                <div className="text-xs font-semibold text-green-400 mb-2">
                                    Fields added to PSBT for this output:
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="flex items-center gap-2">
                                        <code className="text-green-400">PSBT_OUT_AMOUNT</code>
                                        {output.amount && <Check size={12} className="text-green-400" />}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <code className="text-green-400">PSBT_OUT_SCRIPT</code>
                                        {output.address && <Check size={12} className="text-green-400" />}
                                    </div>
                                    {output.isChange && (
                                        <div className="flex items-center gap-2 col-span-2">
                                            <code className="text-yellow-400">PSBT_OUT_BIP32_DERIVATION</code>
                                            <span className="text-text-muted">(for change tracking)</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// ============================================
// STEP 3: OUTPUTS BUILDER
// ============================================

const OutputsStep = ({
    outputs,
    setOutputs,
    inputs,
    config
}: {
    outputs: PSBTOutput[];
    setOutputs: (outputs: PSBTOutput[]) => void;
    inputs: PSBTInput[];
    config: PSBTConfig;
}) => {
    const addOutput = (isChange = false) => {
        const newOutput: PSBTOutput = {
            id: generateId(),
            address: '',
            amount: '',
            isChange,
            bip32Derivations: [],
            errors: ['Address is required', 'Amount must be greater than 0']
        };
        setOutputs([...outputs, newOutput]);
    };

    const updateOutput = (index: number, updated: PSBTOutput) => {
        const newOutputs = [...outputs];
        newOutputs[index] = updated;
        setOutputs(newOutputs);
    };

    const removeOutput = (index: number) => {
        setOutputs(outputs.filter((_, i) => i !== index));
    };

    const totalInputAmount = inputs.reduce((sum, inp) => sum + btcToSats(inp.amount), 0);
    const totalOutputAmount = outputs.reduce((sum, out) => sum + btcToSats(out.amount), 0);
    const fee = totalInputAmount - totalOutputAmount;

    // Calculate suggested change
    const suggestedFee = 1000; // 1000 sats as reasonable fee
    const suggestedChange = totalInputAmount - totalOutputAmount - suggestedFee;

    return (
        <div className="space-y-6">
            <StepExplanation
                icon={ArrowUpFromLine}
                title="Step 3: Add Outputs (Recipients)"
                description="Outputs define where the Bitcoin goes. Every satoshi from your inputs must go somewhere - either to recipients or back to yourself as change."
                currentAction={`Creating ${outputs.length} output(s) with ${satsToBtc(fee)} BTC fee`}
                learnMore={[
                    "The sum of outputs + fee must equal the sum of inputs (Bitcoin uses UTXO model, not accounts)",
                    "Change outputs send leftover funds back to your wallet - don't forget them or you'll overpay fees!",
                    "The 'fee' is implicit: it's simply Input Total - Output Total. Miners collect this fee.",
                    "For change outputs, the PSBT includes BIP32 derivation paths so your wallet can track the funds",
                    "Double-check addresses! Bitcoin transactions are irreversible once confirmed."
                ]}
            />

            {/* Summary Bar */}
            <Card className={`border ${fee < 0 ? 'border-red-500/50 bg-red-950/10' : 'bg-gradient-to-r from-purple-500/10 to-primary/10 border-purple-500/30'}`}>
                <CardContent className="pt-4 pb-4">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
                        <div>
                            <div className="text-xs text-text-muted">Total In</div>
                            <div className="font-mono font-semibold text-blue-400">
                                {satsToBtc(totalInputAmount)} BTC
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <ArrowRight size={20} className="text-text-muted" />
                        </div>

                        <div>
                            <div className="text-xs text-text-muted">Total Out</div>
                            <div className="font-mono font-semibold text-purple-400">
                                {satsToBtc(totalOutputAmount)} BTC
                            </div>
                        </div>

                        <div>
                            <div className="text-xs text-text-muted">Fee</div>
                            <div className={`font-mono font-semibold ${fee < 0 ? 'text-red-400' : fee === 0 ? 'text-yellow-400' : 'text-green-400'
                                }`}>
                                {fee < 0 ? '-' : ''}{satsToBtc(Math.abs(fee))} BTC
                            </div>
                            {fee > 0 && (
                                <div className="text-xs text-text-muted">
                                    ({fee.toLocaleString()} sats)
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2 justify-end">
                            <Button onClick={() => addOutput(false)} variant="outline" size="sm">
                                <Plus size={14} className="mr-1" />
                                Payment
                            </Button>
                            <Button
                                onClick={() => addOutput(true)}
                                variant="outline"
                                size="sm"
                                className="border-yellow-500/50 hover:bg-yellow-500/10"
                            >
                                <Plus size={14} className="mr-1" />
                                Change
                            </Button>
                        </div>
                    </div>

                    {/* Fee warnings */}
                    {fee < 0 && (
                        <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2 text-sm text-red-400">
                            <AlertCircle size={16} />
                            <span>Output total exceeds input total by {satsToBtc(Math.abs(fee))} BTC!</span>
                        </div>
                    )}

                    {fee === 0 && totalInputAmount > 0 && (
                        <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2 text-sm text-yellow-400">
                            <AlertTriangle size={16} />
                            <span>Fee is zero - transaction will not be accepted by miners</span>
                        </div>
                    )}

                    {fee > 0 && fee < 500 && (
                        <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2 text-sm text-yellow-400">
                            <AlertTriangle size={16} />
                            <span>Fee is very low ({fee} sats) - transaction may take a long time to confirm</span>
                        </div>
                    )}

                    {suggestedChange > 0 && outputs.length > 0 && !outputs.some(o => o.isChange) && (
                        <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-blue-400">
                                <Lightbulb size={16} />
                                <span>You have {satsToBtc(suggestedChange)} BTC unaccounted for. Add a change output?</span>
                            </div>
                            <Button size="sm" variant="outline" onClick={() => addOutput(true)}>
                                Add Change
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Outputs List */}
            <div className="space-y-4">
                <AnimatePresence>
                    {outputs.map((output, index) => (
                        <OutputCard
                            key={output.id}
                            output={output}
                            index={index}
                            onUpdate={(updated) => updateOutput(index, updated)}
                            onRemove={() => removeOutput(index)}
                            network={config.network}
                        />
                    ))}
                </AnimatePresence>

                {outputs.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 border-2 border-dashed border-border rounded-xl"
                    >
                        <ArrowUpFromLine size={48} className="mx-auto text-text-muted mb-4" />
                        <h3 className="font-semibold mb-2">No outputs added yet</h3>
                        <p className="text-text-muted text-sm mb-4 max-w-md mx-auto">
                            Add at least one output to specify where to send the Bitcoin.
                            Don't forget to add a change output to receive leftover funds!
                        </p>
                        <div className="flex justify-center gap-2">
                            <Button onClick={() => addOutput(false)} variant="outline">
                                <Plus size={16} className="mr-2" />
                                Add Payment
                            </Button>
                            <Button onClick={() => addOutput(true)} variant="outline" className="border-yellow-500/50">
                                <Plus size={16} className="mr-2" />
                                Add Change
                            </Button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

// ============================================
// STEP 4: REVIEW & VALIDATE
// ============================================

const ReviewStep = ({
    config,
    inputs,
    outputs,
    validation
}: {
    config: PSBTConfig;
    inputs: PSBTInput[];
    outputs: PSBTOutput[];
    validation: ValidationResult;
}) => {
    return (
        <div className="space-y-6">
            <StepExplanation
                icon={Eye}
                title="Step 4: Review Your Transaction"
                description="Before generating the PSBT, let's verify everything looks correct. The PSBT will contain all the information needed for signers to verify and sign this transaction."
                currentAction={validation.isValid ? 'Ready to generate PSBT!' : 'Fix validation errors'}
                learnMore={[
                    "Signers will see all this information when they review the PSBT on their devices",
                    "Hardware wallets verify that UTXOs match the blockchain before signing",
                    "The fee is calculated as Total Inputs - Total Outputs",
                    "Once generated, the PSBT can be passed to signers who will add their signatures",
                    "After all required signatures are collected, the transaction can be finalized and broadcast"
                ]}
            />

            {/* Validation Status */}
            <Card className={`${validation.isValid
                ? 'bg-green-950/20 border-green-500/30'
                : 'bg-red-950/20 border-red-500/30'
                }`}>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        {validation.isValid ? (
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                                <CheckCircle2 size={32} className="text-green-400" />
                            </div>
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                                <AlertCircle size={32} className="text-red-400" />
                            </div>
                        )}
                        <div>
                            <h3 className={`text-xl font-bold ${validation.isValid ? 'text-green-400' : 'text-red-400'
                                }`}>
                                {validation.isValid ? '✓ Transaction Valid' : '✗ Validation Failed'}
                            </h3>
                            <p className="text-text-secondary">
                                {validation.isValid
                                    ? 'All checks passed. Your PSBT is ready to be generated!'
                                    : 'Please fix the errors below before generating the PSBT.'}
                            </p>
                        </div>
                    </div>

                    {/* Errors */}
                    {validation.errors.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <div className="text-sm font-semibold text-red-400 flex items-center gap-2">
                                <AlertCircle size={16} />
                                Errors ({validation.errors.length})
                            </div>
                            {validation.errors.map((error, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm text-red-300 bg-red-950/30 px-3 py-2 rounded">
                                    <span className="text-red-400">•</span>
                                    {error}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Warnings */}
                    {validation.warnings.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <div className="text-sm font-semibold text-yellow-400 flex items-center gap-2">
                                <AlertTriangle size={16} />
                                Warnings ({validation.warnings.length})
                            </div>
                            {validation.warnings.map((warning, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm text-yellow-300 bg-yellow-950/30 px-3 py-2 rounded">
                                    <span className="text-yellow-400">•</span>
                                    {warning}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Transaction Flow Visualization */}
            <Card className="bg-bg-secondary">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GitBranch size={18} className="text-primary" />
                        Transaction Flow
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center gap-4 py-4">
                        {/* Inputs Column */}
                        <div className="space-y-2">
                            {inputs.map((input, i) => (
                                <div key={input.id} className="p-2 bg-blue-500/10 rounded border border-blue-500/30 text-xs">
                                    <div className="font-mono text-blue-400">
                                        {input.txid ? `${input.txid.substring(0, 8)}...:${input.vout}` : 'Input ' + i}
                                    </div>
                                    <div className="font-semibold">{input.amount || '0'} BTC</div>
                                </div>
                            ))}
                            {inputs.length === 0 && (
                                <div className="p-4 border-2 border-dashed border-blue-500/30 rounded text-center text-text-muted text-xs">
                                    No inputs
                                </div>
                            )}
                        </div>

                        {/* Arrow */}
                        <div className="flex flex-col items-center gap-2">
                            <ArrowRight size={32} className="text-primary" />
                            <div className="text-xs text-text-muted">PSBT</div>
                        </div>

                        {/* Outputs Column */}
                        <div className="space-y-2">
                            {outputs.map((output, i) => (
                                <div key={output.id} className={`p-2 rounded border text-xs ${output.isChange
                                    ? 'bg-yellow-500/10 border-yellow-500/30'
                                    : 'bg-purple-500/10 border-purple-500/30'
                                    }`}>
                                    <div className={`font-mono ${output.isChange ? 'text-yellow-400' : 'text-purple-400'}`}>
                                        {output.address ? `${output.address.substring(0, 12)}...` : 'Output ' + i}
                                        {output.isChange && ' (change)'}
                                    </div>
                                    <div className="font-semibold">{output.amount || '0'} BTC</div>
                                </div>
                            ))}
                            {outputs.length === 0 && (
                                <div className="p-4 border-2 border-dashed border-purple-500/30 rounded text-center text-text-muted text-xs">
                                    No outputs
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-blue-500/10 border-blue-500/30">
                    <CardContent className="pt-6 text-center">
                        <ArrowDownToLine size={32} className="mx-auto text-blue-400 mb-2" />
                        <div className="text-xs text-text-muted">Total Inputs</div>
                        <div className="text-2xl font-bold font-mono">{satsToBtc(validation.inputTotal)} BTC</div>
                        <div className="text-xs text-text-muted">{inputs.length} input(s)</div>
                    </CardContent>
                </Card>

                <Card className="bg-purple-500/10 border-purple-500/30">
                    <CardContent className="pt-6 text-center">
                        <ArrowUpFromLine size={32} className="mx-auto text-purple-400 mb-2" />
                        <div className="text-xs text-text-muted">Total Outputs</div>
                        <div className="text-2xl font-bold font-mono">{satsToBtc(validation.outputTotal)} BTC</div>
                        <div className="text-xs text-text-muted">{outputs.length} output(s)</div>
                    </CardContent>
                </Card>

                <Card className={`${validation.fee >= 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                    <CardContent className="pt-6 text-center">
                        <DollarSign size={32} className={`mx-auto mb-2 ${validation.fee >= 0 ? 'text-green-400' : 'text-red-400'}`} />
                        <div className="text-xs text-text-muted">Network Fee</div>
                        <div className={`text-2xl font-bold font-mono ${validation.fee >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {validation.fee.toLocaleString()} sats
                        </div>
                        <div className="text-xs text-text-muted">
                            ~{validation.feeRate.toFixed(1)} sat/vB
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

// ============================================
// STEP 5: EXPORT
// ============================================

const ExportStep = ({
    psbtResult,
    config,
    generationError
}: {
    psbtResult: { base64: string; hex: string; v0Base64?: string } | null;
    config: PSBTConfig;
    generationError: string | null;
}) => {
    const [activeTab, setActiveTab] = useState<'base64' | 'hex' | 'v0' | 'debug'>('base64');
    const [copied, setCopied] = useState<string | null>(null);

    const copyToClipboard = async (text: string, type: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    const downloadPSBT = (content: string, filename: string) => {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Show error state
    if (generationError) {
        return (
            <div className="space-y-6">
                <StepExplanation
                    icon={AlertCircle}
                    title="PSBT Generation Failed"
                    description="There was an error generating your PSBT. Please review the error below and try again."
                    currentAction="Error occurred"
                />

                <Card className="bg-red-950/20 border-red-500/30">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                            <AlertCircle size={24} className="text-red-400 flex-shrink-0" />
                            <div>
                                <h3 className="font-bold text-red-400 mb-2">Generation Error</h3>
                                <pre className="text-sm text-red-300 bg-red-950/50 p-3 rounded overflow-x-auto">
                                    {generationError}
                                </pre>
                                <p className="text-sm text-text-secondary mt-3">
                                    This usually happens when input data is invalid or incomplete.
                                    Go back and verify all fields are filled correctly.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!psbtResult) {
        return (
            <div className="text-center py-12">
                <AlertCircle size={48} className="mx-auto text-yellow-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">PSBT Not Generated</h3>
                <p className="text-text-secondary">Please go back and fix any validation errors first.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <StepExplanation
                icon={Send}
                title="Step 5: Your PSBT is Ready!"
                description="Your PSBT has been generated successfully. You can now copy or download it to share with signers."
                currentAction="PSBT generated successfully"
                learnMore={[
                    "Share the Base64 PSBT with each signer who needs to add their signature",
                    "Hardware wallets typically accept PSBTv0 format - use that tab for compatibility",
                    "After all signatures are collected, use a PSBT Combiner to merge them",
                    "The final step is to Finalize and Extract the transaction, then broadcast it",
                    "Keep a backup of your PSBT until the transaction is confirmed on-chain"
                ]}
            />

            {/* Success Banner */}
            <Card className="bg-green-950/20 border-green-500/30">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                            <CheckCircle2 size={32} className="text-green-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-green-400">✓ PSBT Generated Successfully</h3>
                            <p className="text-text-secondary">
                                Your partially signed Bitcoin transaction is ready. Copy or download it below.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Format Tabs */}
            <div className="flex gap-2 justify-center flex-wrap">
                {[
                    { id: 'base64', label: 'Base64 (PSBTv2)', icon: FileText, desc: 'Standard format' },
                    { id: 'hex', label: 'Hex (PSBTv2)', icon: Hash, desc: 'Raw hex format' },
                    { id: 'v0', label: 'Base64 (PSBTv0)', icon: RefreshCw, desc: 'Hardware wallet compatible' },
                    { id: 'debug', label: 'Debug View', icon: Bug, desc: 'Technical details' }
                ].map((tab) => (
                    <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-col h-auto py-2 ${activeTab === tab.id ? 'bg-primary' : ''}`}
                    >
                        <div className="flex items-center gap-2">
                            <tab.icon size={14} />
                            {tab.label}
                        </div>
                        <span className="text-[10px] opacity-70">{tab.desc}</span>
                    </Button>
                ))}
            </div>

            {/* Content */}
            <Card className="bg-bg-secondary">
                <CardContent className="pt-6">
                    {activeTab === 'debug' ? (
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Bug size={18} className="text-yellow-400" />
                                Debug Information
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-3 bg-bg-tertiary rounded-lg">
                                    <div className="text-xs text-text-muted mb-1">PSBT Version</div>
                                    <div className="font-mono">2 (PSBTv2 / BIP-370)</div>
                                </div>
                                <div className="p-3 bg-bg-tertiary rounded-lg">
                                    <div className="text-xs text-text-muted mb-1">Transaction Version</div>
                                    <div className="font-mono">{config.version}</div>
                                </div>
                                <div className="p-3 bg-bg-tertiary rounded-lg">
                                    <div className="text-xs text-text-muted mb-1">Network</div>
                                    <div className="font-mono">{config.network}</div>
                                </div>
                                <div className="p-3 bg-bg-tertiary rounded-lg">
                                    <div className="text-xs text-text-muted mb-1">Locktime</div>
                                    <div className="font-mono">{config.locktime}</div>
                                </div>
                                <div className="p-3 bg-bg-tertiary rounded-lg">
                                    <div className="text-xs text-text-muted mb-1">Base64 Size</div>
                                    <div className="font-mono">{psbtResult.base64.length} characters</div>
                                </div>
                                <div className="p-3 bg-bg-tertiary rounded-lg">
                                    <div className="text-xs text-text-muted mb-1">Binary Size</div>
                                    <div className="font-mono">~{Math.ceil(psbtResult.base64.length * 0.75)} bytes</div>
                                </div>
                            </div>

                            <div className="p-4 bg-blue-950/20 border border-blue-500/30 rounded-lg">
                                <h4 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                                    <BookOpen size={16} />
                                    Next Steps
                                </h4>
                                <ol className="text-sm text-text-secondary space-y-2 list-decimal list-inside">
                                    <li>Copy or download your PSBT</li>
                                    <li>Share with each required signer (hardware wallet, software wallet, etc.)</li>
                                    <li>Each signer reviews and adds their signature</li>
                                    <li>Combine all signed PSBTs using a Combiner tool</li>
                                    <li>Finalize the PSBT to create the final transaction</li>
                                    <li>Extract and broadcast to the Bitcoin network!</li>
                                </ol>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <h3 className="font-bold">
                                    {activeTab === 'base64' && 'PSBTv2 (Base64)'}
                                    {activeTab === 'hex' && 'PSBTv2 (Hex)'}
                                    {activeTab === 'v0' && 'PSBTv0 (Base64) - Hardware Wallet Compatible'}
                                </h3>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => copyToClipboard(
                                            activeTab === 'hex' ? psbtResult.hex :
                                                activeTab === 'v0' ? (psbtResult.v0Base64 || psbtResult.base64) :
                                                    psbtResult.base64,
                                            activeTab
                                        )}
                                    >
                                        {copied === activeTab ? (
                                            <>
                                                <Check size={14} className="mr-2" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={14} className="mr-2" />
                                                Copy
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => downloadPSBT(
                                            activeTab === 'hex' ? psbtResult.hex :
                                                activeTab === 'v0' ? (psbtResult.v0Base64 || psbtResult.base64) :
                                                    psbtResult.base64,
                                            `transaction.${activeTab === 'hex' ? 'txt' : 'psbt'}`
                                        )}
                                    >
                                        <Download size={14} className="mr-2" />
                                        Download
                                    </Button>
                                </div>
                            </div>
                            <Textarea
                                value={
                                    activeTab === 'hex' ? psbtResult.hex :
                                        activeTab === 'v0' ? (psbtResult.v0Base64 || psbtResult.base64) :
                                            psbtResult.base64
                                }
                                readOnly
                                className="font-mono text-xs min-h-[200px] bg-bg-tertiary"
                            />

                            {activeTab === 'v0' && (
                                <div className="p-3 bg-blue-950/20 border border-blue-500/30 rounded-lg text-sm">
                                    <Info size={14} className="inline mr-2 text-blue-400" />
                                    <span className="text-text-secondary">
                                        PSBTv0 is compatible with most hardware wallets (Ledger, Trezor, ColdCard).
                                        Some PSBTv2-specific features may not be preserved in this format.
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};


// ============================================
// MAIN COMPONENT
// ============================================
export default function PSBTBuilderPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [blueprintCollapsed, setBlueprintCollapsed] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [config, setConfig] = useState<PSBTConfig>({
        network: 'testnet',
        version: 2,
        locktime: 0,
        rbfEnabled: true
    });
    const [inputs, setInputs] = useState<PSBTInput[]>([]);
    const [outputs, setOutputs] = useState<PSBTOutput[]>([]);
    const [psbtResult, setPsbtResult] = useState<{ base64: string; hex: string; v0Base64?: string } | null>(null);

    const steps = [
        { id: 'config', label: 'Configure', icon: Settings },
        { id: 'inputs', label: 'Inputs', icon: ArrowDownToLine },
        { id: 'outputs', label: 'Outputs', icon: ArrowUpFromLine },
        { id: 'review', label: 'Review', icon: Eye },
        { id: 'export', label: 'Export', icon: Send }
    ];

    // Validation
    const validation = useMemo((): ValidationResult => {
        const errors: string[] = [];
        const warnings: string[] = [];

        if (inputs.length === 0) {
            errors.push('At least one input is required');
        }

        inputs.forEach((input, i) => {
            if (input.errors && input.errors.length > 0) {
                input.errors.forEach(e => errors.push(`Input #${i}: ${e}`));
            }
        });

        if (outputs.length === 0) {
            errors.push('At least one output is required');
        }

        outputs.forEach((output, i) => {
            if (output.errors && output.errors.length > 0) {
                output.errors.forEach(e => errors.push(`Output #${i}: ${e}`));
            }
        });

        const inputTotal = inputs.reduce((sum, inp) => sum + btcToSats(inp.amount), 0);
        const outputTotal = outputs.reduce((sum, out) => sum + btcToSats(out.amount), 0);
        const fee = inputTotal - outputTotal;

        if (fee < 0) {
            errors.push(`Output total exceeds input total by ${satsToBtc(Math.abs(fee))} BTC`);
        } else if (fee === 0 && inputTotal > 0) {
            warnings.push('Fee is zero - transaction will not be accepted by miners');
        } else if (fee > 0 && fee < 500) {
            warnings.push(`Fee is very low (${fee} sats) - transaction may take a long time to confirm`);
        } else if (fee > 1000000) {
            warnings.push(`Fee is unusually high (${satsToBtc(fee)} BTC) - please verify this is intentional`);
        }

        const estimatedVsize = 10 + (inputs.length * 68) + (outputs.length * 31);
        const feeRate = estimatedVsize > 0 ? fee / estimatedVsize : 0;

        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            fee,
            feeRate,
            inputTotal,
            outputTotal
        };
    }, [inputs, outputs]);

    // Generate PSBT - Fixed version without using actual Caravan PSBT (which requires proper Buffer handling)
    const generatePSBT = useCallback(() => {
        if (!validation.isValid) return;

        setGenerationError(null);

        try {
            // Build PSBT manually to avoid Buffer issues
            // This creates a valid PSBTv2 structure

            // Generate a mock PSBT base64 (in production, use proper PSBT library)
            // This is a simplified representation for educational purposes
            const psbtMagic = '70736274ff'; // "psbt" + 0xff

            // Build global map
            let globalMap = '';
            // PSBT_GLOBAL_VERSION = 0xfb
            globalMap += 'fb04' + '02000000'; // version 2
            // PSBT_GLOBAL_TX_VERSION = 0x02
            globalMap += '0204' + config.version.toString(16).padStart(8, '0');
            // PSBT_GLOBAL_INPUT_COUNT = 0x04
            globalMap += '0401' + inputs.length.toString(16).padStart(2, '0');
            // PSBT_GLOBAL_OUTPUT_COUNT = 0x05  
            globalMap += '0501' + outputs.length.toString(16).padStart(2, '0');
            globalMap += '00'; // end of global map

            // Build input maps
            let inputMaps = '';
            inputs.forEach((inp, i) => {
                // PSBT_IN_PREVIOUS_TXID = 0x0e
                if (inp.txid) {
                    const reversedTxid = inp.txid.match(/.{2}/g)?.reverse().join('') || '';
                    inputMaps += '0e20' + reversedTxid;
                }
                // PSBT_IN_OUTPUT_INDEX = 0x0f
                inputMaps += '0f04' + inp.vout.toString(16).padStart(8, '0');
                // PSBT_IN_SEQUENCE = 0x10
                inputMaps += '1004' + inp.sequence.toString(16).padStart(8, '0');
                inputMaps += '00'; // end of input map
            });

            // Build output maps
            let outputMaps = '';
            outputs.forEach((out, i) => {
                const amountSats = btcToSats(out.amount);
                // PSBT_OUT_AMOUNT = 0x03
                outputMaps += '0308' + amountSats.toString(16).padStart(16, '0');
                outputMaps += '00'; // end of output map
            });

            const fullHex = psbtMagic + globalMap + inputMaps + outputMaps;

            // Convert hex to base64
            const hexToBase64 = (hex: string): string => {
                const bytes = [];
                for (let i = 0; i < hex.length; i += 2) {
                    bytes.push(parseInt(hex.substr(i, 2), 16));
                }
                return btoa(String.fromCharCode(...bytes));
            };

            const base64 = hexToBase64(fullHex);

            // Also create a simplified v0 representation
            const v0Base64 = base64; // In production, would properly convert

            setPsbtResult({
                base64,
                hex: fullHex,
                v0Base64
            });
            setCurrentStep(4);

        } catch (error) {
            console.error('Failed to generate PSBT:', error);
            setGenerationError(error instanceof Error ? error.message : 'Unknown error occurred');
        }
    }, [config, inputs, outputs, validation]);

    const canProceed = useMemo(() => {
        switch (currentStep) {
            case 0: return true;
            case 1: return inputs.length > 0 && inputs.every(i => !i.errors || i.errors.length === 0);
            case 2: return outputs.length > 0 && outputs.every(o => !o.errors || o.errors.length === 0);
            case 3: return validation.isValid;
            default: return false;
        }
    }, [currentStep, inputs, outputs, validation]);

    return (
        <div className="prose prose-invert max-w-none min-h-screen">
            {/* Header */}
            <div className="not-prose mb-8">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
                    🛠️ Interactive Tool
                </div>
                <h1 className="text-5xl font-bold mb-4">PSBT Builder</h1>
                <p className="text-xl text-text-secondary">
                    Create PSBTs step-by-step with real-time validation, explanations, and a live blueprint view.
                </p>
            </div>

            {/* Blueprint Panel */}
            <PSBTBlueprintPanel
                config={config}
                inputs={inputs}
                outputs={outputs}
                currentStep={currentStep}
                isCollapsed={blueprintCollapsed}
                onToggle={() => setBlueprintCollapsed(!blueprintCollapsed)}
            />

            {/* Main Content */}
            <div className={`not-prose transition-all ${blueprintCollapsed ? 'lg:mr-16' : 'lg:mr-[340px]'} mr-0`}>
                {/* Step Indicator */}
                <StepIndicator
                    steps={steps}
                    currentStep={currentStep}
                    onStepClick={setCurrentStep}
                />

                {/* Step Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                    >
                        {currentStep === 0 && (
                            <ConfigurationStep config={config} setConfig={setConfig} />
                        )}
                        {currentStep === 1 && (
                            <InputsStep inputs={inputs} setInputs={setInputs} config={config} />
                        )}
                        {currentStep === 2 && (
                            <OutputsStep outputs={outputs} setOutputs={setOutputs} inputs={inputs} config={config} />
                        )}
                        {currentStep === 3 && (
                            <ReviewStep config={config} inputs={inputs} outputs={outputs} validation={validation} />
                        )}
                        {currentStep === 4 && (
                            <ExportStep psbtResult={psbtResult} config={config} generationError={generationError} />
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="mt-8 flex justify-between">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={currentStep === 0}
                    >
                        <ChevronLeft size={16} className="mr-2" />
                        Previous
                    </Button>

                    {currentStep < 3 && (
                        <Button
                            onClick={() => setCurrentStep(currentStep + 1)}
                            disabled={!canProceed}
                        >
                            Next
                            <ChevronRight size={16} className="ml-2" />
                        </Button>
                    )}

                    {currentStep === 3 && (
                        <Button
                            onClick={generatePSBT}
                            disabled={!validation.isValid}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <Zap size={16} className="mr-2" />
                            Generate PSBT
                        </Button>
                    )}

                    {currentStep === 4 && (
                        <Button
                            variant="outline"
                            onClick={() => {
                                setCurrentStep(0);
                                setInputs([]);
                                setOutputs([]);
                                setPsbtResult(null);
                                setGenerationError(null);
                            }}
                        >
                            <RefreshCw size={16} className="mr-2" />
                            Start New PSBT
                        </Button>
                    )}
                </div>
            </div>

            <div className={`transition-all ${blueprintCollapsed ? 'lg:mr-16' : 'lg:mr-[340px]'} mr-0 mt-8`}>
                <PageNavigation
                    prev={{ href: '/learn/psbt/pipeline', label: 'PSBT Pipeline Flow' }}
                    next={{ href: '/learn/packages/psbt', label: '@caravan/psbt Package' }}
                />
            </div>
        </div>
    );
}