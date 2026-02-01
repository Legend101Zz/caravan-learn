/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    Coins,
    RefreshCw,
    Baby,
    Layers,
    Sparkles,
    Gauge,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Zap,
    TrendingUp,
    Package,
    Eye,
    Copy,
    Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Callout } from '@/components/content/callout';
import { CodePlayground } from '@/components/interactive/code-playground';
import { PageNavigation } from '@/components/layout/page-navigation';
import { EnhancedTransactionBuilder } from '@/components/interactive/enhanced-transaction-builder';
import { RBFBuilder } from '@/components/interactive/rbf-builder';
import { CPFPBuilder } from '@/components/interactive/cpfp-builder';
import { InteractiveFeeStrategy } from '@/components/interactive/interactive-fee-strategy';

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
    const [activeTab, setActiveTab] = useState('builder');

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

            {/* Interactive Learning Hub */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="not-prose mb-16"
            >
                <h2 className="text-3xl font-bold mb-6 text-text-primary flex items-center gap-3">
                    <Sparkles className="text-pkg-fees" />
                    Interactive Learning Hub
                </h2>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-8">
                        <TabsTrigger value="builder" className="flex items-center gap-2">
                            <Layers className="w-4 h-4" />
                            <span className="hidden sm:inline">TX Builder</span>
                        </TabsTrigger>
                        <TabsTrigger value="strategy" className="flex items-center gap-2">
                            <Gauge className="w-4 h-4" />
                            <span className="hidden sm:inline">Fee Strategy</span>
                        </TabsTrigger>
                        <TabsTrigger value="rbf" className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4" />
                            <span className="hidden sm:inline">RBF</span>
                        </TabsTrigger>
                        <TabsTrigger value="cpfp" className="flex items-center gap-2">
                            <Baby className="w-4 h-4" />
                            <span className="hidden sm:inline">CPFP</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="builder" className="mt-0">
                        <EnhancedTransactionBuilder />
                    </TabsContent>

                    <TabsContent value="strategy" className="mt-0">
                        <InteractiveFeeStrategy />
                    </TabsContent>

                    <TabsContent value="rbf" className="mt-0">
                        <RBFBuilder />
                    </TabsContent>

                    <TabsContent value="cpfp" className="mt-0">
                        <CPFPBuilder />
                    </TabsContent>
                </Tabs>
            </motion.section>

            {/* Code Examples */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="not-prose mb-16"
            >
                <h2 className="text-3xl font-bold mb-6 text-text-primary">Code Examples</h2>

                <div className="space-y-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-text-primary">Building a Transaction</h3>
                        <CodePlayground
                            title="BtcTransactionTemplate Example"
                            initialCode={`import { BtcTransactionTemplate } from '@caravan/fees';

// Create a new transaction template
const template = new BtcTransactionTemplate({
  network: 'mainnet',
  scriptType: 'P2WSH',
  requiredSigners: 2,
  totalSigners: 3
});

// Add inputs (UTXOs you're spending)
template.addInput({
  txid: 'abc123...def456',
  vout: 0,
  amountSats: '100000',
  address: 'bc1q...',
  witnessScript: '...'
});

template.addInput({
  txid: 'def456...abc123',
  vout: 1,
  amountSats: '50000',
  address: 'bc1q...',
  witnessScript: '...'
});

// Add recipient output
template.addOutput({
  address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  amountSats: '120000'
});

// Set fee rate and adjust change
template.setFeeRate(5); // 5 sats/vB
template.adjustChangeOutput({
  changeAddress: 'bc1q_your_change_address',
  dustThreshold: 546
});

// Validate the transaction
const validation = template.validate();
console.log('Valid:', validation.valid);
console.log('Total Fee:', validation.fee);

// Convert to PSBT
const psbt = template.toPsbt();
console.log('PSBT created:', psbt.toBase64());`}
                            height="500px"
                        />
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4 text-text-primary">Creating an RBF Transaction</h3>
                        <CodePlayground
                            title="RBF Example"
                            initialCode={`import { createAcceleratedRbfTransaction } from '@caravan/fees';

// Your original stuck transaction
const originalTx = {
  txid: 'original_tx_id',
  inputs: [...],
  outputs: [...],
  feeRate: 1 // Too low!
};

// Create RBF replacement with higher fee
const rbfTx = createAcceleratedRbfTransaction({
  originalTransaction: originalTx,
  newFeeRate: 10, // Much higher!
  // Keep same outputs (accelerate)
  // Or modify outputs (cancel/modify)
});

console.log('New fee rate:', rbfTx.feeRate);
console.log('Additional fee needed:', rbfTx.additionalFee);

// The replacement will:
// 1. Use same inputs as original
// 2. Have higher fee
// 3. Signal RBF (sequence < 0xfffffffe)
// 4. Meet BIP125 rules`}
                            height="400px"
                        />
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4 text-text-primary">Creating a CPFP Transaction</h3>
                        <CodePlayground
                            title="CPFP Example"
                            initialCode={`import { createCPFPTransaction } from '@caravan/fees';

// Parent transaction that's stuck
const parentTx = {
  txid: 'parent_tx_id',
  outputs: [{
    vout: 0,
    amountSats: '50000',
    address: 'bc1q_your_address' // You control this
  }]
};

// Create child that pays for both
const cpfpTx = createCPFPTransaction({
  parentTransaction: parentTx,
  parentVout: 0, // Spend this output
  parentFee: 200, // Parent's fee in sats
  parentSize: 200, // Parent's size in vB
  
  targetFeeRate: 20, // Target for package
  
  // Child transaction details
  recipientAddress: 'bc1q_final_destination',
  changeAddress: 'bc1q_your_change'
});

// The child fee is calculated to achieve target
// package fee rate for parent + child combined
console.log('Child fee:', cpfpTx.fee);
console.log('Package fee rate:', cpfpTx.packageFeeRate);

// Formula: child_fee = (target_rate × total_size) - parent_fee`}
                            height="450px"
                        />
                    </div>
                </div>
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
                                <div className="p-2 bg-bg-tertiary rounded font-mono text-xs">addInput(input)</div>
                                <div className="p-2 bg-bg-tertiary rounded font-mono text-xs">addOutput(output)</div>
                                <div className="p-2 bg-bg-tertiary rounded font-mono text-xs">setFeeRate(rate)</div>
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
                                <div className="p-2 bg-bg-tertiary rounded font-mono text-xs">createModifyRbfTransaction()</div>
                                <div className="p-2 bg-bg-tertiary rounded font-mono text-xs">validateRbfRules()</div>
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
                                <div className="p-2 bg-bg-tertiary rounded font-mono text-xs">calculateChildFee()</div>
                                <div className="p-2 bg-bg-tertiary rounded font-mono text-xs">calculatePackageFeeRate()</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-bg-secondary border-border hover:border-blue-500/50 transition-all">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                    <Eye className="text-blue-500" size={20} />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Analysis Functions</CardTitle>
                                    <CardDescription>Transaction analysis utilities</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div className="p-2 bg-bg-tertiary rounded font-mono text-xs">analyzTransaction()</div>
                                <div className="p-2 bg-bg-tertiary rounded font-mono text-xs">estimateTransactionSize()</div>
                                <div className="p-2 bg-bg-tertiary rounded font-mono text-xs">checkRbfSignaling()</div>
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