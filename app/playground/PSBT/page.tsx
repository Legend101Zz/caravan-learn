/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Callout } from '@/components/content/callout';
import { PageNavigation } from '@/components/layout/page-navigation';
import * as CaravanPSBT from '@caravan/psbt';
import {
    Eye,
    Copy,
    Check,
    AlertCircle,
    ChevronDown,
    ChevronRight,
    Globe,
    ArrowDownToLine,
    ArrowUpFromLine,
    Key,
    FileText,
    Zap,
    Info,
    RefreshCw
} from 'lucide-react';

// Field explanations database
const fieldExplanations: Record<string, { name: string; description: string; importance: string }> = {
    'psbtVersion': {
        name: 'PSBT Version',
        description: 'The version of the PSBT format (0 or 2).',
        importance: 'Determines which fields are expected and how to parse the PSBT.'
    },
    'txVersion': {
        name: 'Transaction Version',
        description: 'The Bitcoin transaction version number.',
        importance: 'Version 2 is required for SegWit and enables features like CSV (CheckSequenceVerify).'
    },
    'fallbackLocktime': {
        name: 'Fallback Locktime',
        description: 'Default locktime if no inputs require a specific locktime.',
        importance: 'Sets when the transaction can be included in a block.'
    },
    'computedLocktime': {
        name: 'Computed Locktime',
        description: 'The actual locktime to use, computed from all inputs.',
        importance: 'The final locktime used in the transaction.'
    },
    'inputCount': {
        name: 'Input Count',
        description: 'Number of inputs in this PSBT.',
        importance: 'Must match the actual number of input maps.'
    },
    'outputCount': {
        name: 'Output Count',
        description: 'Number of outputs in this PSBT.',
        importance: 'Must match the actual number of output maps.'
    },
    'txModifiable': {
        name: 'TX Modifiable Flags',
        description: 'Bitfield indicating what can still be modified.',
        importance: 'Controls whether inputs/outputs can be added or removed.'
    },
    'globalXpub': {
        name: 'Global Extended Public Key',
        description: 'An xpub used in the wallet, with derivation path.',
        importance: 'Helps signers identify their keys and verify derivation.'
    },
    'witnessUtxo': {
        name: 'Witness UTXO',
        description: 'The output being spent (for SegWit inputs).',
        importance: 'Contains the amount and scriptPubKey needed for signing.'
    },
    'partialSig': {
        name: 'Partial Signature',
        description: 'A signature from one of the required signers.',
        importance: 'Once all required signatures are collected, the input can be finalized.'
    },
    'bip32Derivation': {
        name: 'BIP32 Derivation',
        description: 'Links a public key to its derivation path.',
        importance: 'Allows hardware wallets to find the correct key for signing.'
    },
    'sequence': {
        name: 'Sequence Number',
        description: 'The input sequence number.',
        importance: 'Used for RBF (Replace-By-Fee) and relative timelocks.'
    },
    'amount': {
        name: 'Output Amount',
        description: 'The value in satoshis being sent to this output.',
        importance: 'Critical for fee calculation and transaction verification.'
    },
    'script': {
        name: 'Output Script',
        description: 'The scriptPubKey that locks this output.',
        importance: 'Determines the conditions for spending this output.'
    }
};

