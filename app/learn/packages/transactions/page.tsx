/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    ArrowDown,
    Zap,
    Clock,
    TrendingUp,
    RefreshCw,
    Baby,
    AlertTriangle,
    CheckCircle2,
    Layers,
    Plus,
    Minus,
    Settings,
    Eye,
    Copy,
    Check,
    Play,
    RotateCcw,
    ChevronRight,
    Sparkles,
    Coins,
    Send,
    Package,
    Target,
    Gauge
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Callout } from '@/components/content/callout';
import { CodePlayground } from '@/components/interactive/code-playground';
import { PageNavigation } from '@/components/layout/page-navigation';
import { TransactionFlowBuilder } from '@/components/interactive/transaction-flow-builder';
import { PSBTVisualizer } from '@/components/interactive/psbt-visualizer';
import { FeeStrategyVisualizer } from '@/components/interactive/fee-strategy-visualizer';

// Hand-drawn underline component
const DoodleUnderline = ({ className = "" }: { className?: string }) => (
    <svg
        viewBox="0 0 200 20"
        className={`w-full h-3 absolute -bottom-2 left-0 ${className}`}
        fill="none"
    >
        <motion.path
            d="M 5 10 Q 50 5, 100 10 T 195 10"
            stroke="#EC4899"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
        />
    </svg>
);

