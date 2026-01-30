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
    Layers
} from 'lucide-react';

// Version Comparison Visual
const VersionComparisonVisual = () => {
    const [showV2, setShowV2] = useState(false);

    return (
        <div className="space-y-4">
            <div className="flex justify-center">
                <div className="inline-flex rounded-lg border border-border p-1 bg-bg-secondary">
                    <button
                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${!showV2 ? 'bg-pkg-psbt text-white' : 'text-text-secondary'
                            }`}
                        onClick={() => setShowV2(false)}
                    >
                        PSBTv0
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${showV2 ? 'bg-primary text-white' : 'text-text-secondary'
                            }`}
                        onClick={() => setShowV2(true)}
                    >
                        PSBTv2
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={showV2 ? 'v2' : 'v0'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-3 gap-2"
                >
                    {/* Global */}
                    <div className="col-span-3 p-4 rounded-lg border-2 border-green-500/50 bg-green-500/10">
                        <div className="text-sm font-bold text-green-400 mb-2">Global Map</div>
                        <div className="space-y-1 text-xs">
                            {!showV2 ? (
                                <>
                                    <div className="p-1 bg-green-500/20 rounded">UNSIGNED_TX (required)</div>
                                    <div className="p-1 bg-green-500/10 rounded text-text-muted">XPUB (optional)</div>
                                    <div className="p-1 bg-green-500/10 rounded text-text-muted">VERSION (optional, 0 if omitted)</div>
                                </>
                            ) : (
                                <>
                                    <div className="p-1 bg-green-500/20 rounded">TX_VERSION (required) ✨</div>
                                    <div className="p-1 bg-green-500/20 rounded">INPUT_COUNT (required) ✨</div>
                                    <div className="p-1 bg-green-500/20 rounded">OUTPUT_COUNT (required) ✨</div>
                                    <div className="p-1 bg-green-500/10 rounded text-text-muted">FALLBACK_LOCKTIME ✨</div>
                                    <div className="p-1 bg-green-500/10 rounded text-text-muted">TX_MODIFIABLE ✨</div>
                                    <div className="p-1 bg-green-500/10 rounded text-text-muted">VERSION = 2</div>
                                    <div className="p-1 bg-red-500/20 rounded text-red-400 line-through">UNSIGNED_TX (excluded)</div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="p-4 rounded-lg border-2 border-blue-500/50 bg-blue-500/10">
                        <div className="text-sm font-bold text-blue-400 mb-2">Input Map</div>
                        <div className="space-y-1 text-xs">
                            {!showV2 ? (
                                <>
                                    <div className="p-1 bg-blue-500/10 rounded">WITNESS_UTXO</div>
                                    <div className="p-1 bg-blue-500/10 rounded">PARTIAL_SIG</div>
                                    <div className="p-1 bg-blue-500/10 rounded">BIP32_DERIVATION</div>
                                </>
                            ) : (
                                <>
                                    <div className="p-1 bg-blue-500/20 rounded">PREVIOUS_TXID ✨</div>
                                    <div className="p-1 bg-blue-500/20 rounded">OUTPUT_INDEX ✨</div>
                                    <div className="p-1 bg-blue-500/20 rounded">SEQUENCE ✨</div>
                                    <div className="p-1 bg-blue-500/10 rounded">REQUIRED_TIME_LOCKTIME ✨</div>
                                    <div className="p-1 bg-blue-500/10 rounded">REQUIRED_HEIGHT_LOCKTIME ✨</div>
                                    <div className="p-1 bg-blue-500/10 rounded text-text-muted">+ all v0 fields</div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Outputs */}
                    <div className="p-4 rounded-lg border-2 border-purple-500/50 bg-purple-500/10">
                        <div className="text-sm font-bold text-purple-400 mb-2">Output Map</div>
                        <div className="space-y-1 text-xs">
                            {!showV2 ? (
                                <>
                                    <div className="p-1 bg-purple-500/10 rounded">REDEEM_SCRIPT</div>
                                    <div className="p-1 bg-purple-500/10 rounded">WITNESS_SCRIPT</div>
                                    <div className="p-1 bg-purple-500/10 rounded">BIP32_DERIVATION</div>
                                </>
                            ) : (
                                <>
                                    <div className="p-1 bg-purple-500/20 rounded">AMOUNT ✨</div>
                                    <div className="p-1 bg-purple-500/20 rounded">SCRIPT ✨</div>
                                    <div className="p-1 bg-purple-500/10 rounded text-text-muted">+ all v0 fields</div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="p-3 bg-bg-tertiary rounded">
                        <div className="text-xs text-text-muted">
                            {showV2 ? "✨ = New in v2" : "v0 format"}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

// Modifiable Flags Visual
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
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
                {[
                    { key: 'inputs', label: 'Inputs Modifiable', bit: 'Bit 0', desc: 'Can add/remove inputs' },
                    { key: 'outputs', label: 'Outputs Modifiable', bit: 'Bit 1', desc: 'Can add/remove outputs' },
                    { key: 'sighashSingle', label: 'Has SIGHASH_SINGLE', bit: 'Bit 2', desc: 'Contains SIGHASH_SINGLE sig' }
                ].map((flag) => (
                    <motion.button
                        key={flag.key}
                        onClick={() => toggleFlag(flag.key as keyof typeof flags)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-lg border-2 transition-colors text-left ${flags[flag.key as keyof typeof flags]
                            ? 'border-green-500/50 bg-green-500/10'
                            : 'border-border bg-bg-tertiary'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-text-muted">{flag.bit}</span>
                            {flags[flag.key as keyof typeof flags] ? (
                                <Unlock size={16} className="text-green-400" />
                            ) : (
                                <Lock size={16} className="text-text-muted" />
                            )}
                        </div>
                        <div className="font-semibold text-sm mb-1">{flag.label}</div>
                        <div className="text-xs text-text-muted">{flag.desc}</div>
                    </motion.button>
                ))}
            </div>

            <div className="p-4 bg-bg-tertiary rounded-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-sm font-semibold">PSBT_GLOBAL_TX_MODIFIABLE Value</div>
                        <div className="text-xs text-text-muted">
                            Binary: {binaryValue.toString(2).padStart(8, '0')} | Hex: 0x{binaryValue.toString(16).padStart(2, '0')}
                        </div>
                    </div>
                    <div className="font-mono text-2xl text-primary">{binaryValue}</div>
                </div>
            </div>
        </div>
    );
};

// Constructor Role Visualization
const ConstructorRoleVisual = () => {
    const [inputs, setInputs] = useState([{ id: 1, amount: 0.5 }]);
    const [outputs, setOutputs] = useState([{ id: 1, amount: 0.4 }]);

    const addInput = () => {
        if (inputs.length < 4) {
            setInputs([...inputs, { id: inputs.length + 1, amount: 0.3 }]);
        }
    };

    const addOutput = () => {
        if (outputs.length < 4) {
            setOutputs([...outputs, { id: outputs.length + 1, amount: 0.1 }]);
        }
    };

    const removeInput = () => {
        if (inputs.length > 1) {
            setInputs(inputs.slice(0, -1));
        }
    };

    const removeOutput = () => {
        if (outputs.length > 1) {
            setOutputs(outputs.slice(0, -1));
        }
    };

    const totalIn = inputs.reduce((sum, i) => sum + i.amount, 0);
    const totalOut = outputs.reduce((sum, o) => sum + o.amount, 0);
    const fee = Math.max(0, totalIn - totalOut);

    return (
        <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                {/* Inputs */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-blue-400">Inputs</span>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={removeInput} disabled={inputs.length <= 1}>
                                <Minus size={14} />
                            </Button>
                            <Button size="sm" variant="outline" onClick={addInput} disabled={inputs.length >= 4}>
                                <Plus size={14} />
                            </Button>
                        </div>
                    </div>
                    <AnimatePresence>
                        {inputs.map((input, i) => (
                            <motion.div
                                key={input.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-3 rounded bg-blue-500/10 border border-blue-500/30"
                            >
                                <div className="flex justify-between text-sm">
                                    <span>Input #{i}</span>
                                    <span className="font-mono">{input.amount} BTC</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div className="text-right text-sm text-text-muted">
                        Total: {totalIn.toFixed(2)} BTC
                    </div>
                </div>

                {/* Outputs */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="font-semibold text-purple-400">Outputs</span>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={removeOutput} disabled={outputs.length <= 1}>
                                <Minus size={14} />
                            </Button>
                            <Button size="sm" variant="outline" onClick={addOutput} disabled={outputs.length >= 4}>
                                <Plus size={14} />
                            </Button>
                        </div>
                    </div>
                    <AnimatePresence>
                        {outputs.map((output, i) => (
                            <motion.div
                                key={output.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="p-3 rounded bg-purple-500/10 border border-purple-500/30"
                            >
                                <div className="flex justify-between text-sm">
                                    <span>Output #{i}</span>
                                    <span className="font-mono">{output.amount} BTC</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div className="text-right text-sm text-text-muted">
                        Total: {totalOut.toFixed(2)} BTC
                    </div>
                </div>
            </div>

            <div className="p-3 bg-primary/10 rounded-lg border border-primary/30 text-center">
                <span className="text-sm">Fee: </span>
                <span className="font-mono font-bold text-primary">{fee.toFixed(2)} BTC</span>
            </div>

            <div className="text-xs text-center text-text-muted">
                PSBTv2 allows the Constructor to dynamically add/remove inputs and outputs
            </div>
        </div>
    );
};

export default function BIP370Page() {
    return (
        <div className="prose prose-invert max-w-none">
            <div className="not-prose mb-8">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
                    BIP-370
                </div>
                <h1 className="text-5xl font-bold mb-4">PSBTv2: The Enhanced Format</h1>
                <p className="text-xl text-text-secondary">
                    Learn how BIP-370 extends the PSBT format with dynamic transaction
                    construction, better locktime support, and improved flexibility.
                </p>
            </div>

            <Callout type="info" title="Why PSBTv2?">
                <p>
                    PSBTv2 was introduced to address the limitations of PSBTv0. The key motivation
                    was to allow <strong>dynamic transaction construction</strong> - the ability to add
                    inputs and outputs after the PSBT is created. This is essential for protocols
                    like CoinJoin, PayJoin, and interactive transaction building.
                </p>
            </Callout>

            <h2>Key Differences from PSBTv0</h2>

            <div className="not-prose my-8">
                <Card className="bg-bg-secondary">
                    <CardContent className="pt-6">
                        <VersionComparisonVisual />
                    </CardContent>
                </Card>
            </div>

            <CodePlayground
                title="PSBTv2 vs PSBTv0 Structure"
                initialCode={`console.log("=== PSBTv2 vs PSBTv0 ===\\n");

console.log("Key Difference: Where transaction data lives\\n");

console.log("PSBTv0:");
console.log("  Global Map:");
console.log("    PSBT_GLOBAL_UNSIGNED_TX  ← Contains ALL tx data");
console.log("    (inputs, outputs, version, locktime)");
console.log("");
console.log("  Input/Output Maps:");
console.log("    Only signing metadata, scripts, signatures");
console.log("");

console.log("PSBTv2:");
console.log("  Global Map:");
console.log("    PSBT_GLOBAL_TX_VERSION      ← Tx version (separate)");
console.log("    PSBT_GLOBAL_FALLBACK_LOCKTIME");
console.log("    PSBT_GLOBAL_INPUT_COUNT");
console.log("    PSBT_GLOBAL_OUTPUT_COUNT");
console.log("    PSBT_GLOBAL_TX_MODIFIABLE   ← Control flags!");
console.log("");
console.log("  Input Maps:");
console.log("    PSBT_IN_PREVIOUS_TXID       ← Input data here!");
console.log("    PSBT_IN_OUTPUT_INDEX");
console.log("    PSBT_IN_SEQUENCE");
console.log("    + signing metadata");
console.log("");
console.log("  Output Maps:");
console.log("    PSBT_OUT_AMOUNT             ← Output data here!");
console.log("    PSBT_OUT_SCRIPT");
console.log("    + derivation info");
console.log("");

console.log("🎯 Benefit: Each input/output is self-contained!");
console.log("   Can be added/removed independently.");`}
                imports={{ CaravanPSBT }}
                height="520px"
            />

            <h2>New PSBTv2 Global Fields</h2>

            <div className="not-prose my-8 space-y-4">
                {[
                    {
                        name: 'PSBT_GLOBAL_TX_VERSION',
                        hex: '0x02',
                        desc: 'The transaction version. Must be ≥ 2 for PSBTv2.',
                        format: '4-byte signed integer (little-endian)',
                        required: true
                    },
                    {
                        name: 'PSBT_GLOBAL_FALLBACK_LOCKTIME',
                        hex: '0x03',
                        desc: 'Default locktime if no inputs specify required locktimes.',
                        format: '4-byte unsigned integer (little-endian)',
                        required: false
                    },
                    {
                        name: 'PSBT_GLOBAL_INPUT_COUNT',
                        hex: '0x04',
                        desc: 'Number of inputs in the PSBT.',
                        format: 'Compact size unsigned integer',
                        required: true
                    },
                    {
                        name: 'PSBT_GLOBAL_OUTPUT_COUNT',
                        hex: '0x05',
                        desc: 'Number of outputs in the PSBT.',
                        format: 'Compact size unsigned integer',
                        required: true
                    },
                    {
                        name: 'PSBT_GLOBAL_TX_MODIFIABLE',
                        hex: '0x06',
                        desc: 'Bitfield indicating what can still be modified.',
                        format: '1-byte bitfield',
                        required: false
                    }
                ].map((field, i) => (
                    <Card key={i} className="bg-bg-secondary">
                        <CardContent className="pt-4">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 font-mono text-xs">
                                        {field.hex}
                                    </span>
                                    <span className="font-bold text-sm">{field.name}</span>
                                </div>
                                {field.required && (
                                    <span className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs">
                                        Required
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-text-secondary mb-2">{field.desc}</p>
                            <p className="text-xs text-text-muted">
                                <strong>Format:</strong> {field.format}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <h2>The TX_MODIFIABLE Flags</h2>

            <p>
                One of PSBTv2's most powerful features is the modifiable flags. These bits indicate
                what operations are still allowed on the PSBT:
            </p>

            <div className="not-prose my-8">
                <Card className="bg-bg-secondary">
                    <CardContent className="pt-6">
                        <ModifiableFlagsVisual />
                    </CardContent>
                </Card>
            </div>

            <Callout type="warning" title="Signature Implications">
                <p>
                    When a signer adds a signature, they must update these flags:
                </p>
                <ul>
                    <li>If signature doesn't use SIGHASH_ANYONECANPAY → Clear "Inputs Modifiable"</li>
                    <li>If signature doesn't use SIGHASH_NONE → Clear "Outputs Modifiable"</li>
                    <li>If signature uses SIGHASH_SINGLE → Set "Has SIGHASH_SINGLE"</li>
                </ul>
            </Callout>

            <h2>New Input Fields</h2>

            <CodePlayground
                title="PSBTv2 Input Map Fields"
                initialCode={`console.log("=== PSBTv2 Input Map Fields ===\\n");

console.log("New fields that define the input (replacing UNSIGNED_TX):\\n");

const inputFields = {
  "PSBT_IN_PREVIOUS_TXID (0x0e)": {
    desc: "32-byte txid of the UTXO being spent",
    format: "32 bytes, internal byte order",
    example: "71 0e a7 6a b4 5c 5c b6 43 8e 60 7e 59 cc 03 76..."
  },
  "PSBT_IN_OUTPUT_INDEX (0x0f)": {
    desc: "Index of the output in previous tx",
    format: "4-byte unsigned integer",
    example: "01 00 00 00 (output 1)"
  },
  "PSBT_IN_SEQUENCE (0x10)": {
    desc: "Sequence number for this input",
    format: "4-byte unsigned integer",
    example: "ff ff ff ff (0xffffffff = final)"
  },
  "PSBT_IN_REQUIRED_TIME_LOCKTIME (0x11)": {
    desc: "Minimum Unix time for this input",
    format: "4-byte unsigned integer",
    note: "If set, tx locktime must be ≥ this value"
  },
  "PSBT_IN_IN_REQUIRED_HEIGHT_LOCKTIME (0x12)": {
desc: "Minimum block height for this input",
format: "4-byte unsigned integer",
note: "If set, tx locktime must be ≥ this value"
}
};for (const [name, info] of Object.entries(inputFields)) {
console.log(name);
console.log("  Description:", info.desc);
console.log("  Format:", info.format);
if (info.example) console.log("  Example:", info.example);
if (info.note) console.log("  Note:", info.note);
console.log("");
}console.log("Key Insight:");
console.log("In PSBTv0, this data was inside PSBT_GLOBAL_UNSIGNED_TX.");
console.log("In PSBTv2, each input is self-contained!");`}
                imports={{ CaravanPSBT }}
                height="480px"
            />
            <h2>The Constructor Role</h2>
            <p>
                PSBTv2 introduces a new role: the <strong>Constructor</strong>. This role can
                dynamically add or remove inputs and outputs, subject to the modifiable flags:
            </p>
            <div className="not-prose my-8">
                <Card className="bg-bg-secondary">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings size={20} className="text-primary" />
                            Interactive Constructor Demo
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ConstructorRoleVisual />
                    </CardContent>
                </Card>
            </div>
            <h2>Locktime Determination</h2>
            <p>
                PSBTv2 has sophisticated locktime handling. The final locktime is computed from
                multiple sources:
            </p>
            <CodePlayground
                title="PSBTv2 Locktime Algorithm"
                initialCode={`console.log("=== PSBTv2 Locktime Determination ===\\n");
                    console.log("Algorithm:");
console.log("1. Check all inputs for REQUIRED_TIME_LOCKTIME");
console.log("   and REQUIRED_HEIGHT_LOCKTIME fields");
console.log("");
console.log("2. If NO inputs have either field:");
console.log("   → Use PSBT_GLOBAL_FALLBACK_LOCKTIME");
console.log("   → If not present, locktime = 0");
console.log("");
console.log("3. If inputs have locktime requirements:");
console.log("   → Find which type ALL inputs support");
console.log("   → If both possible, prefer HEIGHT over TIME");
console.log("   → Use the MAXIMUM value among inputs");
console.log("");
// Example
console.log("Example:");
console.log("  Input 0: REQUIRED_HEIGHT = 800000");
console.log("  Input 1: REQUIRED_HEIGHT = 800500");
console.log("  Input 2: REQUIRED_TIME   = 1700000000");
console.log("");
console.log("  Result: All inputs support height, max = 800500");
console.log("  Final locktime: 800500");
console.log("");
console.log("Why HEIGHT over TIME?");
console.log("Bitcoin's native time unit is blocks, so height");
console.log("locktimes are preferred for consistency.");`}
                imports={{ CaravanPSBT }}
                height="420px"
            />
            <h2>Converting Between Versions</h2>

            <p>
                Caravan supports converting between PSBTv0 and PSBTv2. Here's how it works:
            </p>

            <CodePlayground
                title="Version Conversion"
                initialCode={`console.log("=== PSBT Version Conversion ===\\n");
                    console.log("PSBTv0 → PSBTv2:");
console.log("1. Extract unsigned tx from PSBT_GLOBAL_UNSIGNED_TX");
console.log("2. Set PSBT_GLOBAL_TX_VERSION from tx version");
console.log("3. Set PSBT_GLOBAL_FALLBACK_LOCKTIME from tx locktime");
console.log("4. For each input:");
console.log("   - Set PSBT_IN_PREVIOUS_TXID from tx input");
console.log("   - Set PSBT_IN_OUTPUT_INDEX from tx input");
console.log("   - Set PSBT_IN_SEQUENCE from tx input");
console.log("5. For each output:");
console.log("   - Set PSBT_OUT_AMOUNT from tx output");
console.log("   - Set PSBT_OUT_SCRIPT from tx output");
console.log("6. Remove PSBT_GLOBAL_UNSIGNED_TX");
console.log("7. Set PSBT_GLOBAL_VERSION = 2");
console.log("");
console.log("PSBTv2 → PSBTv0:");
console.log("1. Construct unsigned transaction from v2 fields:");
console.log("   - Version from PSBT_GLOBAL_TX_VERSION");
console.log("   - Locktime computed per locktime rules");
console.log("   - Inputs from PSBT_IN_* fields");
console.log("   - Outputs from PSBT_OUT_* fields");
console.log("2. Set PSBT_GLOBAL_UNSIGNED_TX = constructed tx");
console.log("3. Remove v2-only global fields");
console.log("4. Remove v2-only input/output fields");
console.log("5. Set PSBT_GLOBAL_VERSION = 0 (or omit)");
console.log("");
console.log("⚠️ Note: Some v2 features may be lost in conversion!");`}
                imports={{ CaravanPSBT }}
                height="480px"
            />
            <h2>PSBTv2 in Caravan</h2>

            <Callout type="tip" title="Caravan's Implementation">
                <p>
                    Caravan uses PSBTv2 internally via the <code>@caravan/psbt</code> package.
                    Key features include:
                </p>
                <ul>
                    <li>Automatic conversion from PSBTv0 when you paste a v0 PSBT</li>
                    <li>Role validation to ensure proper PSBT lifecycle</li>
                    <li>Readiness checks (<code>isReadyForSigner</code>, etc.)</li>
                    <li>Export to PSBTv0 for hardware wallet compatibility</li>
                </ul>
            </Callout>

            <div className="not-prose my-8 grid md:grid-cols-2 gap-4">
                <Card className="border-green-500/30">
                    <CardHeader>
                        <CardTitle className="text-green-400 flex items-center gap-2">
                            <CheckCircle2 size={20} />
                            PSBTv2 Advantages
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-text-secondary">
                        <div>✓ Dynamic transaction construction</div>
                        <div>✓ Self-contained input/output maps</div>
                        <div>✓ Better locktime support</div>
                        <div>✓ Modifiable flags for coordination</div>
                        <div>✓ Essential for CoinJoin/PayJoin</div>
                    </CardContent>
                </Card>

                <Card className="border-yellow-500/30">
                    <CardHeader>
                        <CardTitle className="text-yellow-400 flex items-center gap-2">
                            <Zap size={20} />
                            Compatibility Notes
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-text-secondary">
                        <div>⚠️ Not all hardware wallets support v2 yet</div>
                        <div>⚠️ Some software may need v0 format</div>
                        <div>⚠️ Version downgrade may lose some features</div>
                        <div>✓ Caravan handles conversion automatically</div>
                    </CardContent>
                </Card>
            </div>

            <PageNavigation
                prev={{ href: '/learn/psbt/bip174', label: 'BIP-174: PSBTv0' }}
                next={{ href: '/learn/psbt/explorer', label: 'PSBT Explorer Tool' }}
            />
        </div>
    );
}