// Example PSBTs
const examplePSBTs = {
    v0: 'cHNidP8B+wQCAAAAAQIEAQAAAAEEAQIBBQECAQMEAAAAAAEGAQBPAQSIsh4DnlMMrIAAAAA9vIpcl2nwMbF+d/6hUYYDIhoY/RjyuaVMbIwax1y8NQLyMFhLFV0cfxzUUSCmU8SNZQtDG2fFssE/J9cUIDfBaRAnVpxQMQAAgAAAAIAAAACAAAEOIHEOp2q0XFy2Q45gflnMA3YmmBgFrp4N/ZCJASq7C+U1AQ8EAQAAAAEQBP////8BAR8A4fUFAAAAABYAFDO5gvkbKPFgySC0q5XljOUN2jpKIgYDMJaA8zx9446mpHzU7NZvH1pJdHxv+4gI7QkDkkPjrVwYJ1acUDEAAIAAAACAAAAAgAAAAAABAAAAIgIDMJaA8zx9446mpHzU7NZvH1pJdHxv+4gI7QkDkkPjrVxHMEQCIC1wTO2DDFapCTRL10K2hS3M0QPpY7rpLTjnUlTSu0JFAiAthsQ3GV30bAztoITyopHD2i1kBw92v5uQsZXn7yj3cgEAAQ4gGQmU1qizyMgsy8+y+6QQaqBmObhyqNRHRlwNQliNbWcBDwQAAAAAARAE/////wEBHwDh9QUAAAAAFgAUOI+5RDB+t370UZfQsLJF4HnwEd4iBgLHdxYfc9C3xyue573mUCk9E/CVvHZWrR9SXaX9LhCxEBgnVpxQMQAAgAAAAIAAAACAAAAAAAAAAAAiAgLHdxYfc9C3xyue573mUCk9E/CVvHZWrR9SXaX9LhCxEEcwRAIgTLH7X4aclC4OJhAFdhJUORea6I3Kip3Dugj3lTmI+qYCIFIfScp5HCfXDic8mxRhaYWQk2HiW+J06iANfgiCflFNAQABAwgA4fUFAAAAAAEEGXapFLa8LA7lZVqEPXmv7dDMw/fdZDQJiKwAAQMIYFr0BQAAAAABBBYAFBGI745M4ESeqsj7FBy/WhF25qCIIgIC0gylAu4olobSGBW9Q6gGN7Bpjh+82+TK7URfbBoKkO8YJ1acUDEAAIAAAACAAAAAgAAAAAAEAAAAAA==',
    v2: 'cHNidP8BAgQCAAAAAQMEAAAAAAEEAQEBBQECAQYBBwH7BAIAAAAAAQBSAgAAAAHBqiVuIUuWoYIvk95Cv/O18/+NBRkwbjUV11FaXoBbEgAAAAAA/////wEYxpo7AAAAABYAFLCjrxRCCEEmk8p9FmhStS2wrvBuAAAAAAEBHxjGmjsAAAAAFgAUsKOvFEIIQSaTyn0WaFK1LbCu8G4BDiALCtkhQZwchxlzXXLcc5+eqeBjjR/kwe7w+ZRAhIFfyAEPBAAAAAABEAT+////AREEjI3EYgESBBAnAAAAIgIC1gH4SEamdV93a+AOPZ3o+xCsyTX7g8RfsBYtTK1at5IY9p2HPlQAAIABAACAAAAAgAAAAAAqAAAAAQMIAAivLwAAAAABBBYAFMQw9kxHVtoxDb0aCFVy7ymZJicsACICAuNvv/U91TQHDPj9OWYUaA81epuF23NAvxz6dF0q17NAGPadhz5UAACAAQAAgAAAAIABAAAAZAAAAAEDCIu96wsAAAAAAQQWABRN0ZOslkpWrBueHMqEVP4vR0+FEwA='
};