export default function FeesPackagePage() {
    return (
        <div className="prose prose-invert max-w-none">
            {/* Hero Section */}
            <div className="not-prose mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative"
                >
                    <div className="inline-block px-4 py-2 rounded-full bg-pkg-fees/20 text-pkg-fees text-sm font-bold mb-4 border-2 border-pkg-fees/50">
                        @caravan/fees
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 relative inline-block">
                        <span className="text-text-primary">Transaction </span>
                        <span className="text-pkg-fees relative">
                            Fees
                            <DoodleUnderline />
                        </span>
                    </h1>
                    <p className="text-xl text-text-secondary max-w-3xl">
                        Master Bitcoin fee management with RBF (Replace-By-Fee) and CPFP (Child-Pays-For-Parent).
                        Learn how to speed up stuck transactions and build fee-efficient transactions.
                    </p>
                </motion.div>
            </div>

            {/* What Are Bitcoin Fees? */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="not-prose mb-16"
            >
                <h2 className="text-3xl font-bold mb-6 text-text-primary flex items-center gap-3">
                    <Coins className="text-pkg-fees" />
                    What Are Bitcoin Fees?
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Card className="bg-bg-secondary border-pkg-fees/30">
                        <CardContent className="pt-6">
                            <div className="text-center mb-6">
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="inline-block"
                                >
                                    <div className="w-24 h-24 rounded-full bg-pkg-fees/20 flex items-center justify-center mx-auto mb-4">
                                        <Gauge className="w-12 h-12 text-pkg-fees" />
                                    </div>
                                </motion.div>
                                <h3 className="text-xl font-bold text-text-primary mb-2">The Bidding System</h3>
                                <p className="text-text-secondary text-sm">
                                    Think of Bitcoin fees like an auction. Every transaction competes
                                    for limited block space. Higher fees = faster confirmation.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-bg-tertiary rounded-lg">
                                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <Zap className="w-4 h-4 text-green-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-text-primary">High Priority</div>
                                        <div className="text-xs text-text-muted">~10+ sats/vB • Next block</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-bg-tertiary rounded-lg">
                                    <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-yellow-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-text-primary">Medium Priority</div>
                                        <div className="text-xs text-text-muted">~5 sats/vB • ~30 min</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-bg-tertiary rounded-lg">
                                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                        <AlertTriangle className="w-4 h-4 text-red-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-text-primary">Low Priority</div>
                                        <div className="text-xs text-text-muted">~1 sat/vB • Hours/Days</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-bg-secondary border-pkg-fees/30">
                        <CardContent className="pt-6">
                            <h3 className="text-xl font-bold text-text-primary mb-4 text-center">Fee Calculation</h3>

                            <div className="p-4 bg-bg-tertiary rounded-lg mb-4">
                                <div className="text-center font-mono text-lg text-pkg-fees mb-2">
                                    Fee = Transaction Size × Fee Rate
                                </div>
                                <div className="text-center text-text-muted text-sm">
                                    (vBytes) × (sats/vByte) = satoshis
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Package className="w-4 h-4 text-primary" />
                                        <span className="font-medium text-text-primary text-sm">Transaction Size</span>
                                    </div>
                                    <p className="text-xs text-text-secondary">
                                        Depends on inputs/outputs count. More inputs = larger transaction = higher fee.
                                        Multisig transactions are larger than single-sig.
                                    </p>
                                </div>

                                <div className="p-3 bg-pkg-fees/10 rounded-lg border border-pkg-fees/30">
                                    <div className="flex items-center gap-2 mb-1">
                                        <TrendingUp className="w-4 h-4 text-pkg-fees" />
                                        <span className="font-medium text-text-primary text-sm">Fee Rate</span>
                                    </div>
                                    <p className="text-xs text-text-secondary">
                                        Market-driven based on mempool congestion. Check mempool.space for current rates.
                                        Measured in satoshis per virtual byte (sats/vB).
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </motion.section>

            {/* Fee Strategies Visual */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="not-prose mb-16"
            >
                <h2 className="text-3xl font-bold mb-6 text-text-primary flex items-center gap-3">
                    <RefreshCw className="text-pkg-fees" />
                    Fee Bumping Strategies
                </h2>

                <p className="text-text-secondary mb-8">
                    What happens when your transaction gets stuck? The @caravan/fees package provides
                    two powerful strategies to unstick your transactions.
                </p>

                <FeeStrategyVisualizer />
            </motion.section>

            {/* RBF Deep Dive */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="not-prose mb-16"
            >
                <h2 className="text-3xl font-bold mb-6 text-text-primary flex items-center gap-3">
                    <RefreshCw className="text-green-500" />
                    RBF: Replace-By-Fee
                </h2>

                <Card className="bg-bg-secondary border-green-500/30 mb-8">
                    <CardContent className="pt-6">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xl font-bold text-text-primary mb-4">How RBF Works</h3>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 text-green-500 font-bold">1</div>
                                        <div>
                                            <div className="font-medium text-text-primary">Original Transaction</div>
                                            <div className="text-sm text-text-secondary">You broadcast TX with sequence &lt; 0xfffffffe (RBF-enabled)</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 text-green-500 font-bold">2</div>
                                        <div>
                                            <div className="font-medium text-text-primary">Create Replacement</div>
                                            <div className="text-sm text-text-secondary">Build new TX spending same inputs with higher fee</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 text-green-500 font-bold">3</div>
                                        <div>
                                            <div className="font-medium text-text-primary">Broadcast Replacement</div>
                                            <div className="text-sm text-text-secondary">Network replaces old TX (BIP125 rules)</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-text-primary mb-4">BIP125 Requirements</h3>
                                <div className="space-y-3">
                                    <div className="p-3 bg-bg-tertiary rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            <span className="text-sm text-text-primary">Original TX must signal RBF</span>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-bg-tertiary rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            <span className="text-sm text-text-primary">New fee must be higher than old</span>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-bg-tertiary rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            <span className="text-sm text-text-primary">Must include at least one original input</span>
                                        </div>
                                    </div>
                                    <div className="p-3 bg-bg-tertiary rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            <span className="text-sm text-text-primary">New fee ≥ old fee + min relay fee</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Callout type="tip" title="RBF Use Cases">
                    <ul className="space-y-2 text-sm">
                        <li><strong>Accelerate:</strong> Keep same outputs, increase fee to speed up confirmation</li>
                        <li><strong>Cancel:</strong> Replace outputs to send funds back to yourself (minus higher fee)</li>
                        <li><strong>Modify:</strong> Change recipient or amount before confirmation</li>
                    </ul>
                </Callout>
            </motion.section>

            {/* CPFP Deep Dive */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="not-prose mb-16"
            >
                <h2 className="text-3xl font-bold mb-6 text-text-primary flex items-center gap-3">
                    <Baby className="text-purple-500" />
                    CPFP: Child-Pays-For-Parent
                </h2>

                <Card className="bg-bg-secondary border-purple-500/30 mb-8">
                    <CardContent className="pt-6">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xl font-bold text-text-primary mb-4">How CPFP Works</h3>
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-500 font-bold">1</div>
                                        <div>
                                            <div className="font-medium text-text-primary">Stuck Parent TX</div>
                                            <div className="text-sm text-text-secondary">Original TX with low fee sitting in mempool</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-500 font-bold">2</div>
                                        <div>
                                            <div className="font-medium text-text-primary">Create Child TX</div>
                                            <div className="text-sm text-text-secondary">Spend output from parent with HIGH fee</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-500 font-bold">3</div>
                                        <div>
                                            <div className="font-medium text-text-primary">Package Fee Rate</div>
                                            <div className="text-sm text-text-secondary">Miners see combined (parent+child) fee rate</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-text-primary mb-4">CPFP Formula</h3>
                                <div className="p-4 bg-bg-tertiary rounded-lg mb-4">
                                    <div className="font-mono text-sm text-purple-400 mb-2">
                                        child_fee = (target_rate × (parent_size + child_size)) - parent_fee
                                    </div>
                                </div>

                                <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                                    <div className="text-sm text-text-secondary mb-2">
                                        <strong className="text-purple-400">Example:</strong>
                                    </div>
                                    <div className="text-xs font-mono text-text-muted space-y-1">
                                        <div>Parent: 200 vB, 200 sats (1 sat/vB)</div>
                                        <div>Child: 150 vB</div>
                                        <div>Target: 10 sats/vB</div>
                                        <div className="pt-2 border-t border-purple-500/30 mt-2">
                                            <span className="text-purple-400">child_fee</span> = (10 × 350) - 200 = <span className="text-green-400">3,300 sats</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Callout type="warning" title="When to Use CPFP">
                    <p className="text-sm">
                        Use CPFP when you're the <strong>recipient</strong> of a stuck transaction, or when
                        the original TX doesn't signal RBF. You must have a spendable output from the parent TX.
                    </p>
                </Callout>
            </motion.section>

            {/* Interactive Transaction Builder */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="not-prose mb-16"
            >
                <h2 className="text-3xl font-bold mb-6 text-text-primary flex items-center gap-3">
                    <Layers className="text-pkg-fees" />
                    Interactive Transaction Builder
                </h2>

                <p className="text-text-secondary mb-8">
                    Build transactions visually using the BtcTransactionTemplate class. See how inputs,
                    outputs, and fees flow through the transaction building process.
                </p>

                <TransactionFlowBuilder />
            </motion.section>

            {/* Code Examples */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="not-prose mb-16"
            >
                <h2 className="text-3xl font-bold mb-6 text-text-primary">Code Examples</h2>

                <h3 className="text-xl font-bold mb-4 text-text-primary">Transaction Analyzer</h3>
                <CodePlayground
                    title="Analyze a Transaction"
                    initialCode={`// Analyze an existing transaction
// Note: In real usage, you'd provide actual transaction hex

const mockAnalysis = {
  txid: "a1b2c3d4e5f6...",
  vsize: 140,
  weight: 560,
  fee: "1000",
  feeRate: 7.14,
  inputs: [
    { txid: "prev_tx...", vout: 0, value: "100000" }
  ],
  outputs: [
    { address: "bc1q...", value: "98000" },
    { address: "bc1q...", value: "1000" } // change
  ],
  isRBFSignaled: true,
  canRBF: true,
  canCPFP: true,
  recommendedStrategy: "RBF"
};

console.log("Transaction Analysis:");
console.log("=".repeat(40));
console.log("TXID:", mockAnalysis.txid);
console.log("Size:", mockAnalysis.vsize, "vBytes");
console.log("Fee:", mockAnalysis.fee, "sats");
console.log("Fee Rate:", mockAnalysis.feeRate, "sats/vB");
console.log("");
console.log("Fee Bump Options:");
console.log("  RBF Possible:", mockAnalysis.canRBF ? "✓" : "✗");
console.log("  CPFP Possible:", mockAnalysis.canCPFP ? "✓" : "✗");
console.log("  Recommended:", mockAnalysis.recommendedStrategy);`}
                    height="400px"
                />

                <h3 className="text-xl font-bold mb-4 mt-8 text-text-primary">Building a Transaction Template</h3>
                <CodePlayground
                    title="BtcTransactionTemplate"
                    initialCode={`// Building a transaction with BtcTransactionTemplate
// This demonstrates the template-based approach

const template = {
  inputs: [],
  outputs: [],
  targetFeeRate: 5, // sats/vB
  dustThreshold: 546,
  network: "mainnet",
  scriptType: "P2WSH",
  requiredSigners: 2,
  totalSigners: 3
};

// Add an input
const input = {
  txid: "abc123def456...",
  vout: 0,
  amountSats: "100000" // 0.001 BTC
};
template.inputs.push(input);
console.log("Added input:", input.amountSats, "sats");

// Add recipient output
const recipientOutput = {
  address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  amountSats: "80000",
  type: "EXTERNAL"
};
template.outputs.push(recipientOutput);
console.log("Added recipient:", recipientOutput.amountSats, "sats");

// Calculate change
const totalIn = BigInt(100000);
const totalOut = BigInt(80000);
const estimatedFee = BigInt(5 * 140); // fee_rate * estimated_size
const change = totalIn - totalOut - estimatedFee;

console.log("");
console.log("Transaction Summary:");
console.log("  Total In:", totalIn.toString(), "sats");
console.log("  Total Out:", totalOut.toString(), "sats");
console.log("  Fee:", estimatedFee.toString(), "sats");
console.log("  Change:", change.toString(), "sats");

// Add change output
const changeOutput = {
  address: "bc1q_change_address...",
  amountSats: change.toString(),
  type: "CHANGE"
};
template.outputs.push(changeOutput);

console.log("");
console.log("✓ Transaction template ready for PSBT conversion!");`}
                    height="500px"
                />
            </motion.section>

            {/* Package API Reference */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="not-prose mb-16"
            >
                <h2 className="text-3xl font-bold mb-6 text-text-primary">Package API</h2>

                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-bg-secondary border-border hover:border-pkg-fees/50 transition-all">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-pkg-fees/10 flex items-center justify-center">
                                    <Eye className="text-pkg-fees" size={20} />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">TransactionAnalyzer</CardTitle>
                                    <CardDescription>Analyze existing transactions</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div className="p-2 bg-bg-tertiary rounded font-mono text-xs">analyze()</div>
                                <div className="p-2 bg-bg-tertiary rounded font-mono text-xs">getInputs()</div>
                                <div className="p-2 bg-bg-tertiary rounded font-mono text-xs">getOutputs()</div>
                                <div className="p-2 bg-bg-tertiary rounded font-mono text-xs">canRBF / canCPFP</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-bg-secondary border-border hover:border-pkg-fees/50 transition-all">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-pkg-fees/10 flex items-center justify-center">
                                    <Layers className="text-pkg-fees" size={20} />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">BtcTransactionTemplate</CardTitle>
                                    <CardDescription>Build new transactions</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div className="p-2 bg-bg-tertiary rounded font-mono text-xs">addInput() / addOutput()</div>
                                <div className="p-2 bg-bg-tertiary rounded font-mono text-xs">adjustChangeOutput()</div>
                                <div className="p-2 bg-bg-tertiary rounded font-mono text-xs">validate()</div>
                                <div className="p-2 bg-bg-tertiary rounded font-mono text-xs">toPsbt()</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-bg-secondary border-border hover:border-green-500/50 transition-all">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                                    <RefreshCw className="text-green-500" size={20} />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">RBF Functions</CardTitle>
                                    <CardDescription>Replace-By-Fee operations</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div className="p-2 bg-bg-tertiary rounded font-mono text-xs">createAcceleratedRbfTransaction()</div>
                                <div className="p-2 bg-bg-tertiary rounded font-mono text-xs">createCancelRbfTransaction()</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-bg-secondary border-border hover:border-purple-500/50 transition-all">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                    <Baby className="text-purple-500" size={20} />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">CPFP Functions</CardTitle>
                                    <CardDescription>Child-Pays-For-Parent operations</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div className="p-2 bg-bg-tertiary rounded font-mono text-xs">createCPFPTransaction()</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </motion.section>

            {/* Navigation */}
            <PageNavigation
                prev={{ href: '/learn/packages/psbt', title: 'PSBT Package' }}
                next={{ href: '/learn/packages/wallets', title: 'Wallets Package' }}
            />
        </div>
    );
}