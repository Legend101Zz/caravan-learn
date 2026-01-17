/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
/* eslint-disable react/no-unescaped-entities */
'use client';

import { CodePlayground } from '@/components/interactive/code-playground';
import { Callout } from '@/components/content/callout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageNavigation } from '@/components/layout/page-navigation';
import Link from 'next/link';
import { ArrowRight, FileText, Users, Lock, Layers } from 'lucide-react';
import * as CaravanPSBT from '@caravan/psbt';

export default function PSBTPackagePage() {
    return (
        <div className="prose prose-invert max-w-none">
            <div className="not-prose mb-8">
                <div className="inline-block px-3 py-1 rounded-full bg-pkg-psbt/20 text-pkg-psbt text-sm font-medium mb-4">
                    @caravan/psbt
                </div>
                <h1 className="text-5xl font-bold mb-4">Caravan PSBT Package</h1>
                <p className="text-xl text-text-secondary">
                    Work with Partially Signed Bitcoin Transactions - the standard for multisig coordination
                </p>
            </div>

            <h2>What is @caravan/psbt?</h2>

            <p>
                <code>@caravan/psbt</code> provides utilities for working with Partially Signed Bitcoin
                Transactions (PSBTs), the industry standard for coordinating multisig transactions. It
                implements BIP174 and supports both PSBTv0 and PSBTv2.
            </p>

            <div className="not-prose my-8">
                <Card className="bg-gradient-to-br from-pkg-psbt/10 to-pkg-wallets/10 border-pkg-psbt/30">
                    <CardContent className="pt-6">
                        <div className="text-center mb-6">
                            <div className="text-6xl mb-4">📜</div>
                            <h3 className="text-2xl font-bold text-pkg-psbt mb-2">The Multisig Glue</h3>
                            <p className="text-text-secondary max-w-2xl mx-auto">
                                PSBTs are how different parties coordinate to sign a multisig transaction.
                                Think of it as a partially completed form that gets passed around until
                                everyone has signed.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <h2>Why PSBTs Matter</h2>

            <div className="not-prose my-8 grid md:grid-cols-2 gap-6">
                <Card className="border-pkg-psbt/30">
                    <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-pkg-psbt/10 flex items-center justify-center mb-3">
                            <Users className="text-pkg-psbt" size={24} />
                        </div>
                        <CardTitle className="text-lg">Coordination</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-text-secondary space-y-2">
                        <p>PSBTs enable multiple parties to collaborate on a transaction:</p>
                        <ul className="space-y-1 text-xs">
                            <li>• One person creates the transaction</li>
                            <li>• Each signer adds their signature</li>
                            <li>• Final person broadcasts to network</li>
                            <li>• No single party has complete control</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-pkg-wallets/30">
                    <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-pkg-wallets/10 flex items-center justify-center mb-3">
                            <Lock className="text-pkg-wallets" size={24} />
                        </div>
                        <CardTitle className="text-lg">Hardware Wallet Support</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-text-secondary space-y-2">
                        <p>Hardware wallets love PSBTs:</p>
                        <ul className="space-y-1 text-xs">
                            <li>• Standard format all wallets understand</li>
                            <li>• Can verify transaction details</li>
                            <li>• Sign without exposing keys</li>
                            <li>• Works offline for air-gapped security</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-primary/30">
                    <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                            <Layers className="text-primary" size={24} />
                        </div>
                        <CardTitle className="text-lg">Flexibility</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-text-secondary space-y-2">
                        <p>PSBTs are incredibly flexible:</p>
                        <ul className="space-y-1 text-xs">
                            <li>• Add signatures in any order</li>
                            <li>• Combine multiple PSBTs</li>
                            <li>• Support complex scripts</li>
                            <li>• Works with any Bitcoin transaction</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-pkg-multisig/30">
                    <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-pkg-multisig/10 flex items-center justify-center mb-3">
                            <FileText className="text-pkg-multisig" size={24} />
                        </div>
                        <CardTitle className="text-lg">Standardized</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-text-secondary space-y-2">
                        <p>Industry-wide standard:</p>
                        <ul className="space-y-1 text-xs">
                            <li>• BIP174 specification</li>
                            <li>• Supported by all major wallets</li>
                            <li>• Interoperable between platforms</li>
                            <li>• Future-proof</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <h2>PSBT Lifecycle</h2>

            <div className="not-prose my-8">
                <Card className="bg-bg-secondary">
                    <CardHeader>
                        <CardTitle>The PSBT Journey (BIP174 Roles)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">
                                    1
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold mb-1">Creator</div>
                                    <div className="text-sm text-text-secondary">
                                        Creates an unsigned PSBT with inputs and outputs
                                    </div>
                                    <div className="mt-2 p-2 bg-bg-tertiary rounded text-xs font-mono">
                                        createPSBT(inputs, outputs) → PSBT
                                    </div>
                                </div>
                            </div>

                            <div className="ml-6 border-l-2 border-border h-8" />

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-pkg-psbt/20 flex items-center justify-center text-pkg-psbt font-bold flex-shrink-0">
                                    2
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold mb-1">Updater</div>
                                    <div className="text-sm text-text-secondary">
                                        Adds additional information (UTXOs, derivation paths, scripts)
                                    </div>
                                    <div className="mt-2 p-2 bg-bg-tertiary rounded text-xs font-mono">
                                        updatePSBT(psbt, utxoData) → Updated PSBT
                                    </div>
                                </div>
                            </div>

                            <div className="ml-6 border-l-2 border-border h-8" />

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-pkg-wallets/20 flex items-center justify-center text-pkg-wallets font-bold flex-shrink-0">
                                    3
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold mb-1">Signer(s)</div>
                                    <div className="text-sm text-text-secondary">
                                        Each required party adds their signature (can happen in parallel)
                                    </div>
                                    <div className="mt-2 p-2 bg-bg-tertiary rounded text-xs font-mono">
                                        signPSBT(psbt, privateKey) → Partially Signed PSBT
                                    </div>
                                </div>
                            </div>

                            <div className="ml-6 border-l-2 border-border h-8" />

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-pkg-multisig/20 flex items-center justify-center text-pkg-multisig font-bold flex-shrink-0">
                                    4
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold mb-1">Combiner</div>
                                    <div className="text-sm text-text-secondary">
                                        Combines multiple partially signed PSBTs into one
                                    </div>
                                    <div className="mt-2 p-2 bg-bg-tertiary rounded text-xs font-mono">
                                        combinePSBTs(psbt1, psbt2, psbt3) → Combined PSBT
                                    </div>
                                </div>
                            </div>

                            <div className="ml-6 border-l-2 border-border h-8" />

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-pkg-clients/20 flex items-center justify-center text-pkg-clients font-bold flex-shrink-0">
                                    5
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold mb-1">Finalizer</div>
                                    <div className="text-sm text-text-secondary">
                                        Converts signatures into final scriptSig/scriptWitness
                                    </div>
                                    <div className="mt-2 p-2 bg-bg-tertiary rounded text-xs font-mono">
                                        finalizePSBT(psbt) → Finalized PSBT
                                    </div>
                                </div>
                            </div>

                            <div className="ml-6 border-l-2 border-border h-8" />

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-green-600/20 flex items-center justify-center text-green-400 font-bold flex-shrink-0">
                                    6
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold mb-1">Extractor</div>
                                    <div className="text-sm text-text-secondary">
                                        Extracts the final, broadcastable Bitcoin transaction
                                    </div>
                                    <div className="mt-2 p-2 bg-bg-tertiary rounded text-xs font-mono">
                                        extractTransaction(psbt) → Bitcoin Transaction
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Callout type="info" title="BIP174 Roles">
                <p>
                    Each step in the PSBT lifecycle has a defined role. A single application can perform
                    multiple roles. For example, Caravan acts as Creator, Updater, Combiner, Finalizer,
                    and Extractor - while hardware wallets act as Signers.
                </p>
            </Callout>

            <h2>Installation</h2>

            <div className="not-prose my-6">
                <Card className="bg-bg-secondary">
                    <CardContent className="pt-6">
                        <pre className="bg-bg-tertiary p-4 rounded-lg overflow-x-auto">
                            <code className="text-sm text-pkg-psbt">npm install @caravan/psbt</code>
                        </pre>
                    </CardContent>
                </Card>
            </div>

            <h2>Quick Start</h2>

            <CodePlayground
                title="Basic PSBT Operations"
                initialCode={`// Import PSBT utilities
const { 
  Psbt,
  PsbtV2,
  // Note: Full PSBT operations require Bitcoin Core or similar
  // This is a conceptual example
} = CaravanPSBT;

console.log("PSBT Package Overview:\\n");

console.log("Key Features:");
console.log("• Create unsigned PSBTs");
console.log("• Add signatures from multiple parties");
console.log("• Combine partial signatures");
console.log("• Finalize complete transactions");
console.log("• Extract broadcastable transactions");
console.log("");

console.log("Supported Versions:");
console.log("• PSBTv0 (BIP174) - Original standard");
console.log("• PSBTv2 (BIP370) - Enhanced version");
console.log("");

console.log("Use Cases:");
console.log("• Multisig coordination");
console.log("• Hardware wallet integration");
console.log("• CoinJoin transactions");
console.log("• Complex smart contracts");
console.log("");

console.log("✓ Industry standard for Bitcoin transactions!");`}
                imports={{ CaravanPSBT }}
                height="450px"
            />

            <h2>Package Modules</h2>

            <div className="not-prose my-8 space-y-4">
                <Card className="group hover:border-pkg-psbt/50 transition-all cursor-pointer">
                    <Link href="/learn/packages/psbt/structure">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-pkg-psbt/10 flex items-center justify-center group-hover:bg-pkg-psbt/20 transition-colors">
                                        <Layers className="text-pkg-psbt" size={20} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">PSBT Structure</CardTitle>
                                        <CardDescription>Understanding the PSBT format and components</CardDescription>
                                    </div>
                                </div>
                                <ArrowRight className="text-text-muted group-hover:text-pkg-psbt transition-colors" size={20} />
                            </div>
                        </CardHeader>
                    </Link>
                </Card>

                <Card className="group hover:border-pkg-psbt/50 transition-all cursor-pointer">
                    <Link href="/learn/packages/psbt/creating">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-pkg-wallets/10 flex items-center justify-center group-hover:bg-pkg-wallets/20 transition-colors">
                                        <FileText className="text-pkg-wallets" size={20} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Creating PSBTs</CardTitle>
                                        <CardDescription>Build unsigned transactions from inputs and outputs</CardDescription>
                                    </div>
                                </div>
                                <ArrowRight className="text-text-muted group-hover:text-pkg-psbt transition-colors" size={20} />
                            </div>
                        </CardHeader>
                    </Link>
                </Card>

                <Card className="group hover:border-pkg-psbt/50 transition-all cursor-pointer">
                    <Link href="/learn/packages/psbt/signing">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-pkg-multisig/10 flex items-center justify-center group-hover:bg-pkg-multisig/20 transition-colors">
                                        <Lock className="text-pkg-multisig" size={20} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Signing PSBTs</CardTitle>
                                        <CardDescription>Add signatures and coordinate multisig signing</CardDescription>
                                    </div>
                                </div>
                                <ArrowRight className="text-text-muted group-hover:text-pkg-psbt transition-colors" size={20} />
                            </div>
                        </CardHeader>
                    </Link>
                </Card>
            </div>

            <h2>PSBTv0 vs PSBTv2</h2>

            <div className="not-prose my-8 grid md:grid-cols-2 gap-6">
                <Card className="border-pkg-psbt/30">
                    <CardHeader>
                        <CardTitle className="text-lg">PSBTv0 (BIP174)</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3">
                        <div className="p-3 bg-pkg-psbt/10 rounded">
                            <div className="font-semibold text-pkg-psbt mb-2">Original Standard</div>
                            <div className="text-text-secondary text-xs">
                                The first PSBT specification, widely supported
                            </div>
                        </div>
                        <div className="space-y-2 text-xs text-text-secondary">
                            <div className="flex items-center gap-2">
                                <span className="text-green-400">✓</span>
                                <span>Universal wallet support</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-400">✓</span>
                                <span>Battle-tested</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-400">✓</span>
                                <span>Simple and reliable</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-yellow-400">~</span>
                                <span>Limited metadata support</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-pkg-wallets/30">
                    <CardHeader>
                        <CardTitle className="text-lg">PSBTv2 (BIP370)</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3">
                        <div className="p-3 bg-pkg-wallets/10 rounded">
                            <div className="font-semibold text-pkg-wallets mb-2">Enhanced Version</div>
                            <div className="text-text-secondary text-xs">
                                Newer standard with additional features
                            </div>
                        </div>
                        <div className="space-y-2 text-xs text-text-secondary">
                            <div className="flex items-center gap-2">
                                <span className="text-green-400">✓</span>
                                <span>More transaction metadata</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-400">✓</span>
                                <span>Better fee bumping support</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-400">✓</span>
                                <span>Improved validation</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-yellow-400">~</span>
                                <span>Growing wallet support</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Callout type="tip" title="Which Version to Use?">
                <p>
                    <strong>For most applications, use PSBTv0:</strong>
                </p>
                <ul>
                    <li>• Maximum compatibility with hardware wallets</li>
                    <li>• Supported by all major Bitcoin software</li>
                    <li>• Proven and reliable</li>
                </ul>
                <p className="mt-3">
                    <strong>Consider PSBTv2 if you need:</strong>
                </p>
                <ul>
                    <li>• Advanced transaction construction</li>
                    <li>• Complex fee bumping scenarios (RBF/CPFP)</li>
                    <li>• Detailed transaction metadata</li>
                </ul>
            </Callout>

            <h2>Common PSBT Operations</h2>

            <CodePlayground
                title="PSBT Workflow Concepts"
                initialCode={`// Conceptual overview of PSBT operations
// (Full implementation requires transaction building)

console.log("PSBT Workflow:\\n");

console.log("1. CREATE");
console.log("   • Define inputs (UTXOs to spend)");
console.log("   • Define outputs (recipients)");
console.log("   • Create unsigned PSBT");
console.log("");

console.log("2. UPDATE");
console.log("   • Add UTXO information");
console.log("   • Add derivation paths");
console.log("   • Add witness/redeem scripts");
console.log("   • Prepare for signing");
console.log("");

console.log("3. SIGN");
console.log("   • Pass to hardware wallet");
console.log("   • Or sign with software key");
console.log("   • Each signer adds signature");
console.log("   • Can happen in parallel");
console.log("");

console.log("4. COMBINE");
console.log("   • Merge multiple signed PSBTs");
console.log("   • Collect all required signatures");
console.log("   • Verify signature count");
console.log("");

console.log("5. FINALIZE");
console.log("   • Convert to final transaction");
console.log("   • Build scriptSig/scriptWitness");
console.log("   • Ready for broadcast");
console.log("");

console.log("6. EXTRACT & BROADCAST");
console.log("   • Extract Bitcoin transaction");
console.log("   • Broadcast to network");
console.log("   • Transaction confirmed!");`}
                imports={{ CaravanPSBT }}
                height="520px"
            />

            <h2>PSBT Best Practices</h2>

            <div className="not-prose my-6 space-y-4">
                <Card className="border-green-500/30">
                    <CardHeader>
                        <CardTitle className="text-lg">✅ Do's</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-text-secondary space-y-2">
                        <ul className="space-y-2">
                            <li>• <strong>Validate PSBTs</strong> before signing</li>
                            <li>• <strong>Verify transaction details</strong> on hardware wallet screen</li>
                            <li>• <strong>Keep original PSBTs</strong> until transaction confirms</li>
                            <li>• <strong>Use secure channels</strong> to transfer PSBTs between parties</li>
                            <li>• <strong>Check fee rates</strong> before finalizing</li>
                            <li>• <strong>Store signed PSBTs</strong> as backup until broadcast</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-red-500/30">
                    <CardHeader>
                        <CardTitle className="text-lg">❌ Don'ts</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-text-secondary space-y-2">
                        <ul className="space-y-2">
                            <li>• <strong>Don't blindly sign</strong> PSBTs without verification</li>
                            <li>• <strong>Don't share PSBTs</strong> over unsecured channels</li>
                            <li>• <strong>Don't lose the PSBT</strong> before all signatures collected</li>
                            <li>• <strong>Don't modify</strong> finalized PSBTs</li>
                            <li>• <strong>Don't reuse</strong> PSBTs for different transactions</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <h2>Real-World PSBT Flow</h2>

            <div className="not-prose my-8">
                <Card className="bg-bg-secondary border-pkg-psbt/30">
                    <CardHeader>
                        <CardTitle>2-of-3 Multisig Payment Example</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="p-4 bg-primary/10 rounded">
                            <div className="font-semibold text-primary mb-2">Day 1: Alice Creates PSBT</div>
                            <div className="text-text-secondary text-xs space-y-1">
                                <div>• Opens Caravan wallet</div>
                                <div>• Creates transaction: Send 0.1 BTC to client</div>
                                <div>• Selects UTXOs to spend</div>
                                <div>• Generates unsigned PSBT</div>
                                <div>• Saves PSBT file: <code className="text-primary">payment_001.psbt</code></div>
                            </div>
                        </div>

                        <div className="p-4 bg-pkg-wallets/10 rounded">
                            <div className="font-semibold text-pkg-wallets mb-2">Day 2: Bob Signs</div>
                            <div className="text-text-secondary text-xs space-y-1">
                                <div>• Receives PSBT file from Alice</div>
                                <div>• Loads into Caravan</div>
                                <div>• Verifies recipient address on hardware wallet</div>
                                <div>• Signs with Ledger device</div>
                                <div>• Saves signed PSBT: <code className="text-pkg-wallets">payment_001_bob.psbt</code></div>
                                <div>• Sends back to Alice</div>
                            </div>
                        </div>

                        <div className="p-4 bg-pkg-multisig/10 rounded">
                            <div className="font-semibold text-pkg-multisig mb-2">Day 3: Carol Signs</div>
                            <div className="text-text-secondary text-xs space-y-1">
                                <div>• Receives partially signed PSBT</div>
                                <div>• Verifies transaction details</div>
                                <div>• Signs with Trezor device</div>
                                <div>• Now has 2 of 3 required signatures!</div>
                            </div>
                        </div>

                        <div className="p-4 bg-green-950/20 rounded border border-green-500/30">
                            <div className="font-semibold text-green-400 mb-2">Day 3: Alice Finalizes & Broadcasts</div>
                            <div className="text-text-secondary text-xs space-y-1">
                                <div>• Combines all signatures</div>
                                <div>• Finalizes PSBT</div>
                                <div>• Extracts Bitcoin transaction</div>
                                <div>• Broadcasts to network</div>
                                <div>• ✅ Transaction confirmed!</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <h2>Key Takeaways</h2>

            <div className="not-prose my-6">
                <Card className="bg-pkg-psbt/5 border-pkg-psbt/30">
                    <CardContent className="pt-6">
                        <ul className="space-y-3 text-text-secondary">
                            <li className="flex gap-3">
                                <span className="text-pkg-psbt text-xl">✓</span>
                                <span>PSBTs are the standard for multisig coordination</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-pkg-psbt text-xl">✓</span>
                                <span>Follow BIP174 lifecycle: Create → Update → Sign → Combine → Finalize → Extract</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-pkg-psbt text-xl">✓</span>
                                <span>Signatures can be added in any order</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-pkg-psbt text-xl">✓</span>
                                <span>Hardware wallets use PSBTs for secure signing</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-pkg-psbt text-xl">✓</span>
                                <span>Always verify transaction details before signing</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-pkg-psbt text-xl">✓</span>
                                <span>PSBTv0 has better compatibility, PSBTv2 has more features</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <PageNavigation />
        </div>
    );
}