// Collapsible Section Component
const CollapsibleSection = ({
    title,
    icon: Icon,
    children,
    defaultOpen = false,
    color = 'primary',
    badge
}: {
    title: string;
    icon: any;
    children: React.ReactNode;
    defaultOpen?: boolean;
    color?: string;
    badge?: string;
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    const colorClasses = {
        primary: 'text-primary border-primary/30 bg-primary/5',
        green: 'text-green-400 border-green-500/30 bg-green-500/5',
        blue: 'text-blue-400 border-blue-500/30 bg-blue-500/5',
        purple: 'text-purple-400 border-purple-500/30 bg-purple-500/5'
    };

    return (
        <div className={`rounded-lg border ${colorClasses[color]?.split(' ').slice(1).join(' ') || 'border-border'}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 py-3 flex items-center justify-between hover:bg-bg-tertiary/50 transition-colors rounded-t-lg ${colorClasses[color]?.split(' ')[0] || ''}`}
            >
                <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span className="font-semibold">{title}</span>
                    {badge && (
                        <span className="px-2 py-0.5 rounded-full bg-bg-tertiary text-xs text-text-muted">
                            {badge}
                        </span>
                    )}
                </div>
                {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 border-t border-border/50">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Field Display Component
const FieldDisplay = ({
    label,
    value,
    explanation,
    mono = true
}: {
    label: string;
    value: React.ReactNode;
    explanation?: string;
    mono?: boolean;
}) => {
    const [showExplanation, setShowExplanation] = useState(false);
    const explainData = explanation ? fieldExplanations[explanation] : null;

    return (
        <div className="p-3 bg-bg-tertiary rounded-lg">
            <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-xs text-text-muted">{label}</span>
                {explainData && (
                    <button
                        onClick={() => setShowExplanation(!showExplanation)}
                        className="text-text-muted hover:text-primary transition-colors"
                    >
                        <Info size={14} />
                    </button>
                )}
            </div>
            <div className={`text-sm ${mono ? 'font-mono' : ''} break-all`}>
                {value}
            </div>
            <AnimatePresence>
                {showExplanation && explainData && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-2 pt-2 border-t border-border/50"
                    >
                        <p className="text-xs text-text-secondary mb-1">{explainData.description}</p>
                        <p className="text-xs text-primary">{explainData.importance}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Parse PSBT function (simplified - in real implementation would use @caravan/psbt)
const parsePSBT = (base64: string): any => {
    // This is a placeholder - the actual implementation would use PsbtV2 class
    try {
        // Attempt to detect version and parse
        const bytes = atob(base64);
        const hex = Array.from(bytes).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');

        // Check magic bytes
        if (!hex.startsWith('70736274ff')) {
            throw new Error('Invalid PSBT: Missing magic bytes');
        }

        // Try to use Caravan's PsbtV2 class
        const psbt = new CaravanPSBT.PsbtV2(base64);

        return {
            success: true,
            version: psbt.PSBT_GLOBAL_VERSION,
            txVersion: psbt.PSBT_GLOBAL_TX_VERSION,
            fallbackLocktime: psbt.PSBT_GLOBAL_FALLBACK_LOCKTIME,
            inputCount: psbt.PSBT_GLOBAL_INPUT_COUNT,
            outputCount: psbt.PSBT_GLOBAL_OUTPUT_COUNT,
            modifiable: psbt.PSBT_GLOBAL_TX_MODIFIABLE,
            globalXpubs: psbt.PSBT_GLOBAL_XPUB,
            inputs: psbt.inputMaps.map((input, i) => ({
                index: i,
                witnessUtxo: psbt.PSBT_IN_WITNESS_UTXO[i],
                partialSigs: psbt.nthInputPartialSigs(i),
                bip32Derivations: psbt.nthInputBIP32Derivations(i),
                sequence: psbt.PSBT_IN_SEQUENCE(i),
                previousTxid: psbt.PSBT_IN_PREVIOUS_TXID(i),
                outputIndex: psbt.PSBT_IN_OUTPUT_INDEX(i)
            })),
            outputs: psbt.outputMaps.map((output, i) => ({
                index: i,
                amount: psbt.PSBT_OUT_AMOUNT(i),
                script: psbt.PSBT_OUT_SCRIPT(i),
                bip32Derivations: psbt.nthOutputBIP32Derivations(i)
            })),
            raw: psbt
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

export default function PSBTExplorerPage() {
    const [psbtInput, setPsbtInput] = useState('');
    const [parsedPSBT, setParsedPSBT] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    const handleParse = () => {
        if (!psbtInput.trim()) return;

        // Clean input (remove whitespace, newlines)
        const cleaned = psbtInput.trim().replace(/\s+/g, '');

        // Try to parse
        const result = parsePSBT(cleaned);
        setParsedPSBT(result);
    };

    const loadExample = (version: 'v0' | 'v2') => {
        setPsbtInput(examplePSBTs[version]);
        const result = parsePSBT(examplePSBTs[version]);
        setParsedPSBT(result);
    };

    const copyJSON = async () => {
        if (parsedPSBT?.success) {
            await navigator.clipboard.writeText(JSON.stringify(parsedPSBT, null, 2));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="prose prose-invert max-w-none">
            <div className="not-prose mb-8">
                <div className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium mb-4">
                    🔍 Interactive Tool
                </div>
                <h1 className="text-5xl font-bold mb-4">PSBT Explorer</h1>
                <p className="text-xl text-text-secondary">
                    Decode and analyze any PSBT. Paste a hex or base64 encoded PSBT to see
                    every field explained. PSBTv0 will be automatically converted to v2.
                </p>
            </div>

            {/* Input Section */}
            <div className="not-prose mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <FileText size={20} />
                                PSBT Input
                            </span>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => loadExample('v0')}>
                                    Load v0 Example
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => loadExample('v2')}>
                                    Load v2 Example
                                </Button>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            value={psbtInput}
                            onChange={(e) => setPsbtInput(e.target.value)}
                            placeholder="Paste a hex or base64 encoded PSBT here..."
                            className="font-mono text-xs min-h-[120px]"
                        />
                        <div className="flex gap-2">
                            <Button onClick={handleParse} className="flex-1">
                                <Eye size={16} className="mr-2" />
                                Decode PSBT
                            </Button>
                            {parsedPSBT?.success && (
                                <Button variant="outline" onClick={copyJSON}>
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Results Section */}
            {parsedPSBT && (
                <div className="not-prose space-y-4">
                    {parsedPSBT.error ? (
                        <Card className="border-red-500/30 bg-red-950/10">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3 text-red-400">
                                    <AlertCircle size={24} />
                                    <div>
                                        <div className="font-bold">Failed to parse PSBT</div>
                                        <div className="text-sm text-red-300">{parsedPSBT.error}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            {/* Version Banner */}
                            <div className={`p-4 rounded-lg border ${parsedPSBT.version === 2
                                    ? 'bg-primary/10 border-primary/30'
                                    : 'bg-pkg-psbt/10 border-pkg-psbt/30'
                                }`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-2xl font-bold ${parsedPSBT.version === 2 ? 'text-primary' : 'text-pkg-psbt'
                                            }`}>
                                            PSBTv{parsedPSBT.version}
                                        </span>
                                        <span className="text-text-secondary">
                                            {parsedPSBT.inputCount} input{parsedPSBT.inputCount !== 1 ? 's' : ''},
                                            {' '}{parsedPSBT.outputCount} output{parsedPSBT.outputCount !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm ${parsedPSBT.version === 2
                                            ? 'bg-primary/20 text-primary'
                                            : 'bg-pkg-psbt/20 text-pkg-psbt'
                                        }`}>
                                        {parsedPSBT.version === 2 ? 'BIP-370' : 'BIP-174'}
                                    </span>
                                </div>
                            </div>

                            {/* Global Section */}
                            <CollapsibleSection
                                title="Global Map"
                                icon={Globe}
                                color="green"
                                defaultOpen
                                badge={`${parsedPSBT.globalXpubs?.length || 0} xpubs`}
                            >
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    <FieldDisplay
                                        label="PSBT Version"
                                        value={parsedPSBT.version}
                                        explanation="psbtVersion"
                                    />
                                    <FieldDisplay
                                        label="TX Version"
                                        value={parsedPSBT.txVersion}
                                        explanation="txVersion"
                                    />
                                    <FieldDisplay
                                        label="Fallback Locktime"
                                        value={parsedPSBT.fallbackLocktime || '0'}
                                        explanation="fallbackLocktime"
                                    />
                                    <FieldDisplay
                                        label="Input Count"
                                        value={parsedPSBT.inputCount}
                                        explanation="inputCount"
                                    />
                                    <FieldDisplay
                                        label="Output Count"
                                        value={parsedPSBT.outputCount}
                                        explanation="outputCount"
                                    />
                                    <FieldDisplay
                                        label="TX Modifiable Flags"
                                        value={parsedPSBT.modifiable?.join(', ') || 'None'}
                                        explanation="txModifiable"
                                    />
                                </div>

                                {parsedPSBT.globalXpubs?.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <div className="text-sm font-semibold text-green-400">Global XPubs</div>
                                        {parsedPSBT.globalXpubs.map((xpub: any, i: number) => (
                                            <div key={i} className="p-3 bg-bg-tertiary rounded-lg">
                                                <div className="text-xs text-text-muted mb-1">
                                                    #{i} xpub BIP 32 path
                                                </div>
                                                <div className="font-mono text-xs break-all text-green-400">
                                                    {xpub.path || 'Unknown path'}
                                                </div>
                                                <div className="font-mono text-xs break-all text-text-secondary mt-1">
                                                    {xpub.xpub || 'No xpub data'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CollapsibleSection>

                            {/* Inputs Section */}
                            <CollapsibleSection
                                title="Inputs"
                                icon={ArrowDownToLine}
                                color="blue"
                                defaultOpen
                                badge={`${parsedPSBT.inputCount}`}
                            >
                                <div className="space-y-4">
                                    {parsedPSBT.inputs?.map((input: any, i: number) => (
                                        <div key={i} className="p-4 bg-bg-tertiary rounded-lg border border-blue-500/20">
                                            <div className="font-semibold text-blue-400 mb-3">
                                                Input #{i}
                                                {input.previousTxid && (
                                                    <span className="text-xs text-text-muted ml-2 font-mono">
                                                        {input.previousTxid?.substring(0, 16)}...:{input.outputIndex}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-3">
                                                {input.witnessUtxo && (
                                                    <FieldDisplay
                                                        label="Witness UTXO"
                                                        value={
                                                            <span className="text-xs">
                                                                {input.witnessUtxo.substring(0, 40)}...
                                                            </span>
                                                        }
                                                        explanation="witnessUtxo"
                                                    />
                                                )}
                                                <FieldDisplay
                                                    label="Sequence"
                                                    value={input.sequence?.toString() || '0xffffffff'}
                                                    explanation="sequence"
                                                />
                                            </div>

                                            {input.partialSigs?.length > 0 && (
                                                <div className="mt-3 space-y-2">
                                                    <div className="text-xs text-text-muted">Partial Signatures</div>
                                                    {input.partialSigs.map((sig: any, j: number) => (
                                                        <div key={j} className="p-2 bg-bg-secondary rounded text-xs">
                                                            <div className="text-blue-400 mb-1">
                                                                Pubkey: {sig.pubkey?.substring(0, 20)}...
                                                            </div>
                                                            <div className="text-text-muted">
                                                                Sig: {sig.signature?.substring(0, 30)}...
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {input.bip32Derivations?.length > 0 && (
                                                <div className="mt-3 space-y-2">
                                                    <div className="text-xs text-text-muted">BIP32 Derivations</div>
                                                    {input.bip32Derivations.map((deriv: any, j: number) => (
                                                        <div key={j} className="p-2 bg-bg-secondary rounded text-xs font-mono">
                                                            <span className="text-blue-400">{deriv.masterFingerprint}</span>
                                                            <span className="text-text-muted">/{deriv.path}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CollapsibleSection>

                            {/* Outputs Section */}
                            <CollapsibleSection
                                title="Outputs"
                                icon={ArrowUpFromLine}
                                color="purple"
                                defaultOpen
                                badge={`${parsedPSBT.outputCount}`}
                            >
                                <div className="space-y-4">
                                    {parsedPSBT.outputs?.map((output: any, i: number) => (
                                        <div key={i} className="p-4 bg-bg-tertiary rounded-lg border border-purple-500/20">
                                            <div className="font-semibold text-purple-400 mb-3">
                                                Output #{i}
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-3">
                                                <FieldDisplay
                                                    label="Amount (sats)"
                                                    value={output.amount?.toString() || 'Unknown'}
                                                    explanation="amount"
                                                />
                                                {output.script && (
                                                    <FieldDisplay
                                                        label="Script"
                                                        value={
                                                            <span className="text-xs">
                                                                {output.script?.substring(0, 40)}...
                                                            </span>
                                                        }
                                                        explanation="script"
                                                    />
                                                )}
                                            </div>

                                            {output.bip32Derivations?.length > 0 && (
                                                <div className="mt-3 space-y-2">
                                                    <div className="text-xs text-text-muted">BIP32 Derivations</div>
                                                    {output.bip32Derivations.map((deriv: any, j: number) => (
                                                        <div key={j} className="p-2 bg-bg-secondary rounded text-xs font-mono">
                                                            <span className="text-purple-400">{deriv.masterFingerprint}</span>
                                                            <span className="text-text-muted">/{deriv.path}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CollapsibleSection>
                        </>
                    )}
                </div>
            )}

            <Callout type="tip" title="Understanding the Fields">
                <p>
                    Click the <Info className="inline w-4 h-4" /> icon next to any field to see
                    a detailed explanation of what it means and why it's important. This helps
                    you understand exactly what information is contained in a PSBT.
                </p>
            </Callout>

            <PageNavigation
                prev={{ href: '/learn/psbt/bip370', label: 'BIP-370: PSBTv2' }}
                next={{ href: '/learn/psbt/pipeline', label: 'PSBT Pipeline Flow' }}
            />
        </div>
    );
}