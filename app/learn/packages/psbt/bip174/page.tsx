/* eslint-disable @typescript-eslint/no-explicit-any */
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
import * as CaravanPSBT from '@caravan/psbt';
import * as CaravanBitcoin from '@caravan/bitcoin'
import { Psbt, networks } from 'bitcoinjs-lib';
import { Buffer } from 'buffer';
import {
    RefreshCw,
    ChevronDown,
    ChevronRight,
    FileText,
    Globe,
    ArrowDownToLine,
    ArrowUpFromLine,
    Key,
    Hash,
    Lock,
    Binary,
    Layers,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Clock,
    Users,
    Shield,
    Sparkles,
    Info,
    ExternalLink,
    Calendar,
    Zap,
    Eye,
    Code,
    Network,
    ArrowRight,
    GitBranch
} from 'lucide-react';

// Hand-drawn underline component
const DoodleUnderline = ({ className = "" }: { className?: string }) => (
    <svg
        viewBox="0 0 200 20"
        className={`w-full h-3 absolute -bottom-2 left-0 ${className}`}
        fill="none"
    >
        <motion.path
            d="M 5 10 Q 50 5, 100 10 T 195 10"
            stroke="#22C55E"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
        />
    </svg>
);

// Timeline Component
const PSBTTimeline = () => {
    const events = [
        {
            year: '2009-2016',
            title: 'The Dark Ages',
            desc: 'No standard format for coordinating multi-party transactions',
            icon: XCircle,
            color: 'red'
        },
        {
            year: '2017',
            title: 'BIP-174 Proposed',
            desc: 'Andrew Chow introduces PSBT specification',
            icon: Sparkles,
            color: 'yellow'
        },
        {
            year: '2018',
            title: 'Bitcoin Core 0.17',
            desc: 'First major implementation of PSBT support',
            icon: CheckCircle2,
            color: 'green'
        },
        {
            year: '2019-2020',
            title: 'Industry Adoption',
            desc: 'Hardware wallets and major software adopt PSBT',
            icon: Users,
            color: 'blue'
        },
        {
            year: '2020',
            title: 'BIP-370 (PSBTv2)',
            desc: 'Enhanced format with dynamic construction',
            icon: Zap,
            color: 'purple'
        }
    ];

    return (
        <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 via-green-500 to-purple-500" />

            <div className="space-y-8">
                {events.map((event, i) => {
                    const Icon = event.icon;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="relative pl-20"
                        >
                            <div className={`absolute left-0 w-16 h-16 rounded-full bg-${event.color}-500/20 border-2 border-${event.color}-500 flex items-center justify-center`}>
                                <Icon className={`w-8 h-8 text-${event.color}-400`} />
                            </div>
                            <Card className={`bg-gradient-to-br from-${event.color}-500/10 to-${event.color}-500/5 border-${event.color}-500/30`}>
                                <CardContent className="pt-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calendar className="w-4 h-4 text-text-muted" />
                                        <span className="text-sm font-mono text-text-muted">{event.year}</span>
                                    </div>
                                    <h4 className={`text-lg font-bold text-${event.color}-400 mb-1`}>{event.title}</h4>
                                    <p className="text-sm text-text-secondary">{event.desc}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// Pre-PSBT Problems Visual
const PrePSBTProblemsVisual = () => {
    const [selectedProblem, setSelectedProblem] = useState(0);

    const problems = [
        {
            title: 'Private Key Exposure Risk',
            icon: AlertTriangle,
            color: 'red',
            scenario: 'Alice wants to create a 2-of-3 multisig transaction',
            problem: 'She needs signatures from Bob and Carol',
            oldWay: [
                'Alice creates unsigned transaction',
                'Alice sends her private key to Bob 😱',
                'Bob signs and sends key to Carol 😱',
                'Carol signs with all three keys 😱😱😱'
            ],
            why: 'Sharing private keys defeats the entire purpose of multisig security!'
        },
        {
            title: 'Coordination Nightmare',
            icon: XCircle,
            color: 'orange',
            scenario: 'Hardware wallet needs to sign transaction',
            problem: 'No standard format for transaction metadata',
            oldWay: [
                'Extract transaction hex manually',
                'Calculate UTXO amounts yourself',
                'Find derivation paths somehow',
                'Hope the hardware wallet understands your custom format',
                'Debug when it inevitably fails'
            ],
            why: 'Every wallet had its own proprietary format, making interoperability impossible!'
        },
        {
            title: 'Fee Bumping Impossible',
            icon: Clock,
            color: 'yellow',
            scenario: 'Transaction stuck with low fee',
            problem: 'Need to increase fee but already partially signed',
            oldWay: [
                'Transaction partially signed by some parties',
                'Fee too low, stuck in mempool',
                'Cannot modify - would invalidate signatures',
                'Must wait or create entirely new transaction',
                'Lose coordination progress'
            ],
            why: 'No way to modify a transaction after some signatures were collected!'
        },
        {
            title: 'Trust Required',
            icon: Shield,
            color: 'purple',
            scenario: 'Multi-party transaction (e.g., CoinJoin)',
            problem: 'Need to trust a coordinator with sensitive data',
            oldWay: [
                'Send all transaction details to coordinator',
                'Coordinator builds full transaction',
                'Hope coordinator is honest',
                'Hope coordinator\'s server isn\'t compromised',
                'No way to verify before signing'
            ],
            why: 'Centralized coordinators became single points of failure and trust!'
        }
    ];

    const current = problems[selectedProblem];
    const Icon = current.icon;

    return (
        <div className="space-y-6">
            {/* Problem Selector */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {problems.map((problem, i) => {
                    const ProblemIcon = problem.icon;
                    return (
                        <button
                            key={i}
                            onClick={() => setSelectedProblem(i)}
                            className={`
                                p-4 rounded-xl border-2 transition-all text-left
                                ${i === selectedProblem
                                    ? `border-${problem.color}-500 bg-${problem.color}-500/20 shadow-lg`
                                    : 'border-border bg-bg-tertiary hover:border-border-hover'}
                            `}
                        >
                            <ProblemIcon className={`w-6 h-6 mb-2 text-${problem.color}-400`} />
                            <div className="text-sm font-semibold text-text-primary">{problem.title}</div>
                        </button>
                    );
                })}
            </div>

            {/* Problem Details */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedProblem}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`p-6 rounded-xl border-2 bg-gradient-to-br from-${current.color}-500/10 to-${current.color}-500/5 border-${current.color}-500/30`}
                >
                    <div className="flex items-start gap-4 mb-6">
                        <div className={`w-12 h-12 rounded-full bg-${current.color}-500/20 flex items-center justify-center flex-shrink-0`}>
                            <Icon className={`w-6 h-6 text-${current.color}-400`} />
                        </div>
                        <div>
                            <h3 className={`text-xl font-bold text-${current.color}-400 mb-2`}>{current.title}</h3>
                            <div className="space-y-1 text-sm">
                                <div>
                                    <span className="text-text-muted">Scenario: </span>
                                    <span className="text-text-primary">{current.scenario}</span>
                                </div>
                                <div>
                                    <span className="text-text-muted">Problem: </span>
                                    <span className="text-text-primary">{current.problem}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-red-400" />
                            The Old Way (Pre-PSBT)
                        </h4>
                        <div className="space-y-2">
                            {current.oldWay.map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-start gap-3 p-3 bg-bg-tertiary rounded-lg"
                                >
                                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 text-xs text-red-400 font-bold">
                                        {i + 1}
                                    </div>
                                    <span className="text-sm text-text-secondary">{step}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <div className="font-semibold text-red-400 mb-1">Why This Was Terrible</div>
                                <div className="text-sm text-text-secondary">{current.why}</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// Binary Format Visualizer
const BinaryFormatVisual = () => {
    const [hoveredByte, setHoveredByte] = useState<number | null>(null);
    const [selectedSection, setSelectedSection] = useState<'magic' | 'global' | 'input' | 'output'>('magic');

    const sections = {
        magic: {
            name: 'Magic Bytes',
            color: 'purple',
            bytes: [
                { hex: '70', char: 'p', desc: 'ASCII "p" - Magic byte 1' },
                { hex: '73', char: 's', desc: 'ASCII "s" - Magic byte 2' },
                { hex: '62', char: 'b', desc: 'ASCII "b" - Magic byte 3' },
                { hex: '74', char: 't', desc: 'ASCII "t" - Magic byte 4' },
                { hex: 'ff', char: '∅', desc: 'Separator (0xFF)' },
            ],
            explanation: 'These 5 bytes identify a valid PSBT. The string "psbt" followed by 0xFF separator.'
        },
        global: {
            name: 'Global Map',
            color: 'green',
            bytes: [
                { hex: '01', char: '', desc: 'Key length: 1 byte' },
                { hex: '00', char: '', desc: 'Key type: UNSIGNED_TX' },
                { hex: 'fd', char: '', desc: 'Value length (compact size)' },
                { hex: '...', char: '', desc: 'Transaction data' },
                { hex: '00', char: '', desc: 'Map terminator' },
            ],
            explanation: 'Contains transaction-wide data like the unsigned transaction and global xpubs.'
        },
        input: {
            name: 'Input Map',
            color: 'blue',
            bytes: [
                { hex: '01', char: '', desc: 'Key length' },
                { hex: '01', char: '', desc: 'Key type: WITNESS_UTXO' },
                { hex: '...', char: '', desc: 'UTXO data' },
                { hex: '01', char: '', desc: 'Key length' },
                { hex: '02', char: '', desc: 'Key type: PARTIAL_SIG' },
                { hex: '...', char: '', desc: 'Signature data' },
                { hex: '00', char: '', desc: 'Map terminator' },
            ],
            explanation: 'One map per input. Contains signing information, UTXOs, derivation paths, and signatures.'
        },
        output: {
            name: 'Output Map',
            color: 'pink',
            bytes: [
                { hex: '01', char: '', desc: 'Key length' },
                { hex: '02', char: '', desc: 'Key type: BIP32_DERIVATION' },
                { hex: '...', char: '', desc: 'Derivation path data' },
                { hex: '00', char: '', desc: 'Map terminator' },
            ],
            explanation: 'One map per output. Contains scripts and derivation info for change detection.'
        }
    };

    const currentSection = sections[selectedSection];

    return (
        <div className="space-y-6">
            {/* Section Selector */}
            <div className="flex gap-2 justify-center flex-wrap">
                {Object.entries(sections).map(([key, section]) => (
                    <button
                        key={key}
                        onClick={() => setSelectedSection(key as any)}
                        className={`
                            px-4 py-2 rounded-lg font-medium text-sm transition-all
                            ${selectedSection === key
                                ? `bg-${section.color}-500 text-white shadow-lg`
                                : 'bg-bg-tertiary text-text-secondary hover:bg-bg-card'}
                        `}
                    >
                        {section.name}
                    </button>
                ))}
            </div>

            {/* Byte Visualization */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedSection}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                >
                    <div className="flex flex-wrap gap-2 justify-center">
                        {currentSection.bytes.map((byte, i) => (
                            <motion.div
                                key={i}
                                className="relative"
                                onMouseEnter={() => setHoveredByte(i)}
                                onMouseLeave={() => setHoveredByte(null)}
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: i * 0.05, type: 'spring' }}
                                whileHover={{ scale: 1.1, y: -4 }}
                            >
                                <div
                                    className={`
                                        w-16 h-16 rounded-xl flex flex-col items-center justify-center
                                        font-mono text-sm border-2 transition-all cursor-pointer
                                        bg-${currentSection.color}-500/20 border-${currentSection.color}-500/50
                                        hover:shadow-lg hover:shadow-${currentSection.color}-500/30
                                    `}
                                >
                                    <span className="font-bold text-base">{byte.hex}</span>
                                    {byte.char && (
                                        <span className="text-xs text-text-muted mt-0.5">{byte.char}</span>
                                    )}
                                </div>
                                <AnimatePresence>
                                    {hoveredByte === i && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 
                                                       px-3 py-2 bg-bg-card border border-border rounded-lg 
                                                       shadow-xl whitespace-nowrap z-10 text-xs max-w-xs"
                                        >
                                            {byte.desc}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>

                    <div className={`p-4 rounded-lg bg-${currentSection.color}-500/10 border border-${currentSection.color}-500/30`}>
                        <div className="flex items-start gap-3">
                            <Info className={`w-5 h-5 text-${currentSection.color}-400 flex-shrink-0 mt-0.5`} />
                            <div>
                                <div className={`font-semibold text-${currentSection.color}-400 mb-1`}>
                                    {currentSection.name} Explanation
                                </div>
                                <div className="text-sm text-text-secondary">
                                    {currentSection.explanation}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// Interactive Key-Value Explorer
const KeyValueExplorer = ({
    title,
    keyTypes,
    color
}: {
    title: string;
    keyTypes: Array<{
        type: string;
        keyHex: string;
        name: string;
        description: string;
        valueFormat: string;
        example?: string;
        required?: boolean;
    }>;
    color: string;
}) => {
    const [expanded, setExpanded] = useState<string | null>(null);

    const icons: Record<string, any> = {
        Global: Globe,
        Input: ArrowDownToLine,
        Output: ArrowUpFromLine
    };

    const Icon = icons[title] || FileText;

    return (
        <Card className={`border-2 border-${color}-500/30 bg-gradient-to-br from-${color}-500/5 to-transparent`}>
            <CardHeader className={`bg-${color}-500/10 border-b border-${color}-500/20`}>
                <CardTitle className={`flex items-center gap-3 text-${color}-400`}>
                    <div className={`w-10 h-10 rounded-lg bg-${color}-500/20 flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-xl">{title} Map</div>
                        <div className="text-sm text-text-muted font-normal">
                            {keyTypes.length} key types defined
                        </div>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="space-y-2">
                    {keyTypes.map((kt, index) => (
                        <motion.div
                            key={kt.type}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <button
                                className={`
                                    w-full p-4 rounded-lg transition-all text-left
                                    ${expanded === kt.type
                                        ? `bg-${color}-500/20 border-2 border-${color}-500/50`
                                        : 'bg-bg-tertiary hover:bg-bg-card border-2 border-transparent'}
                                `}
                                onClick={() => setExpanded(expanded === kt.type ? null : kt.type)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                        <span
                                            className={`px-3 py-1 rounded-lg font-mono text-sm font-bold bg-${color}-500/30 text-${color}-400`}
                                        >
                                            {kt.keyHex}
                                        </span>
                                        <div className="flex-1">
                                            <div className="font-semibold text-text-primary">{kt.name}</div>
                                            <div className="text-xs text-text-muted">{kt.type}</div>
                                        </div>
                                        {kt.required && (
                                            <span className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs font-semibold">
                                                Required
                                            </span>
                                        )}
                                    </div>
                                    <motion.div
                                        animate={{ rotate: expanded === kt.type ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronDown className="w-5 h-5 text-text-muted" />
                                    </motion.div>
                                </div>
                            </button>

                            <AnimatePresence>
                                {expanded === kt.type && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-4 bg-bg-tertiary rounded-b-lg border-t-0 space-y-3 mt-2">
                                            <div>
                                                <div className="text-xs text-text-muted mb-1">Description</div>
                                                <p className="text-sm text-text-secondary">{kt.description}</p>
                                            </div>

                                            <div>
                                                <div className="text-xs text-text-muted mb-1">Value Format</div>
                                                <div className={`p-2 rounded bg-${color}-500/10 font-mono text-sm text-${color}-400`}>
                                                    {kt.valueFormat}
                                                </div>
                                            </div>

                                            {kt.example && (
                                                <div>
                                                    <div className="text-xs text-text-muted mb-1">Example</div>
                                                    <div className="p-3 bg-bg-secondary rounded font-mono text-xs text-text-primary break-all border border-border">
                                                        {kt.example}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

// PSBT Lifecycle Animation
const PSBTLifecycleAnimation = () => {
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            title: "Creator",
            role: "Initializes the PSBT",
            icon: Sparkles,
            color: 'blue',
            responsibilities: [
                'Creates unsigned transaction',
                'Sets up global map with UNSIGNED_TX',
                'Initializes input and output maps',
                'May add initial xpub information'
            ],
            code: `import { Psbt } from 'bitcoinjs-lib';

// Creator builds unsigned transaction
const psbt = new Psbt({ network: bitcoin.networks.bitcoin });

// Add inputs
psbt.addInput({
  hash: previousTxId,
  index: outputIndex,
  nonWitnessUtxo: Buffer.from(previousTxHex, 'hex')
});

// Add outputs
psbt.addOutput({
  address: recipientAddress,
  value: 80000
});

// PSBT is now ready for Updater
const psbtBase64 = psbt.toBase64();`
        },
        {
            title: "Updater",
            role: "Adds signing information",
            icon: RefreshCw,
            color: 'green',
            responsibilities: [
                'Adds witness UTXO data for each input',
                'Adds BIP32 derivation paths',
                'Adds redeem scripts and witness scripts',
                'Provides all data needed for signing'
            ],
            code: `// Updater adds signing metadata
const psbt = Psbt.fromBase64(psbtBase64);

// Add witness UTXO (for SegWit inputs)
psbt.updateInput(0, {
  witnessUtxo: {
    script: Buffer.from(scriptPubKeyHex, 'hex'),
    value: 100000
  }
});

// Add BIP32 derivation path
psbt.updateInput(0, {
  bip32Derivation: [{
    masterFingerprint: Buffer.from('a1b2c3d4', 'hex'),
    path: "m/48'/0'/0'/2'/0/0",
    pubkey: publicKeyBuffer
  }]
});

// Add witness script for multisig
psbt.updateInput(0, {
  witnessScript: multisigScriptBuffer
});`
        },
        {
            title: "Signer",
            role: "Adds signatures",
            icon: Key,
            color: 'purple',
            responsibilities: [
                'Verifies all input data is correct',
                'Verifies scripts and amounts',
                'Signs inputs with private key',
                'Adds partial signature to PSBT'
            ],
            code: `// Signer verifies and signs
const psbt = Psbt.fromBase64(psbtBase64);

// Verify UTXO data matches
const input = psbt.data.inputs[0];
if (!input.witnessUtxo) {
  throw new Error('Missing witness UTXO');
}

// Sign the input
psbt.signInput(0, keyPair);

// Signature is now in PSBT as PARTIAL_SIG
// Multiple signers can sign independently`
        },
        {
            title: "Combiner",
            role: "Merges PSBTs",
            icon: GitBranch,
            color: 'yellow',
            responsibilities: [
                'Collects PSBTs from multiple signers',
                'Merges all partial signatures',
                'Combines all metadata',
                'Produces single PSBT with all sigs'
            ],
            code: `// Combiner merges signatures from different parties
const psbt1 = Psbt.fromBase64(signer1Psbt);
const psbt2 = Psbt.fromBase64(signer2Psbt);

// Combine PSBTs
const combined = psbt1.combine(psbt2);

// Now has signatures from both signers
// Ready for finalization once enough sigs collected`
        },
        {
            title: "Input Finalizer",
            role: "Constructs final scripts",
            icon: Lock,
            color: 'pink',
            responsibilities: [
                'Verifies all required signatures present',
                'Constructs final scriptSig',
                'Constructs final scriptWitness',
                'Removes signing metadata'
            ],
            code: `// Finalizer creates final witness/scriptSig
const psbt = Psbt.fromBase64(combinedPsbt);

// Finalize each input
psbt.finalizeInput(0);

// This:
// 1. Constructs scriptWitness from partial sigs
// 2. Removes PARTIAL_SIG, WITNESS_UTXO, etc.
// 3. Adds FINAL_SCRIPTWITNESS

// Check if all inputs finalized
const isFinalized = psbt.data.inputs.every(
  input => input.finalScriptWitness || input.finalScriptSig
);`
        },
        {
            title: "Transaction Extractor",
            role: "Extracts final transaction",
            icon: CheckCircle2,
            color: 'emerald',
            responsibilities: [
                'Extracts finalized transaction',
                'Verifies transaction is valid',
                'Produces hex for broadcasting',
                'Transaction ready for network'
            ],
            code: `// Extractor produces broadcastable transaction
const psbt = Psbt.fromBase64(finalizedPsbt);

// Extract the final transaction
const tx = psbt.extractTransaction();

// Get hex for broadcasting
const txHex = tx.toHex();

// Broadcast to network
await broadcastTransaction(txHex);

// Transaction is now on the blockchain! 🎉`
        }
    ];

    const currentRole = steps[activeStep];
    const RoleIcon = currentRole.icon;

    return (
        <div className="space-y-6">
            {/* Role Navigator */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4">
                {steps.map((step, i) => {
                    const StepIcon = step.icon;
                    return (
                        <React.Fragment key={i}>
                            <button
                                onClick={() => setActiveStep(i)}
                                className={`
                                    flex-shrink-0 px-4 py-3 rounded-xl font-medium text-sm transition-all
                                    flex items-center gap-2 min-w-fit
                                    ${activeStep === i
                                        ? `bg-${step.color}-500 text-white shadow-lg shadow-${step.color}-500/30`
                                        : 'bg-bg-tertiary text-text-secondary hover:bg-bg-card'}
                                `}
                            >
                                <StepIcon className="w-4 h-4" />
                                <span>{step.title}</span>
                            </button>
                            {i < steps.length - 1 && (
                                <ArrowRight className="w-4 h-4 text-text-muted flex-shrink-0" />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Role Details */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`p-8 rounded-2xl border-2 bg-gradient-to-br from-${currentRole.color}-500/20 to-${currentRole.color}-500/5 border-${currentRole.color}-500/30`}
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`w-16 h-16 rounded-2xl bg-${currentRole.color}-500/20 flex items-center justify-center`}>
                            <RoleIcon className={`w-8 h-8 text-${currentRole.color}-400`} />
                        </div>
                        <div>
                            <h3 className={`text-2xl font-bold text-${currentRole.color}-400`}>
                                {currentRole.title}
                            </h3>
                            <p className="text-text-secondary">{currentRole.role}</p>
                        </div>
                        <div className="ml-auto text-sm text-text-muted">
                            Step {activeStep + 1} of {steps.length}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Responsibilities */}
                        <div>
                            <h4 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Responsibilities
                            </h4>
                            <div className="space-y-2">
                                {currentRole.responsibilities.map((resp, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-3 p-3 bg-bg-tertiary rounded-lg"
                                    >
                                        <CheckCircle2 className={`w-5 h-5 text-${currentRole.color}-400 flex-shrink-0 mt-0.5`} />
                                        <span className="text-sm text-text-secondary">{resp}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Code Example */}
                        <div>
                            <h4 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                                <Code className="w-5 h-5" />
                                Code Example
                            </h4>
                            <div className="bg-bg-secondary rounded-lg p-4 border border-border">
                                <pre className="text-xs font-mono overflow-x-auto text-text-secondary">
                                    {currentRole.code}
                                </pre>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                    disabled={activeStep === 0}
                >
                    Previous Role
                </Button>
                <Button
                    variant="outline"
                    onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                    disabled={activeStep === steps.length - 1}
                >
                    Next Role
                    <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        </div>
    );
};

export default function BIP174Page() {
    const globalKeyTypes = [
        {
            type: 'PSBT_GLOBAL_UNSIGNED_TX',
            keyHex: '0x00',
            name: 'Unsigned Transaction',
            description: 'The complete unsigned transaction that this PSBT represents. This field is required in PSBTv0 and contains all inputs, outputs, version, and locktime.',
            valueFormat: 'Complete serialized transaction (no scriptSig or witness data)',
            example: '02000000 01 abc123... (serialized transaction)',
            required: true
        },
        {
            type: 'PSBT_GLOBAL_XPUB',
            keyHex: '0x01',
            name: 'Extended Public Key',
            description: 'Extended public keys (xpubs) used in the wallet creating this transaction, along with their master key fingerprint and derivation path.',
            valueFormat: 'xpub (78 bytes) as key, 4-byte fingerprint + derivation path as value',
            example: 'xpub6CpGH... → a1b2c3d4 + m/48\'/0\'/0\'/2\''
        },
        {
            type: 'PSBT_GLOBAL_VERSION',
            keyHex: '0xfb',
            name: 'PSBT Version',
            description: 'The version number of the PSBT format. Version 0 is assumed if this field is omitted. Used for future format changes.',
            valueFormat: '4-byte unsigned integer (little-endian)',
            example: '00000000 (version 0)'
        },
        {
            type: 'PSBT_GLOBAL_PROPRIETARY',
            keyHex: '0xfc',
            name: 'Proprietary Data',
            description: 'Application-specific custom data. The key must include a unique identifier prefix to avoid collisions. Allows wallets to store custom metadata.',
            valueFormat: 'Compact size identifier + subtype byte + keydata | custom value',
            example: '0x434152415641 (CARAV) + 0x01 + custom_data'
        }
    ];

    const inputKeyTypes = [
        {
            type: 'PSBT_IN_NON_WITNESS_UTXO',
            keyHex: '0x00',
            name: 'Non-Witness UTXO',
            description: 'The complete previous transaction being spent. Required for non-SegWit inputs. Hardware wallets use this to verify amounts.',
            valueFormat: 'Complete serialized transaction',
            example: '02000000... (full previous transaction hex)'
        },
        {
            type: 'PSBT_IN_WITNESS_UTXO',
            keyHex: '0x01',
            name: 'Witness UTXO',
            description: 'The output being spent from the previous transaction. More efficient than providing the full transaction. Used for SegWit inputs.',
            valueFormat: '8-byte value (little-endian) + scriptPubKey',
            example: '00e1f50500000000 22 0020 abc123...',
            required: false
        },
        {
            type: 'PSBT_IN_PARTIAL_SIG',
            keyHex: '0x02',
            name: 'Partial Signature',
            description: 'A signature for this input. The key contains the public key, the value contains the signature. Multiple signatures can be added by different signers.',
            valueFormat: 'DER-encoded signature + sighash type byte',
            example: '3045022100...01 (signature with SIGHASH_ALL)'
        },
        {
            type: 'PSBT_IN_SIGHASH_TYPE',
            keyHex: '0x03',
            name: 'Sighash Type',
            description: 'The sighash type that should be used when signing this input. If not present, SIGHASH_ALL (0x01) is used.',
            valueFormat: '4-byte unsigned integer (little-endian)',
            example: '01000000 (SIGHASH_ALL)'
        },
        {
            type: 'PSBT_IN_REDEEM_SCRIPT',
            keyHex: '0x04',
            name: 'Redeem Script',
            description: 'The redeem script for P2SH inputs. This script must hash to the scriptPubKey of the output being spent.',
            valueFormat: 'Serialized script bytes',
            example: '5221...53ae (2-of-3 multisig script)'
        },
        {
            type: 'PSBT_IN_WITNESS_SCRIPT',
            keyHex: '0x05',
            name: 'Witness Script',
            description: 'The witness script for P2WSH or P2SH-P2WSH inputs. Used in SegWit multisig transactions.',
            valueFormat: 'Serialized script bytes',
            example: '5221abc...53ae (witness script)'
        },
        {
            type: 'PSBT_IN_BIP32_DERIVATION',
            keyHex: '0x06',
            name: 'BIP32 Derivation Path',
            description: 'The BIP32 derivation path and master key fingerprint for a public key in this input. Helps hardware wallets derive the correct key.',
            valueFormat: 'Public key as key, 4-byte fingerprint + derivation indices as value',
            example: 'pubkey → a1b2c3d4 + [0x80000030, 0x80000000, ...]'
        },
        {
            type: 'PSBT_IN_FINAL_SCRIPTSIG',
            keyHex: '0x07',
            name: 'Final ScriptSig',
            description: 'The finalized scriptSig for this input. Present after finalization, replaces all signing metadata.',
            valueFormat: 'Serialized scriptSig',
            example: '00 47 304402...'
        },
        {
            type: 'PSBT_IN_FINAL_SCRIPTWITNESS',
            keyHex: '0x08',
            name: 'Final Script Witness',
            description: 'The finalized witness stack for this input. Contains the final signatures and scripts for SegWit inputs.',
            valueFormat: 'Serialized witness stack',
            example: '04 00 47 3044... 48 3045... (witness with 2 sigs)'
        }
    ];

    const outputKeyTypes = [
        {
            type: 'PSBT_OUT_REDEEM_SCRIPT',
            keyHex: '0x00',
            name: 'Redeem Script',
            description: 'The redeem script for P2SH outputs. Typically used for change outputs so wallets know this output belongs to them.',
            valueFormat: 'Serialized script bytes',
            example: '5221...53ae'
        },
        {
            type: 'PSBT_OUT_WITNESS_SCRIPT',
            keyHex: '0x01',
            name: 'Witness Script',
            description: 'The witness script for P2WSH outputs. Used for SegWit change outputs.',
            valueFormat: 'Serialized script bytes',
            example: '5221...53ae'
        },
        {
            type: 'PSBT_OUT_BIP32_DERIVATION',
            keyHex: '0x02',
            name: 'BIP32 Derivation Path',
            description: 'The derivation path for public keys in this output. Used to identify change outputs by comparing against known paths.',
            valueFormat: 'Public key as key, 4-byte fingerprint + derivation indices as value',
            example: 'pubkey → a1b2c3d4 + m/48\'/0\'/0\'/2\'/1/4'
        }
    ];

    return (
        <div className="prose prose-invert max-w-none">
            {/* Hero Section */}
            <div className="not-prose mb-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                >
                    <div className="inline-block px-4 py-2 rounded-full bg-green-500/20 text-green-400 text-sm font-bold mb-4 border-2 border-green-500/50">
                        BIP-174
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 relative inline-block">
                        <span className="text-text-primary">PSBTv0: </span>
                        <span className="text-green-400 relative">
                            The Foundation
                            <DoodleUnderline />
                        </span>
                    </h1>
                    <p className="text-xl text-text-secondary max-w-3xl">
                        Discover how BIP-174 revolutionized Bitcoin transaction coordination by introducing
                        a standardized format for partially signed transactions—solving years of fragmentation
                        and enabling secure multi-party collaboration.
                    </p>

                    {/* Author & Links */}
                    <div className="flex flex-wrap gap-4 mt-6">

                        <a href="https://github.com/bitcoin/bips/blob/master/bip-0174.mediawiki"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-secondary border border-border hover:border-green-500/50 transition-colors"
                        >
                            <ExternalLink className="w-4 h-4 text-green-400" />
                            <span className="text-sm">Read BIP-174</span>
                        </a>

                        <a href="https://github.com/achow101"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-secondary border border-border hover:border-green-500/50 transition-colors"
                        >
                            <Users className="w-4 h-4 text-green-400" />
                            <span className="text-sm">Author: Andrew Chow</span>
                        </a>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-secondary border border-border">
                            <Calendar className="w-4 h-4 text-green-400" />
                            <span className="text-sm">Proposed: 2017</span>
                        </div>
                    </div>
                </motion.div>
            </div >

            {/* The Problem: Pre-PSBT Era */}
            < motion.section
                initial={{ opacity: 0 }
                }
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="not-prose mb-16"
            >
                <h2 className="text-3xl font-bold mb-6 text-text-primary flex items-center gap-3">
                    <AlertTriangle className="text-red-400" />
                    The Problem: Before BIP-174
                </h2>

                <p className="text-text-secondary mb-8">
                    Before PSBT was introduced in 2017, coordinating multi-party Bitcoin transactions was a nightmare.
                    Each wallet implemented its own proprietary format, leading to security risks and interoperability failures.
                </p>

                <Card className="bg-bg-secondary border-red-500/30 mb-8">
                    <CardContent className="pt-6">
                        <PrePSBTProblemsVisual />
                    </CardContent>
                </Card>

                <Callout type="warning" title="The Core Problem">
                    <p className="text-sm">
                        Without a standard format, there was <strong>no safe way</strong> to:
                    </p>
                    <ul className="text-sm space-y-1 mt-2">
                        <li>• Have multiple parties collaborate on a single transaction</li>
                        <li>• Use hardware wallets with different software</li>
                        <li>• Implement CoinJoin or other privacy protocols</li>
                        <li>• Build multisig wallets that work across vendors</li>
                    </ul>
                    <p className="text-sm mt-3">
                        BIP-174 solved all of these problems by defining a <strong>universal standard</strong>
                        that any wallet could implement.
                    </p>
                </Callout>
            </motion.section >

            {/* Timeline */}
            < motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="not-prose mb-16"
            >
                <h2 className="text-3xl font-bold mb-6 text-text-primary flex items-center gap-3">
                    <Clock className="text-green-400" />
                    PSBT History & Evolution
                </h2>

                <Card className="bg-bg-secondary border-green-500/30">
                    <CardContent className="pt-8 pb-8">
                        <PSBTTimeline />
                    </CardContent>
                </Card>
            </motion.section >

            {/* Binary Format */}
            < motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="not-prose mb-16"
            >
                <h2 className="text-3xl font-bold mb-6 text-text-primary flex items-center gap-3">
                    <Binary className="text-green-400" />
                    Binary Format Structure
                </h2>

                <p className="text-text-secondary mb-6">
                    PSBT uses an efficient binary format based on key-value maps. Each PSBT starts with magic bytes
                    "psbt" followed by 0xFF, then contains three types of maps: Global, Input (one per input), and
                    Output (one per output).
                </p>

                <Card className="bg-bg-secondary border-green-500/30 mb-8">
                    <CardContent className="pt-6">
                        <BinaryFormatVisual />
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-bg-secondary border-border">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Info className="w-5 h-5 text-green-400" />
                                Key Rules
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2" />
                                <div>
                                    <strong>Unique Keys:</strong> Within each map, keys must be unique
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2" />
                                <div>
                                    <strong>Map Termination:</strong> Each map ends with a 0x00 separator byte
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2" />
                                <div>
                                    <strong>Compact Size:</strong> Lengths use Bitcoin's compact size encoding
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2" />
                                <div>
                                    <strong>Unknown Keys:</strong> Must be preserved for forward compatibility
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-bg-secondary border-border">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Hash className="w-5 h-5 text-blue-400" />
                                Compact Size Encoding
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm font-mono">
                            <div className="p-2 bg-bg-tertiary rounded">
                                <span className="text-text-muted">0x00 - 0xFC:</span>
                                <span className="text-blue-400 ml-2">1 byte</span>
                            </div>
                            <div className="p-2 bg-bg-tertiary rounded">
                                <span className="text-text-muted">0xFD - 0xFFFF:</span>
                                <span className="text-blue-400 ml-2">0xFD + 2 bytes</span>
                            </div>
                            <div className="p-2 bg-bg-tertiary rounded">
                                <span className="text-text-muted">0x10000 - 0xFFFFFFFF:</span>
                                <span className="text-blue-400 ml-2">0xFE + 4 bytes</span>
                            </div>
                            <div className="p-2 bg-bg-tertiary rounded">
                                <span className="text-text-muted">0x100000000+:</span>
                                <span className="text-blue-400 ml-2">0xFF + 8 bytes</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </motion.section >

            {/* Grammar */}
            < motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="not-prose mb-16"
            >
                <h2 className="text-3xl font-bold mb-6 text-text-primary flex items-center gap-3">
                    <Code className="text-green-400" />
                    Format Grammar
                </h2>

                <CodePlayground
                    title="PSBT Binary Format Grammar"
                    initialCode={`import { Psbt } from 'bitcoinjs-lib';

/**
 * PSBT Format Grammar (BIP-174)
 * 
 * <psbt> ::= <magic> <global-map> <input-map>* <output-map>*
 * 
 * <magic> ::= 0x70 0x73 0x62 0x74 0xFF
 *             ('p'  's'  'b'  't'  separator)
 * 
 * <*-map> ::= <keypair>* 0x00
 * 
 * <keypair> ::= <key> <value>
 * 
 * <key> ::= <keylen> <keytype> <keydata>
 * 
 * <value> ::= <valuelen> <valuedata>
 */

// Example: Create a PSBT
const psbt = new Psbt();

// The PSBT structure in memory:
const structure = {
  magic: Buffer.from('psbt\\xff'),
  globalMap: {
    unsignedTx: 'required',
    xpubs: 'optional',
    version: 'optional (0 if omitted)'
  },
  inputMaps: [
    {
      witnessUtxo: 'for SegWit inputs',
      partialSigs: 'signatures from signers',
      bip32Derivation: 'HD wallet paths',
      // ... more fields
    }
  ],
  outputMaps: [
    {
      bip32Derivation: 'for change detection',
      // ... more fields
    }
  ]
};

// Each map ends with 0x00
// Keys must be unique within each map
// Unknown keys must be preserved

console.log('PSBT Format ensures:',psbt);
console.log('✓ Interoperability between wallets');
console.log('✓ Safe multi-party transaction signing');
console.log('✓ Hardware wallet compatibility');
console.log('✓ Forward compatibility with unknown fields');`}
                    imports={{ CaravanPSBT, Psbt, Buffer }}
                    height="500px"
                />
            </motion.section >

            {/* Key-Value Maps */}
            < motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="not-prose mb-16"
            >
                <h2 className="text-3xl font-bold mb-6 text-text-primary flex items-center gap-3">
                    <Layers className="text-green-400" />
                    Key-Value Maps Reference
                </h2>

                <p className="text-text-secondary mb-8">
                    BIP-174 defines three types of key-value maps. Click on any field to see detailed information
                    about its format, purpose, and examples.
                </p>

                <div className="space-y-8">
                    <KeyValueExplorer
                        title="Global"
                        keyTypes={globalKeyTypes}
                        color="green"
                    />
                    <KeyValueExplorer
                        title="Input"
                        keyTypes={inputKeyTypes}
                        color="blue"
                    />
                    <KeyValueExplorer
                        title="Output"
                        keyTypes={outputKeyTypes}
                        color="pink"
                    />
                </div>
            </motion.section >

            {/* PSBT Lifecycle */}
            < motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="not-prose mb-16"
            >
                <h2 className="text-3xl font-bold mb-6 text-text-primary flex items-center gap-3">
                    <Network className="text-green-400" />
                    PSBT Lifecycle & Roles
                </h2>

                <p className="text-text-secondary mb-8">
                    A PSBT passes through multiple roles on its journey from creation to final broadcast. Each role
                    has specific responsibilities and can be performed by different parties or devices.
                </p>

                <Card className="bg-bg-secondary border-green-500/30">
                    <CardContent className="pt-6">
                        <PSBTLifecycleAnimation />
                    </CardContent>
                </Card>
            </motion.section >

            {/* Security & Verification */}
            < motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="not-prose mb-16"
            >
                <h2 className="text-3xl font-bold mb-6 text-text-primary flex items-center gap-3">
                    <Shield className="text-green-400" />
                    Security & Verification Rules
                </h2>

                <Callout type="warning" title="Critical: Signer Must Verify">
                    <p className="text-sm">
                        Before signing any input, a Signer MUST verify the transaction data to prevent
                        signing malicious transactions. These checks are <strong>not optional</strong>—they
                        are critical for security.
                    </p>
                </Callout>

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                    {[
                        {
                            check: 'UTXO Verification',
                            icon: Eye,
                            color: 'blue',
                            rules: [
                                'If NON_WITNESS_UTXO provided, verify its txid matches',
                                'Verify the output being spent matches scriptPubKey',
                                'Confirm the amount being spent is correct',
                                'Check the UTXO hasn\'t been double-spent'
                            ],
                            why: 'Prevents signing transactions that spend incorrect or non-existent UTXOs'
                        },
                        {
                            check: 'Script Verification',
                            icon: FileText,
                            color: 'purple',
                            rules: [
                                'If WITNESS_SCRIPT provided, verify it hashes correctly',
                                'If REDEEM_SCRIPT provided, verify it matches scriptPubKey',
                                'Verify scripts match the expected multisig configuration',
                                'Check script types are consistent with address type'
                            ],
                            why: 'Ensures the scripts actually control the funds being spent'
                        },
                        {
                            check: 'Derivation Path Verification',
                            icon: Key,
                            color: 'green',
                            rules: [
                                'Verify BIP32 path produces expected public key',
                                'Check master fingerprint matches your wallet',
                                'Ensure derivation path is within expected range',
                                'Confirm the key is authorized to sign this input'
                            ],
                            why: 'Prevents signing with wrong keys or unauthorized access'
                        },
                        {
                            check: 'Amount & Fee Verification',
                            icon: Sparkles,
                            color: 'yellow',
                            rules: [
                                'Calculate total input amount',
                                'Calculate total output amount',
                                'Verify fee = inputs - outputs is reasonable',
                                'Check fee isn\'t absurdly high (user error protection)'
                            ],
                            why: 'Protects against accidentally paying enormous fees'
                        }
                    ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className={`bg-gradient-to-br from-${item.color}-500/10 to-transparent border-${item.color}-500/30`}>
                                    <CardHeader>
                                        <CardTitle className={`flex items-center gap-2 text-${item.color}-400`}>
                                            <div className={`w-10 h-10 rounded-lg bg-${item.color}-500/20 flex items-center justify-center`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            {item.check}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {item.rules.map((rule, j) => (
                                            <div key={j} className="flex items-start gap-2 text-sm">
                                                <CheckCircle2 className={`w-4 h-4 text-${item.color}-400 flex-shrink-0 mt-0.5`} />
                                                <span className="text-text-secondary">{rule}</span>
                                            </div>
                                        ))}
                                        <div className={`mt-4 p-3 bg-${item.color}-500/10 border border-${item.color}-500/30 rounded-lg`}>
                                            <div className="text-xs text-text-muted">
                                                <strong>Why:</strong> {item.why}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.section >

            {/* Real Example */}
            < motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="not-prose mb-16"
            >
                <h2 className="text-3xl font-bold mb-6 text-text-primary flex items-center gap-3">
                    <FileText className="text-green-400" />
                    Real-World Example
                </h2>

                <CodePlayground
                    title="Complete PSBTv0 Example"
                    initialCode={`import { Psbt, networks } from 'bitcoinjs-lib';
import { Buffer } from 'buffer';

// --- MOCK DATA FOR DEMO PURPOSES ---
// In a real app, these would come from your wallet or API
const pubkey1 = Buffer.from('030000000000000000000000000000000000000000000000000000000000000001', 'hex');
const pubkey2 = Buffer.from('030000000000000000000000000000000000000000000000000000000000000002', 'hex');
const pubkey3 = Buffer.from('030000000000000000000000000000000000000000000000000000000000000003', 'hex');
const changePubkey = Buffer.from('030000000000000000000000000000000000000000000000000000000000000004', 'hex');

// A dummy 32-byte hash for the previous transaction
const prevTxHash = '0000000000000000000000000000000000000000000000000000000000000000';
const witnessScript = Buffer.from('5221' + pubkey1.toString('hex') + '21' + pubkey2.toString('hex') + '21' + pubkey3.toString('hex') + '53ae', 'hex');
const witnessScriptHash = '0000000000000000000000000000000000000000000000000000000000000000'; // Mock hash

// Mock KeyPairs for signing (structure depends on your signer)
const keyPair1 = {
    publicKey: pubkey1,
    sign: (hash) => Buffer.alloc(64) // Dummy signature
};
const keyPair2 = {
    publicKey: pubkey2,
    sign: (hash) => Buffer.alloc(64) // Dummy signature
};
// -----------------------------------

console.log("Creating PSBT...");

// 1. Creator creates the PSBT
const psbt = new Psbt({ network: networks.bitcoin });

// Add input (spending from a 2-of-3 multisig)
psbt.addInput({
  hash: prevTxHash,
  index: 0,
  witnessUtxo: {
    script: Buffer.from('0020' + witnessScriptHash, 'hex'),
    value: 100000n // 100,000 sats
  },
  witnessScript: witnessScript,
  bip32Derivation: [
    {
      masterFingerprint: Buffer.from('a1b2c3d4', 'hex'),
      path: "m/48'/0'/0'/2'/0/0",
      pubkey: pubkey1
    },
    {
      masterFingerprint: Buffer.from('e5f6a7b8', 'hex'),
      path: "m/48'/0'/0'/2'/0/0",
      pubkey: pubkey2
    },
    {
      masterFingerprint: Buffer.from('c9d0e1f2', 'hex'),
      path: "m/48'/0'/0'/2'/0/0",
      pubkey: pubkey3
    }
  ]
});

// Add output (send to recipient)
psbt.addOutput({
  address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  value: 80000n // 80,000 sats
});

// Add change output
psbt.addOutput({
  address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', // Using same addr for demo
  value: 18000n, 
  bip32Derivation: [
    {
      masterFingerprint: Buffer.from('a1b2c3d4', 'hex'),
      path: "m/48'/0'/0'/2'/1/0",
      pubkey: changePubkey
    }
  ]
});

// 2. Export as base64 for Signer 1
const psbtBase64 = psbt.toBase64();
console.log('PSBT Created (Base64):');
console.log(psbtBase64.substring(0, 50) + '...');

// 3. Signer 1 signs
// Note: Real signing requires valid ECC library, here we mock it
console.log("Signer 1 signing...");
const psbtSigner1 = Psbt.fromBase64(psbtBase64);
// In a real scenario, you would use psbtSigner1.signInput(0, keyPair1);
// For this demo, we skip actual ECDSA verification to prevent 'ECC not initialized' errors in browser
console.log("Signer 1 signed.");

// 4. Signer 2 signs
console.log("Signer 2 signing...");
// const psbtSigner2 = Psbt.fromBase64(psbtSigner1.toBase64());
console.log("Signer 2 signed.");

// 5. Finalizer
// const psbtFinal = Psbt.fromBase64(signed2);
// psbtFinal.finalizeInput(0);

console.log('Flow complete! (Signing skipped in demo environment)');`}
                    // 👇 FIX: Added networks to imports
                    imports={{
                        CaravanPSBT,
                        Psbt,
                        Buffer,
                        CaravanBitcoin,
                        networks
                    }}
                    height="600px"
                />
            </motion.section >

            {/* Limitations */}
            < motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="not-prose mb-16"
            >
                <h2 className="text-3xl font-bold mb-6 text-text-primary flex items-center gap-3">
                    <AlertTriangle className="text-yellow-400" />
                    PSBTv0 Limitations
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {[
                        {
                            title: 'Fixed Transaction Structure',
                            icon: Lock,
                            color: 'red',
                            problem: 'The unsigned transaction is set at creation time. You cannot add or remove inputs/outputs after the PSBT is created.',
                            impact: 'Makes collaborative protocols like CoinJoin impossible, as parties can\'t dynamically build the transaction together.'
                        },
                        {
                            title: 'Inefficient for Hardware Wallets',
                            icon: AlertTriangle,
                            color: 'orange',
                            problem: 'Full UTXO data must be included, making PSBTs large and slow to process on memory-constrained devices.',
                            impact: 'Hardware wallets take longer to verify and may struggle with complex multisig transactions.'
                        },
                        {
                            title: 'Limited Locktime Support',
                            icon: Clock,
                            color: 'yellow',
                            problem: 'All inputs must use the same locktime value. No support for per-input locktime requirements.',
                            impact: 'Cannot create transactions with different timelock requirements for different inputs.'
                        },
                        {
                            title: 'Data Redundancy',
                            icon: XCircle,
                            color: 'purple',
                            problem: 'Input information is duplicated between the unsigned transaction and the input maps.',
                            impact: 'Larger PSBT sizes and potential for inconsistencies between duplicated data.'
                        }
                    ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className={`border-${item.color}-500/30 bg-gradient-to-br from-${item.color}-500/10 to-transparent h-full`}>
                                    <CardHeader>
                                        <CardTitle className={`flex items-center gap-2 text-${item.color}-400`}>
                                            <Icon className="w-5 h-5" />
                                            {item.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div>
                                            <div className="text-xs text-text-muted mb-1">Problem</div>
                                            <p className="text-sm text-text-secondary">{item.problem}</p>
                                        </div>
                                        <div className={`p-3 bg-${item.color}-500/10 border border-${item.color}-500/30 rounded-lg`}>
                                            <div className="text-xs text-text-muted mb-1">Impact</div>
                                            <p className="text-sm text-text-secondary">{item.impact}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>

                <Callout type="tip" title="Solution: PSBTv2 (BIP-370)">
                    <p className="text-sm">
                        These limitations led to the development of <strong>BIP-370 (PSBTv2)</strong>, which introduces:
                    </p>
                    <ul className="text-sm space-y-1 mt-2">
                        <li>• <strong>Dynamic transaction construction</strong> - Add/remove inputs and outputs</li>
                        <li>• <strong>Self-contained input/output maps</strong> - No data duplication</li>
                        <li>• <strong>Advanced locktime handling</strong> - Per-input locktime requirements</li>
                        <li>• <strong>Constructor role</strong> - Enable multi-party transaction building</li>
                    </ul>
                    <p className="text-sm mt-3">
                        Continue to the next section to learn about PSBTv2's powerful enhancements!
                    </p>
                </Callout>
            </motion.section >

            {/* Resources */}
            < motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="not-prose mb-16"
            >
                <h2 className="text-3xl font-bold mb-6 text-text-primary flex items-center gap-3">
                    <ExternalLink className="text-green-400" />
                    Additional Resources
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                    {[
                        {
                            title: 'BIP-174 Specification',
                            desc: 'Official Bitcoin Improvement Proposal',
                            url: 'https://github.com/bitcoin/bips/blob/master/bip-0174.mediawiki',
                            icon: FileText
                        },
                        {
                            title: 'Bitcoin Core Documentation',
                            desc: 'PSBT implementation in Bitcoin Core',
                            url: 'https://github.com/bitcoin/bitcoin/blob/master/doc/psbt.md',
                            icon: Code
                        },
                        {
                            title: 'Andrew Chow\'s Blog',
                            desc: 'Articles from the BIP-174 author',
                            url: 'https://achow101.com/',
                            icon: Users
                        },
                        {
                            title: 'bitcoinjs-lib',
                            desc: 'JavaScript PSBT implementation',
                            url: 'https://github.com/bitcoinjs/bitcoinjs-lib',
                            icon: Code
                        }
                    ].map((resource, i) => {
                        const Icon = resource.icon;
                        return (
                            <motion.a
                                key={i}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="block p-4 rounded-lg bg-bg-secondary border border-border hover:border-green-500/50 transition-all hover:shadow-lg hover:shadow-green-500/10"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-5 h-5 text-green-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-text-primary mb-1 flex items-center gap-2">
                                            {resource.title}
                                            <ExternalLink className="w-4 h-4 text-text-muted" />
                                        </div>
                                        <div className="text-sm text-text-secondary">{resource.desc}</div>
                                    </div>
                                </div>
                            </motion.a>
                        );
                    })}
                </div>
            </motion.section >

            {/* Navigation */}
            < PageNavigation
                prev={{ href: '/learn/psbt', title: 'PSBT Introduction' }}
                next={{ href: '/learn/psbt/bip370', title: 'BIP-370: PSBTv2' }}
            />
        </div >
    );
}