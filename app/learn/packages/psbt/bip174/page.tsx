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
    Layers
} from 'lucide-react';

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
    }>;
    color: string;
}) => {
    const [expanded, setExpanded] = useState<string | null>(null);

    return (
        <div className="border rounded-xl overflow-hidden" style={{ borderColor: `${color}30` }}>
            <div
                className="px-4 py-3 font-bold flex items-center gap-2"
                style={{ backgroundColor: `${color}15`, color }}
            >
                {title === 'Global' && <Globe size={18} />}
                {title === 'Input' && <ArrowDownToLine size={18} />}
                {title === 'Output' && <ArrowUpFromLine size={18} />}
                {title} Map Key Types
            </div>
            <div className="divide-y divide-border">
                {keyTypes.map((kt) => (
                    <div key={kt.type}>
                        <button
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-bg-tertiary transition-colors text-left"
                            onClick={() => setExpanded(expanded === kt.type ? null : kt.type)}
                        >
                            <div className="flex items-center gap-3">
                                <span
                                    className="px-2 py-1 rounded font-mono text-xs"
                                    style={{ backgroundColor: `${color}20`, color }}
                                >
                                    {kt.keyHex}
                                </span>
                                <span className="font-semibold text-sm">{kt.name}</span>
                            </div>
                            {expanded === kt.type ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                        <AnimatePresence>
                            {expanded === kt.type && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-4 py-3 bg-bg-tertiary space-y-2">
                                        <p className="text-sm text-text-secondary">{kt.description}</p>
                                        <div className="text-xs">
                                            <span className="text-text-muted">Value Format: </span>
                                            <span className="font-mono text-primary">{kt.valueFormat}</span>
                                        </div>
                                        {kt.example && (
                                            <div className="p-2 bg-bg-secondary rounded font-mono text-xs text-text-muted break-all">
                                                {kt.example}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Binary Format Visualizer
const BinaryFormatVisual = () => {
    const [hoveredByte, setHoveredByte] = useState<number | null>(null);

    const bytes = [
        { hex: '70', char: 'p', desc: 'Magic byte 1' },
        { hex: '73', char: 's', desc: 'Magic byte 2' },
        { hex: '62', char: 'b', desc: 'Magic byte 3' },
        { hex: '74', char: 't', desc: 'Magic byte 4' },
        { hex: 'ff', char: '∅', desc: 'Separator' },
        { hex: '01', char: '', desc: 'Key length' },
        { hex: '00', char: '', desc: 'Key type: UNSIGNED_TX' },
        { hex: 'fd', char: '', desc: 'Value length (compact size)' },
        { hex: '...', char: '', desc: 'Unsigned transaction data' },
    ];

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-1 justify-center">
                {bytes.map((byte, i) => (
                    <motion.div
                        key={i}
                        className="relative"
                        onMouseEnter={() => setHoveredByte(i)}
                        onMouseLeave={() => setHoveredByte(null)}
                        whileHover={{ scale: 1.1, y: -4 }}
                    >
                        <div
                            className={`
                                w-12 h-12 rounded-lg flex flex-col items-center justify-center
                                font-mono text-sm border-2 transition-colors cursor-pointer
                                ${i < 5 ? 'bg-primary/20 border-primary/50' : 'bg-blue-500/20 border-blue-500/50'}
                            `}
                        >
                            <span className="font-bold">{byte.hex}</span>
                            {byte.char && <span className="text-xs text-text-muted">{byte.char}</span>}
                        </div>
                        <AnimatePresence>
                            {hoveredByte === i && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 
                                               px-3 py-2 bg-bg-card border border-border rounded-lg 
                                               shadow-lg whitespace-nowrap z-10 text-xs"
                                >
                                    {byte.desc}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
            <div className="flex justify-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-primary/20 border border-primary/50" />
                    <span className="text-text-muted">Magic Header</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-500/20 border border-blue-500/50" />
                    <span className="text-text-muted">Key-Value Data</span>
                </div>
            </div>
        </div>
    );
};

// PSBT Lifecycle Animation
const PSBTLifecycleAnimation = () => {
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            title: "1. Create",
            desc: "Initialize with unsigned transaction",
            code: `// Creator initializes PSBT
const unsignedTx = createTransaction(inputs, outputs);
const psbt = new PSBT();
psbt.setUnsignedTx(unsignedTx);`,
            visual: (
                <div className="flex items-center justify-center gap-4">
                    <div className="p-3 bg-bg-tertiary rounded border">Inputs</div>
                    <span>+</span>
                    <div className="p-3 bg-bg-tertiary rounded border">Outputs</div>
                    <span>=</span>
                    <div className="p-3 bg-green-500/20 rounded border border-green-500/50">
                        Empty PSBT
                    </div>
                </div>
            )
        },
        {
            title: "2. Update",
            desc: "Add UTXO info, scripts, derivation paths",
            code: `// Updater adds signing information
psbt.addWitnessUtxo(0, utxoData);
psbt.addBip32Derivation(0, {
  masterFingerprint: "a1b2c3d4",
  path: "m/48'/0'/0'/2'/0/0",
  pubkey: publicKey
});`,
            visual: (
                <div className="space-y-2">
                    <div className="p-2 bg-blue-500/20 rounded border border-blue-500/50 text-xs">
                        + Witness UTXO
                    </div>
                    <div className="p-2 bg-blue-500/20 rounded border border-blue-500/50 text-xs">
                        + BIP32 Derivation
                    </div>
                    <div className="p-2 bg-blue-500/20 rounded border border-blue-500/50 text-xs">
                        + Witness Script
                    </div>
                </div>
            )
        },
        {
            title: "3. Sign",
            desc: "Each signer adds their partial signature",
            code: `// Signer verifies and signs
psbt.signInput(0, keyPair);
// Signature is added as partial sig
// PSBT_IN_PARTIAL_SIG: pubkey → signature`,
            visual: (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Key size={16} className="text-primary" />
                        <span className="text-xs">Signer 1 → sig₁</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Key size={16} className="text-primary" />
                        <span className="text-xs">Signer 2 → sig₂</span>
                    </div>
                </div>
            )
        },
        {
            title: "4. Combine",
            desc: "Merge PSBTs with signatures",
            code: `// Combiner merges partial signatures
const combined = PSBT.combine([
  psbtWithSig1,
  psbtWithSig2
]);`,
            visual: (
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-500/20 rounded border border-purple-500/50 text-xs">
                        PSBT + sig₁
                    </div>
                    <span>+</span>
                    <div className="p-2 bg-purple-500/20 rounded border border-purple-500/50 text-xs">
                        PSBT + sig₂
                    </div>
                </div>
            )
        },
        {
            title: "5. Finalize",
            desc: "Construct final scriptSig/witness",
            code: `// Finalizer constructs final scripts
psbt.finalizeInput(0);
// Creates scriptWitness with all signatures
// Removes signing metadata`,
            visual: (
                <div className="p-3 bg-cyan-500/20 rounded border border-cyan-500/50">
                    <div className="text-xs mb-1">Final Witness:</div>
                    <div className="font-mono text-xs">
                        OP_0 &lt;sig₁&gt; &lt;sig₂&gt; &lt;script&gt;
                    </div>
                </div>
            )
        },
        {
            title: "6. Extract",
            desc: "Get broadcastable transaction",
            code: `// Extractor produces final tx
const finalTx = psbt.extractTransaction();
// Ready to broadcast!
await broadcast(finalTx.toHex());`,
            visual: (
                <div className="p-3 bg-green-500/20 rounded border border-green-500/50 text-center">
                    <div className="text-lg mb-1">🎉</div>
                    <div className="text-xs font-semibold text-green-400">
                        Broadcastable Transaction
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            {/* Step buttons */}
            <div className="flex flex-wrap justify-center gap-2">
                {steps.map((step, i) => (
                    <Button
                        key={i}
                        variant={activeStep === i ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveStep(i)}
                        className={activeStep === i ? "bg-primary" : ""}
                    >
                        {step.title}
                    </Button>
                ))}
            </div>

            {/* Active step content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="grid md:grid-cols-2 gap-4"
                >
                    <Card className="bg-bg-secondary">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{steps[activeStep].title}</CardTitle>
                            <p className="text-sm text-text-muted">{steps[activeStep].desc}</p>
                        </CardHeader>
                        <CardContent>
                            <pre className="text-xs bg-bg-tertiary p-3 rounded overflow-x-auto">
                                <code>{steps[activeStep].code}</code>
                            </pre>
                        </CardContent>
                    </Card>

                    <Card className="bg-bg-secondary">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Visual</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center min-h-[120px]">
                            {steps[activeStep].visual}
                        </CardContent>
                    </Card>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default function BIP174Page() {
    const globalKeyTypes = [
        {
            type: 'PSBT_GLOBAL_UNSIGNED_TX',
            keyHex: '0x00',
            name: 'Unsigned Transaction',
            description: 'The unsigned transaction that this PSBT represents. Required in PSBTv0.',
            valueFormat: 'Complete serialized transaction without scriptSig or witness data',
            example: '020000000101...(serialized tx)'
        },
        {
            type: 'PSBT_GLOBAL_XPUB',
            keyHex: '0x01',
            name: 'Extended Public Key',
            description: 'Extended public keys used in the transaction, with their derivation paths.',
            valueFormat: '4-byte fingerprint + derivation path',
            example: 'xpub6CpGH79LXVk... → a1b2c3d4/48\'/0\'/0\'/2\''
        },
        {
            type: 'PSBT_GLOBAL_VERSION',
            keyHex: '0xfb',
            name: 'PSBT Version',
            description: 'The version number of this PSBT. If omitted, version 0 is assumed.',
            valueFormat: '4-byte unsigned little-endian integer',
            example: '00000000 (version 0)'
        },
        {
            type: 'PSBT_GLOBAL_PROPRIETARY',
            keyHex: '0xfc',
            name: 'Proprietary Data',
            description: 'Application-specific data. The key includes an identifier prefix.',
            valueFormat: 'Identifier + subtype + custom data',
            example: 'CARAVAN + 0x01 + custom_metadata'
        }
    ];

    const inputKeyTypes = [
        {
            type: 'PSBT_IN_NON_WITNESS_UTXO',
            keyHex: '0x00',
            name: 'Non-Witness UTXO',
            description: 'The full previous transaction being spent. Used for non-segwit inputs.',
            valueFormat: 'Complete serialized transaction',
        },
        {
            type: 'PSBT_IN_WITNESS_UTXO',
            keyHex: '0x01',
            name: 'Witness UTXO',
            description: 'The output being spent. Used for segwit inputs (more efficient than full tx).',
            valueFormat: '8-byte value (little-endian) + scriptPubKey',
            example: '00e1f50500000000 + 16001433b982f91b28f160...'
        },
        {
            type: 'PSBT_IN_PARTIAL_SIG',
            keyHex: '0x02',
            name: 'Partial Signature',
            description: 'A signature for this input. Key contains the pubkey, value contains signature.',
            valueFormat: 'DER-encoded signature + sighash type byte',
        },
        {
            type: 'PSBT_IN_SIGHASH_TYPE',
            keyHex: '0x03',
            name: 'Sighash Type',
            description: 'The sighash type to use for this input.',
            valueFormat: '4-byte unsigned little-endian integer',
            example: '01000000 (SIGHASH_ALL)'
        },
        {
            type: 'PSBT_IN_REDEEM_SCRIPT',
            keyHex: '0x04',
            name: 'Redeem Script',
            description: 'The redeem script for P2SH inputs.',
            valueFormat: 'Serialized script',
        },
        {
            type: 'PSBT_IN_WITNESS_SCRIPT',
            keyHex: '0x05',
            name: 'Witness Script',
            description: 'The witness script for P2WSH or P2SH-P2WSH inputs.',
            valueFormat: 'Serialized script',
            example: '5221...53ae (2-of-3 multisig)'
        },
        {
            type: 'PSBT_IN_BIP32_DERIVATION',
            keyHex: '0x06',
            name: 'BIP32 Derivation',
            description: 'The derivation path for a public key used in this input.',
            valueFormat: '4-byte fingerprint + derivation path indices',
            example: '27569c50/49\'/0\'/0\'/0/1'
        },
        {
            type: 'PSBT_IN_FINAL_SCRIPTSIG',
            keyHex: '0x07',
            name: 'Final ScriptSig',
            description: 'The finalized scriptSig for this input (after finalization).',
            valueFormat: 'Serialized scriptSig',
        },
        {
            type: 'PSBT_IN_FINAL_SCRIPTWITNESS',
            keyHex: '0x08',
            name: 'Final Script Witness',
            description: 'The finalized witness data for this input (after finalization).',
            valueFormat: 'Serialized witness stack',
        }
    ];

    const outputKeyTypes = [
        {
            type: 'PSBT_OUT_REDEEM_SCRIPT',
            keyHex: '0x00',
            name: 'Redeem Script',
            description: 'The redeem script for P2SH outputs (e.g., for change outputs).',
            valueFormat: 'Serialized script',
        },
        {
            type: 'PSBT_OUT_WITNESS_SCRIPT',
            keyHex: '0x01',
            name: 'Witness Script',
            description: 'The witness script for P2WSH outputs.',
            valueFormat: 'Serialized script',
        },
        {
            type: 'PSBT_OUT_BIP32_DERIVATION',
            keyHex: '0x02',
            name: 'BIP32 Derivation',
            description: 'The derivation path for a public key in this output (for change detection).',
            valueFormat: '4-byte fingerprint + derivation path indices',
            example: '27569c50/49\'/0\'/0\'/0/4'
        }
    ];

    return (
        <div className="prose prose-invert max-w-none">
            <div className="not-prose mb-8">
                <div className="inline-block px-3 py-1 rounded-full bg-pkg-psbt/20 text-pkg-psbt text-sm font-medium mb-4">
                    BIP-174
                </div>
                <h1 className="text-5xl font-bold mb-4">PSBTv0: The Original Specification</h1>
                <p className="text-xl text-text-secondary">
                    A comprehensive guide to BIP-174 - the foundational PSBT format that
                    revolutionized Bitcoin transaction coordination.
                </p>
            </div>

            <Callout type="info" title="BIP-174 Overview">
                <p>
                    BIP-174 was authored by <strong>Andrew Chow</strong> and introduced in 2017.
                    It defines a binary format for partially signed transactions, enabling
                    multiple parties to collaborate on creating and signing Bitcoin transactions
                    without exposing private keys.
                </p>
            </Callout>

            <h2>Binary Format Structure</h2>

            <p>
                PSBTs use a compact binary format consisting of magic bytes followed by
                key-value maps. Each map is terminated by a <code>0x00</code> byte:
            </p>

            <div className="not-prose my-8">
                <Card className="bg-bg-secondary">
                    <CardContent className="pt-6">
                        <BinaryFormatVisual />
                    </CardContent>
                </Card>
            </div>

            <CodePlayground
                title="PSBT Format Grammar"
                initialCode={`console.log("=== PSBT Binary Format (BIP-174) ===\\n");

console.log("Grammar:");
console.log("  <psbt>       := <magic> <global-map> <input-map>* <output-map>*");
console.log("  <magic>      := 0x70 0x73 0x62 0x74 0xFF  ('psbt' + separator)");
console.log("  <*-map>      := <keypair>* 0x00");
console.log("  <keypair>    := <key> <value>");
console.log("  <key>        := <keylen> <keytype> <keydata>");
console.log("  <value>      := <valuelen> <valuedata>\\n");

console.log("Key Points:");
console.log("• Magic bytes 'psbt\\xff' identify the format");
console.log("• Each map ends with a 0x00 separator");
console.log("• Lengths use Bitcoin's compact size encoding");
console.log("• Keys must be unique within each map");
console.log("• Unknown keys must be preserved (forward compatibility)\\n");

console.log("Compact Size Encoding:");
console.log("  0x00-0xFC    → 1 byte");
console.log("  0xFD-0xFFFF  → 0xFD + 2 bytes");
console.log("  0x10000-...  → 0xFE + 4 bytes");`}
                imports={{ CaravanPSBT }}
                height="400px"
            />

            <h2>Key-Value Maps Reference</h2>

            <p>
                BIP-174 defines three types of maps: Global (one per PSBT), Input (one per input),
                and Output (one per output). Each has specific key types:
            </p>

            <div className="not-prose my-8 space-y-6">
                <KeyValueExplorer
                    title="Global"
                    keyTypes={globalKeyTypes}
                    color="#22c55e"
                />
                <KeyValueExplorer
                    title="Input"
                    keyTypes={inputKeyTypes}
                    color="#3b82f6"
                />
                <KeyValueExplorer
                    title="Output"
                    keyTypes={outputKeyTypes}
                    color="#a855f7"
                />
            </div>

            <h2>PSBT Lifecycle</h2>

            <p>
                A PSBT goes through several stages, each handled by specific roles.
                Click through each stage to see how the PSBT transforms:
            </p>

            <div className="not-prose my-8">
                <Card className="bg-bg-secondary">
                    <CardContent className="pt-6">
                        <PSBTLifecycleAnimation />
                    </CardContent>
                </Card>
            </div>

            <h2>Example: Decoding a Real PSBTv0</h2>

            <CodePlayground
                title="PSBTv0 Example Analysis"
                initialCode={`// Example PSBTv0 (simplified for demonstration)
const psbtBase64 = "cHNidP8B+wQCAAAAAQIEAQAAAAEEAQIBBQECAQMEAAAAAAEGAQBPAQSIsh4DnlMMrIAAAAA9vIpcl2nwMbF+d/6hUYYDIhoY/RjyuaVMbIwax1y8NQLyMFhLFV0cfxzUUSCmU8SNZQtDG2fFssE/J9cUIDfBaRAnVpxQMQAAgAAAAIAAAACAAAEOIHEOp2q0XFy2Q45gflnMA3YmmBgFrp4N/ZCJASq7C+U1AQ8EAQAAAAEQBP////8BAR8A4fUFAAAAABYAFDO5gvkbKPFgySC0q5XljOUN2jpKIgYDMJaA8zx9446mpHzU7NZvH1pJdHxv+4gI7QkDkkPjrVwYJ1acUDEAAIAAAACAAAAAgAAAAAABAAAA";

console.log("=== PSBTv0 Structure Analysis ===\\n");

// Decode base64 to see the bytes
const bytes = atob(psbtBase64);
const hexString = Array.from(bytes)
  .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
  .join(' ');

console.log("First bytes (magic):");
console.log("  70 73 62 74 ff = 'psbt' + 0xff separator\\n");

console.log("Key observations:");
console.log("• This is a PSBTv0 (PSBT_GLOBAL_UNSIGNED_TX present)");
console.log("• Contains global xpub information");
console.log("• Has witness UTXO data for segwit spending");
console.log("• Includes BIP32 derivation paths for signing\\n");

console.log("Fields present:");
console.log("├─ Global Map");
console.log("│  ├─ PSBT_GLOBAL_UNSIGNED_TX (0x00)");
console.log("│  └─ PSBT_GLOBAL_XPUB (0x01)");
console.log("├─ Input Map #0");
console.log("│  ├─ PSBT_IN_WITNESS_UTXO (0x01)");
console.log("│  ├─ PSBT_IN_BIP32_DERIVATION (0x06)");
console.log("│  └─ PSBT_IN_PARTIAL_SIG (0x02) - if signed");
console.log("└─ Output Map #0");
console.log("   └─ PSBT_OUT_BIP32_DERIVATION (0x02)\\n");

console.log("Total length:", bytes.length, "bytes");`}
                imports={{ CaravanPSBT }}
                height="480px"
            />

            <h2>Signer Verification Rules</h2>

            <Callout type="warning" title="Critical Security Checks">
                <p>
                    Before signing, a Signer MUST verify several conditions to prevent
                    signing malicious transactions. BIP-174 specifies these requirements:
                </p>
            </Callout>

            <div className="not-prose my-8">
                <Card className="bg-bg-secondary">
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {[
                                {
                                    check: "Non-Witness UTXO Verification",
                                    rule: "If PSBT_IN_NON_WITNESS_UTXO is provided, its hash must match the txid in the unsigned transaction's input.",
                                    reason: "Prevents spending a different UTXO than intended"
                                },
                                {
                                    check: "Witness Script Verification",
                                    rule: "If PSBT_IN_WITNESS_SCRIPT is provided, it must hash to match the scriptPubKey or redeemScript.",
                                    reason: "Ensures the witness script controls the funds"
                                },
                                {
                                    check: "Redeem Script Verification",
                                    rule: "If PSBT_IN_REDEEM_SCRIPT is provided, it must hash to match the scriptPubKey.",
                                    reason: "Ensures the redeem script is valid for P2SH"
                                },
                                {
                                    check: "Derivation Path Verification",
                                    rule: "If signing with an HD wallet, verify the derivation path produces the expected public key.",
                                    reason: "Prevents signing with the wrong key"
                                }
                            ].map((item, i) => (
                                <div key={i} className="p-4 bg-bg-tertiary rounded-lg border border-border">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm mb-1">{item.check}</h4>
                                            <p className="text-xs text-text-secondary mb-2">{item.rule}</p>
                                            <p className="text-xs text-text-muted italic">Why: {item.reason}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <h2>PSBTv0 Limitations</h2>

            <p>
                While PSBTv0 revolutionized transaction coordination, it has some limitations
                that led to the development of PSBTv2:
            </p>

            <div className="not-prose my-8 grid md:grid-cols-2 gap-4">
                <Card className="border-red-500/30">
                    <CardContent className="pt-6">
                        <h4 className="font-bold text-red-400 mb-3">Fixed Transaction Structure</h4>
                        <p className="text-sm text-text-secondary">
                            The unsigned transaction is set at creation time. You cannot add
                            new inputs or outputs after the PSBT is created.
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-red-500/30">
                    <CardContent className="pt-6">
                        <h4 className="font-bold text-red-400 mb-3">Inefficient for Hardware Wallets</h4>
                        <p className="text-sm text-text-secondary">
                            Full UTXO data must be included, which can make PSBTs large
                            and slow to process on memory-constrained devices.
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-red-500/30">
                    <CardContent className="pt-6">
                        <h4 className="font-bold text-red-400 mb-3">Locktime Handling</h4>
                        <p className="text-sm text-text-secondary">
                            Limited support for inputs with different locktime requirements.
                            All inputs must use the same locktime.
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-red-500/30">
                    <CardContent className="pt-6">
                        <h4 className="font-bold text-red-400 mb-3">Data Duplication</h4>
                        <p className="text-sm text-text-secondary">
                            Input information is split between the unsigned transaction
                            and the input maps, leading to redundancy.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Callout type="tip" title="Next: PSBTv2">
                <p>
                    BIP-370 (PSBTv2) addresses these limitations by allowing dynamic
                    transaction construction and better locktime support. Continue to
                    the next section to learn about the enhanced format.
                </p>
            </Callout>

            <PageNavigation
                prev={{ href: '/learn/psbt', label: 'PSBT Introduction' }}
                next={{ href: '/learn/psbt/bip370', label: 'BIP-370: PSBTv2' }}
            />
        </div>
    );
}