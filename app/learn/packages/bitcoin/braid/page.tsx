/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodePlayground } from '@/components/interactive/code-playground';
import { Callout } from '@/components/content/callout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageNavigation } from '@/components/layout/page-navigation';
import {
    GitBranch, Boxes, Users, Key, ArrowRight, ArrowDown, Check, X,
    Sparkles, Lock, Unlock, Copy, Download, Upload, RefreshCw,
    Link as LinkIcon, Shield, Zap, Network, ChevronRight, Info,
    AlertTriangle, CheckCircle2, FileJson, Database
} from 'lucide-react';
import * as CaravanBitcoin from '@caravan/bitcoin';

// ============================================
// ANIMATED BRAID VISUALIZATION
// ============================================

const BraidVisualization = () => {
    const [step, setStep] = useState(0);
    const totalSteps = 4;

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => (prev + 1) % totalSteps);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative p-8 bg-gradient-to-br from-primary/10 via-bg-secondary to-pkg-psbt/10 rounded-2xl border border-primary/30 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5">
                <svg className="w-full h-full">
                    <defs>
                        <pattern id="braid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 0 20 Q 10 10, 20 20 T 40 20" fill="none" stroke="currentColor" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#braid-pattern)" />
                </svg>
            </div>

            <div className="relative z-10">
                {/* Title */}
                <div className="text-center mb-8">
                    <div className="text-5xl mb-4">🧬</div>
                    <h3 className="text-2xl font-bold text-primary">The Braid: DNA of Your Wallet</h3>
                    <p className="text-text-muted">One structure, infinite addresses</p>
                </div>

                {/* Main visualization */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    {/* Input: xpubs */}
                    <motion.div
                        className={`p-4 rounded-xl border-2 transition-all ${step >= 0 ? 'bg-blue-500/20 border-blue-500' : 'bg-bg-card border-border'}`}
                        animate={{ scale: step === 0 ? 1.05 : 1 }}
                    >
                        <div className="text-center mb-3">
                            <Users className={`w-8 h-8 mx-auto ${step >= 0 ? 'text-blue-500' : 'text-text-muted'}`} />
                            <div className="font-bold text-sm mt-2">Extended Public Keys</div>
                        </div>
                        <div className="space-y-2">
                            {['Alice', 'Bob', 'Carol'].map((name, i) => (
                                <motion.div
                                    key={name}
                                    className={`flex items-center gap-2 text-xs p-2 rounded ${step >= 0 ? 'bg-blue-500/10' : 'bg-bg-tertiary'}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: step >= 0 ? 1 : 0.3, x: 0 }}
                                    transition={{ delay: i * 0.2 }}
                                >
                                    <Key className="w-3 h-3" />
                                    <span className="font-mono">{name}'s xpub</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Arrow */}
                    <motion.div
                        animate={{ opacity: step >= 1 ? 1 : 0.3, scale: step === 1 ? 1.2 : 1 }}
                        className="hidden md:block"
                    >
                        <ArrowRight className="w-8 h-8 text-primary" />
                    </motion.div>
                    <motion.div
                        animate={{ opacity: step >= 1 ? 1 : 0.3 }}
                        className="md:hidden"
                    >
                        <ArrowDown className="w-8 h-8 text-primary" />
                    </motion.div>

                    {/* Braid */}
                    <motion.div
                        className={`p-6 rounded-xl border-2 transition-all ${step >= 1 ? 'bg-primary/20 border-primary shadow-lg shadow-primary/20' : 'bg-bg-card border-border'}`}
                        animate={{ scale: step === 1 || step === 2 ? 1.05 : 1 }}
                    >
                        <div className="text-center">
                            <GitBranch className={`w-12 h-12 mx-auto ${step >= 1 ? 'text-primary' : 'text-text-muted'}`} />
                            <div className="font-bold text-lg mt-2">BRAID</div>
                            <div className="text-xs text-text-muted">2-of-3 P2WSH</div>
                        </div>

                        <AnimatePresence>
                            {step >= 2 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-4 space-y-1 text-xs"
                                >
                                    <div className="flex justify-between p-1 bg-bg-tertiary rounded">
                                        <span className="text-text-muted">Network:</span>
                                        <span className="text-primary font-mono">Testnet</span>
                                    </div>
                                    <div className="flex justify-between p-1 bg-bg-tertiary rounded">
                                        <span className="text-text-muted">Type:</span>
                                        <span className="text-primary font-mono">P2WSH</span>
                                    </div>
                                    <div className="flex justify-between p-1 bg-bg-tertiary rounded">
                                        <span className="text-text-muted">Quorum:</span>
                                        <span className="text-primary font-mono">2-of-3</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Arrow */}
                    <motion.div
                        animate={{ opacity: step >= 3 ? 1 : 0.3, scale: step === 3 ? 1.2 : 1 }}
                        className="hidden md:block"
                    >
                        <ArrowRight className="w-8 h-8 text-green-500" />
                    </motion.div>
                    <motion.div
                        animate={{ opacity: step >= 3 ? 1 : 0.3 }}
                        className="md:hidden"
                    >
                        <ArrowDown className="w-8 h-8 text-green-500" />
                    </motion.div>

                    {/* Output: Addresses */}
                    <motion.div
                        className={`p-4 rounded-xl border-2 transition-all ${step >= 3 ? 'bg-green-500/20 border-green-500' : 'bg-bg-card border-border'}`}
                        animate={{ scale: step === 3 ? 1.05 : 1 }}
                    >
                        <div className="text-center mb-3">
                            <Network className={`w-8 h-8 mx-auto ${step >= 3 ? 'text-green-500' : 'text-text-muted'}`} />
                            <div className="font-bold text-sm mt-2">Addresses</div>
                        </div>
                        <div className="space-y-2">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className={`text-xs p-2 rounded font-mono ${step >= 3 ? 'bg-green-500/10' : 'bg-bg-tertiary'}`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: step >= 3 ? 1 : 0.3, x: 0 }}
                                    transition={{ delay: i * 0.2 }}
                                >
                                    tb1q...{i}
                                </motion.div>
                            ))}
                            <div className="text-xs text-text-muted text-center">∞ more...</div>
                        </div>
                    </motion.div>
                </div>

                {/* Step indicators */}
                <div className="flex justify-center gap-2 mt-8">
                    {[...Array(totalSteps)].map((_, i) => (
                        <motion.div
                            key={i}
                            className={`w-2 h-2 rounded-full ${i === step ? 'bg-primary' : 'bg-text-muted/30'}`}
                            animate={{ scale: i === step ? 1.3 : 1 }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

// ============================================
// SPOOL AND STRAND EXPLANATION
// ============================================

const SpoolStrandExplanation = () => {
    const [activeView, setActiveView] = useState<'spool' | 'strand'>('spool');

    return (
        <div className="my-8 p-6 bg-bg-secondary rounded-2xl border border-border">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Boxes className="w-6 h-6 text-primary" />
                Caravan's Braid Model: Spools & Strands
            </h3>

            {/* Toggle */}
            <div className="flex gap-2 mb-6">
                <Button
                    variant={activeView === 'spool' ? 'default' : 'outline'}
                    onClick={() => setActiveView('spool')}
                    size="sm"
                >
                    🧵 Spool (Account Key)
                </Button>
                <Button
                    variant={activeView === 'strand' ? 'default' : 'outline'}
                    onClick={() => setActiveView('strand')}
                    size="sm"
                >
                    🪢 Strand (Wallet Key)
                </Button>
            </div>

            <AnimatePresence mode="wait">
                {activeView === 'spool' ? (
                    <motion.div
                        key="spool"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid md:grid-cols-2 gap-6"
                    >
                        <div>
                            <h4 className="font-bold text-primary mb-3">What is a Spool?</h4>
                            <p className="text-sm text-text-muted mb-4">
                                A <strong>Spool</strong> is your "Account Key" - a hardened xpub that you upload
                                once to Unchained/Caravan. From this single key, unlimited wallet keys can be derived.
                            </p>
                            <div className="p-3 bg-bg-tertiary rounded-lg font-mono text-sm">
                                <div className="text-text-muted text-xs mb-1">Path:</div>
                                <div className="text-primary">m/45'/0'/0'</div>
                            </div>
                        </div>
                        <div className="p-4 bg-primary/10 rounded-xl border border-primary/30">
                            <h4 className="font-bold mb-3 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                Benefits
                            </h4>
                            <ul className="text-sm space-y-2">
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                                    <span>One-time hardware wallet interaction</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                                    <span>Create unlimited wallets without device</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                                    <span>Easy key sharing with connections</span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="strand"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid md:grid-cols-2 gap-6"
                    >
                        <div>
                            <h4 className="font-bold text-pkg-psbt mb-3">What is a Strand?</h4>
                            <p className="text-sm text-text-muted mb-4">
                                A <strong>Strand</strong> is a child xpub derived from your Spool. Each wallet
                                (vault) gets its own strand. Strands are combined to form the Braid.
                            </p>
                            <div className="p-3 bg-bg-tertiary rounded-lg font-mono text-sm">
                                <div className="text-text-muted text-xs mb-1">Derived from Spool:</div>
                                <div className="text-pkg-psbt">m/45'/0'/0'/0 → Wallet 1</div>
                                <div className="text-pkg-psbt">m/45'/0'/0'/1 → Wallet 2</div>
                            </div>
                        </div>
                        <div className="p-4 bg-pkg-psbt/10 rounded-xl border border-pkg-psbt/30">
                            <h4 className="font-bold mb-3 flex items-center gap-2">
                                <GitBranch className="w-5 h-5 text-pkg-psbt" />
                                How it works
                            </h4>
                            <ul className="text-sm space-y-2">
                                <li className="flex items-start gap-2">
                                    <ChevronRight className="w-4 h-4 text-pkg-psbt mt-0.5" />
                                    <span>Each signer contributes one strand</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ChevronRight className="w-4 h-4 text-pkg-psbt mt-0.5" />
                                    <span>Strands are "woven" into a Braid</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ChevronRight className="w-4 h-4 text-pkg-psbt mt-0.5" />
                                    <span>Braid derives deterministic addresses</span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Visual representation */}
            <div className="mt-6 p-4 bg-bg-tertiary rounded-xl">
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
                    <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
                        <div className="font-bold text-blue-500">Spool A</div>
                        <div className="text-xs text-text-muted">m/45'/0'/0'</div>
                    </div>
                    <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                        <div className="font-bold text-green-500">Spool B</div>
                        <div className="text-xs text-text-muted">m/45'/0'/0'</div>
                    </div>
                    <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
                        <div className="font-bold text-purple-500">Spool C</div>
                        <div className="text-xs text-text-muted">m/45'/0'/0'</div>
                    </div>

                    <ArrowRight className="w-6 h-6 text-primary hidden md:block" />
                    <ArrowDown className="w-6 h-6 text-primary md:hidden" />

                    <div className="text-center p-4 bg-primary/20 rounded-xl border-2 border-primary">
                        <GitBranch className="w-8 h-8 text-primary mx-auto" />
                        <div className="font-bold text-primary mt-1">BRAID</div>
                        <div className="text-xs text-text-muted">2-of-3 Multisig</div>
                    </div>

                    <ArrowRight className="w-6 h-6 text-green-500 hidden md:block" />
                    <ArrowDown className="w-6 h-6 text-green-500 md:hidden" />

                    <div className="text-center">
                        <div className="font-mono text-xs space-y-1">
                            <div className="p-1 bg-green-500/10 rounded">tb1q...0</div>
                            <div className="p-1 bg-green-500/10 rounded">tb1q...1</div>
                            <div className="p-1 bg-green-500/10 rounded">tb1q...2</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================
// PROBLEM/SOLUTION COMPARISON
// ============================================

const ProblemSolution = () => {
    return (
        <div className="grid md:grid-cols-2 gap-6 my-8">
            <Card className="border-red-500/30">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <X className="w-5 h-5 text-red-500" />
                        Without Braid
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <p className="text-red-400 font-semibold">The coordination nightmare:</p>
                    <ul className="space-y-2 text-text-muted">
                        <li className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                            <span>"What address index are we on?"</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                            <span>"Did everyone use the same xpub order?"</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                            <span>"I got a different address than you!"</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                            <span>"Let me re-export from my hardware wallet..."</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>

            <Card className="border-green-500/30">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-500" />
                        With Braid
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <p className="text-green-400 font-semibold">Deterministic simplicity:</p>
                    <ul className="space-y-2 text-text-muted">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>Same Braid = Same addresses, always</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>Export once, share JSON file</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>Everyone derives independently</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>No coordination needed!</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};

// ============================================
// BRAID BENEFITS CARDS
// ============================================

const BraidBenefits = () => {
    const benefits = [
        {
            icon: Database,
            title: 'Single Source of Truth',
            description: 'All wallet configuration in one place - network, type, quorum, xpubs',
            color: 'primary'
        },
        {
            icon: RefreshCw,
            title: 'Deterministic',
            description: 'Same Braid = same addresses, every time, for everyone',
            color: 'pkg-psbt'
        },
        {
            icon: FileJson,
            title: 'Portable',
            description: 'Export as JSON, share with coordinators, backup easily',
            color: 'pkg-wallets'
        },
        {
            icon: Shield,
            title: 'Secure',
            description: 'Contains only public keys - safe to share, can\'t spend funds',
            color: 'pkg-multisig'
        }
    ];

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
            {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                    <motion.div
                        key={benefit.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className={`h-full border-${benefit.color}/30 hover:border-${benefit.color}/60 transition-all`}>
                            <CardContent className="pt-6">
                                <div className={`w-10 h-10 rounded-lg bg-${benefit.color}/10 flex items-center justify-center mb-3`}>
                                    <IconComponent className={`w-5 h-5 text-${benefit.color}`} />
                                </div>
                                <h4 className="font-bold mb-2">{benefit.title}</h4>
                                <p className="text-sm text-text-muted">{benefit.description}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
};

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function BraidPage() {
    return (
        <div className="prose prose-invert max-w-none">
            {/* Header */}
            <div className="not-prose mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4"
                >
                    <span className="text-xl">⭐</span>
                    @caravan/bitcoin
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl font-bold mb-4"
                >
                    The Braid
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-text-secondary"
                >
                    Caravan's powerful abstraction for deterministic multisig wallet management
                </motion.p>
            </div>

            {/* Animated Visualization */}
            <section className="not-prose mb-12">
                <BraidVisualization />
            </section>

            {/* What is a Braid */}
            <h2>What is a Braid?</h2>

            <p>
                The <strong>Braid</strong> is Caravan's unique concept that elegantly solves a fundamental
                challenge in multisig wallets: <em>how do multiple participants independently generate
                    the same addresses in the same order?</em>
            </p>

            <Callout type="tip" title="Think of it like DNA">
                <p>
                    Just like DNA contains the instructions to build an organism, a Braid contains
                    all the information needed to deterministically derive your entire multisig wallet.
                    Given the same Braid, everyone generates identical addresses.
                </p>
            </Callout>

            {/* Benefits */}
            <div className="not-prose">
                <BraidBenefits />
            </div>

            {/* Problem/Solution */}
            <h2>The Problem Braid Solves</h2>

            <div className="not-prose">
                <ProblemSolution />
            </div>

            {/* Spool and Strand */}
            <h2>Spools, Strands, and Braids</h2>

            <p>
                Caravan uses a unique key management model that allows you to create unlimited
                wallets from a single device interaction:
            </p>

            <div className="not-prose">
                <SpoolStrandExplanation />
            </div>

            {/* Braid Structure Code */}
            <h2>Braid Structure</h2>

            <p>
                A Braid contains all the information needed to derive your multisig wallet:
            </p>

            <CodePlayground
                title="Understanding Braid Structure"
                initialCode={`// A Braid encodes your complete wallet configuration

const braidConfig = {
  // Which Bitcoin network
  network: "testnet",  // or "mainnet", "regtest"
  
  // Script type (determines address format)
  addressType: "P2WSH",  // Native SegWit multisig (bc1q... 62 chars)
  
  // Quorum requirement
  requiredSigners: 2,  // Need 2 of 3 signatures
  
  // Extended public keys from each participant
  extendedPublicKeys: [
    {
      name: "Alice",
      xpub: "tpubDFH9dgzveyD8z...",
      path: "m/48'/1'/0'/2'",
      rootFingerprint: "a1b2c3d4"
    },
    {
      name: "Bob", 
      xpub: "tpubDGnetmJX2z9v7...",
      path: "m/48'/1'/0'/2'",
      rootFingerprint: "e5f6g7h8"
    },
    {
      name: "Carol",
      xpub: "tpubDHcN8K4btqv2L...",
      path: "m/48'/1'/0'/2'",
      rootFingerprint: "i9j0k1l2"
    }
  ],
  
  // Which address chain
  index: "0"  // 0 = receive addresses, 1 = change addresses
};

console.log("=== Braid Configuration ===\\n");
console.log(JSON.stringify(braidConfig, null, 2));

console.log("\\n✨ This Braid defines a 2-of-3 P2WSH wallet");
console.log("   Anyone with this config derives identical addresses!");`}
                imports={{ CaravanBitcoin }}
                height="520px"
            />

            {/* Receive vs Change */}
            <h2>Receive vs Change Braids</h2>

            <p>
                HD wallets use two address chains - one for receiving and one for change.
                You need separate Braids for each:
            </p>

            <div className="not-prose my-8 grid md:grid-cols-2 gap-6">
                <Card className="border-green-500/30">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Download className="w-5 h-5 text-green-500" />
                            Receive Braid (index: "0")
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                        <p className="text-text-muted mb-3">For addresses you share with others:</p>
                        <div className="space-y-1 font-mono text-xs">
                            <div className="p-2 bg-green-500/10 rounded">m/.../0/0 → First receive</div>
                            <div className="p-2 bg-green-500/10 rounded">m/.../0/1 → Second receive</div>
                            <div className="p-2 bg-green-500/10 rounded">m/.../0/2 → Third receive</div>
                            <div className="text-text-muted text-center">∞ more...</div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-yellow-500/30">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <RefreshCw className="w-5 h-5 text-yellow-500" />
                            Change Braid (index: "1")
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                        <p className="text-text-muted mb-3">For transaction change (internal use):</p>
                        <div className="space-y-1 font-mono text-xs">
                            <div className="p-2 bg-yellow-500/10 rounded">m/.../1/0 → First change</div>
                            <div className="p-2 bg-yellow-500/10 rounded">m/.../1/1 → Second change</div>
                            <div className="p-2 bg-yellow-500/10 rounded">m/.../1/2 → Third change</div>
                            <div className="text-text-muted text-center">∞ more...</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Working with Braids */}
            <h2>Working with Braids in Code</h2>

            <CodePlayground
                title="Generating Addresses from a Braid"
                initialCode={`// Caravan provides utilities for working with Braids

const { 
  Network,
  P2WSH,
  // Note: In real usage, you'd import from @caravan/bitcoin
} = CaravanBitcoin;

// Simulating Braid address derivation
console.log("=== Deriving Addresses from Braid ===\\n");

// Your Braid configuration (simplified)
const braid = {
  network: "testnet",
  addressType: "P2WSH",
  quorum: "2-of-3",
  signers: ["Alice", "Bob", "Carol"]
};

console.log("Braid Config:");
console.log(\`  Network: \${braid.network}\`);
console.log(\`  Type: \${braid.addressType}\`);
console.log(\`  Quorum: \${braid.quorum}\`);
console.log(\`  Signers: \${braid.signers.join(", ")}\\n\`);

// Derive addresses (simulated)
console.log("Derived Receive Addresses:");
for (let i = 0; i < 5; i++) {
  // In real code: deriveMultisigByIndex(braid, i)
  console.log(\`  #\${i}: tb1q...\${i.toString().padStart(3, '0')}...abc\`);
}

console.log("\\n✨ All participants derive these SAME addresses!");
console.log("   No coordination needed - just share the Braid config.\\n");

console.log("💡 Key Functions:");
console.log("   generateBraid() - Create new Braid");
console.log("   deriveMultisigByIndex() - Get address at index");
console.log("   braidConfig() - Export Braid as JSON");`}
                imports={{ CaravanBitcoin }}
                height="480px"
            />

            {/* Real-World Example */}
            <h2>Real-World Example: Team Treasury</h2>

            <div className="not-prose my-8">
                <Card className="bg-bg-secondary border-primary/30">
                    <CardHeader>
                        <CardTitle>Team Treasury Workflow</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 bg-primary/10 rounded-xl border border-primary/30">
                                <div className="font-bold text-primary mb-2 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-primary text-black flex items-center justify-center text-xs">1</span>
                                    Initial Setup
                                </div>
                                <ul className="text-xs text-text-muted space-y-1">
                                    <li>• Alice, Bob, Carol generate seed phrases</li>
                                    <li>• Each exports their xpub from hardware wallet</li>
                                    <li>• They meet to create the 2-of-3 Braid</li>
                                    <li>• Export Braid JSON - everyone saves a copy</li>
                                </ul>
                            </div>

                            <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                                <div className="font-bold text-green-500 mb-2 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-green-500 text-black flex items-center justify-center text-xs">2</span>
                                    Daily Operations
                                </div>
                                <ul className="text-xs text-text-muted space-y-1">
                                    <li>• Need invoice? Alice derives address #47</li>
                                    <li>• Payment received? Bob checks #47 - same!</li>
                                    <li>• New customer? Carol derives #48</li>
                                    <li>• No coordination needed</li>
                                </ul>
                            </div>

                            <div className="p-4 bg-pkg-psbt/10 rounded-xl border border-pkg-psbt/30">
                                <div className="font-bold text-pkg-psbt mb-2 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-pkg-psbt text-black flex items-center justify-center text-xs">3</span>
                                    Spending
                                </div>
                                <ul className="text-xs text-text-muted space-y-1">
                                    <li>• Alice creates PSBT using the Braid</li>
                                    <li>• Bob signs with his hardware wallet</li>
                                    <li>• Carol signs (now have 2-of-3)</li>
                                    <li>• Broadcast - funds spent!</li>
                                </ul>
                            </div>

                            <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
                                <div className="font-bold text-yellow-500 mb-2 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-yellow-500 text-black flex items-center justify-center text-xs">4</span>
                                    Team Changes
                                </div>
                                <ul className="text-xs text-text-muted space-y-1">
                                    <li>• Carol leaves the team</li>
                                    <li>• Create new Braid with David</li>
                                    <li>• Sweep funds to new wallet</li>
                                    <li>• Old Braid deprecated</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Key Takeaways */}
            <h2>Key Takeaways</h2>

            <div className="not-prose my-6">
                <Card className="bg-primary/5 border-primary/30">
                    <CardContent className="pt-6">
                        <ul className="space-y-3 text-text-secondary">
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span><strong>Braid</strong> = Complete multisig wallet configuration</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span><strong>Spool</strong> = Account key (uploaded once from hardware wallet)</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span><strong>Strand</strong> = Wallet key (derived from spool for each wallet)</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Same Braid = Same addresses for all participants</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Contains only public keys - safe to share</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Export as JSON for backup and coordination</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <h2>What's Next?</h2>

            <p>
                Now you understand the Braid concept! Next, explore the <strong>@caravan/psbt</strong> package
                to learn how to create and sign transactions for your multisig wallet.
            </p>

            <PageNavigation />
        </div>
    );
}