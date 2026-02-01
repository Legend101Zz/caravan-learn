/* eslint-disable @typescript-eslint/no-explicit-any */
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
import Link from 'next/link';
import {
    ArrowRight, Check, Key, Shield, Layers, Code2, BookOpen,
    Sparkles, Zap, GitBranch, Package, Play, ChevronRight,
    Terminal, Boxes, Lock, Users, Rocket, CheckCircle2
} from 'lucide-react';
import * as CaravanBitcoin from '@caravan/bitcoin';

// ============================================
// ANIMATED HERO COMPONENT
// ============================================

const AnimatedHero = () => {
    const [currentWord, setCurrentWord] = useState(0);
    const words = ['Multisig', 'Security', 'Bitcoin', 'Custody'];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % words.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-bg-secondary to-pkg-psbt/20 p-8 md:p-12 mb-12 border border-primary/30">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-primary/20 rounded-full"
                        initial={{
                            // eslint-disable-next-line react-hooks/purity
                            x: Math.random() * 100 + '%',
                            // eslint-disable-next-line react-hooks/purity
                            y: Math.random() * 100 + '%',
                        }}
                        animate={{
                            y: [null, '-100%'],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            // eslint-disable-next-line react-hooks/purity
                            duration: Math.random() * 10 + 5,
                            repeat: Infinity,
                            // eslint-disable-next-line react-hooks/purity
                            delay: Math.random() * 5,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 mb-6"
                >
                    <Package className="w-8 h-8 text-primary" />
                    <span className="text-primary font-bold">Caravan Interactive</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-bold mb-6"
                >
                    Master Bitcoin{' '}
                    <span className="relative inline-block">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={currentWord}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-primary"
                            >
                                {words[currentWord]}
                            </motion.span>
                        </AnimatePresence>
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-text-secondary max-w-2xl mb-8"
                >
                    Learn to build secure Bitcoin multisig wallets with Caravan's open-source
                    packages. Hands-on tutorials, interactive code, and real-world examples.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-wrap gap-4"
                >
                    <Button asChild size="lg" className="bg-primary hover:bg-primary-dark text-black font-bold">
                        <Link href="#first-example">
                            <Play className="w-5 h-5 mr-2" />
                            Start Learning
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link href="/learn/overview">
                            View Course Outline
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    </Button>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-border"
                >
                    <div>
                        <div className="text-3xl font-bold text-primary">4</div>
                        <div className="text-sm text-text-muted">Packages</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-primary">15+</div>
                        <div className="text-sm text-text-muted">Interactive Lessons</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-primary">100%</div>
                        <div className="text-sm text-text-muted">Open Source</div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// ============================================
// LEARNING PATH VISUALIZATION
// ============================================

const LearningPathVisualization = () => {
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            icon: BookOpen,
            title: 'Foundations',
            description: 'Bitcoin basics, keys, addresses, and HD wallets',
            color: 'primary',
            topics: ['UTXO Model', 'Keys & Addresses', 'HD Wallets', 'Multisig Basics']
        },
        {
            icon: Package,
            title: 'Caravan Packages',
            description: 'Deep dive into @caravan/bitcoin, psbt, and more',
            color: 'pkg-psbt',
            topics: ['@caravan/bitcoin', '@caravan/psbt', '@caravan/multisig', 'The Braid ⭐']
        },
        {
            icon: Rocket,
            title: 'Build Your Wallet',
            description: 'Create a real 2-of-3 multisig wallet',
            color: 'pkg-wallets',
            topics: ['Planning', 'Collecting Keys', 'Braid Creation', 'Transactions']
        }
    ];

    return (
        <div className="my-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <GitBranch className="w-6 h-6 text-primary" />
                Your Learning Journey
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
                {steps.map((step, index) => {
                    const IconComponent = step.icon;
                    return (
                        <motion.div
                            key={index}
                            className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${activeStep === index
                                ? `bg-${step.color}/10 border-${step.color}`
                                : 'bg-bg-secondary border-border hover:border-border/80'
                                }`}
                            onClick={() => setActiveStep(index)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {/* Step number */}
                            <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${activeStep === index
                                ? 'bg-primary text-black'
                                : 'bg-bg-tertiary text-text-muted'
                                }`}>
                                {index + 1}
                            </div>

                            <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 rounded-lg ${activeStep === index ? `bg-${step.color}/20` : 'bg-bg-tertiary'}`}>
                                    <IconComponent className={`w-6 h-6 ${activeStep === index ? `text-${step.color}` : 'text-text-muted'}`} />
                                </div>
                                <h3 className="font-bold">{step.title}</h3>
                            </div>

                            <p className="text-sm text-text-muted mb-4">{step.description}</p>

                            <AnimatePresence>
                                {activeStep === index && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-2"
                                    >
                                        {step.topics.map((topic, i) => (
                                            <motion.div
                                                key={topic}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex items-center gap-2 text-sm"
                                            >
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                <span>{topic}</span>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// ============================================
// WHAT YOU'LL BUILD PREVIEW
// ============================================

const WhatYoullBuild = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="my-12 p-8 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-2xl border border-green-500/30"
        >
            <div className="text-center mb-8">
                <div className="text-5xl mb-4">🏗️</div>
                <h2 className="text-3xl font-bold mb-2">What You'll Build</h2>
                <p className="text-text-muted">A fully functional 2-of-3 multisig wallet on testnet</p>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
                {[
                    { icon: Key, label: 'Collect 3 xpubs', desc: 'From hardware wallets' },
                    { icon: GitBranch, label: 'Create Braid', desc: 'Define wallet config' },
                    { icon: Boxes, label: 'Generate Addresses', desc: 'Deterministically' },
                    { icon: Lock, label: 'Sign Transactions', desc: '2-of-3 signatures' }
                ].map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center p-4"
                        >
                            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                                <IconComponent className="w-6 h-6 text-green-500" />
                            </div>
                            <div className="font-bold text-sm mb-1">{item.label}</div>
                            <div className="text-xs text-text-muted">{item.desc}</div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
};

// ============================================
// CARAVAN PACKAGES OVERVIEW
// ============================================

const CaravanPackagesOverview = () => {
    const packages = [
        {
            name: '@caravan/bitcoin',
            description: 'Core Bitcoin utilities - addresses, keys, multisig',
            icon: Package,
            color: 'primary',
            features: ['Address validation', 'Key derivation', 'Network config']
        },
        {
            name: '@caravan/psbt',
            description: 'Partially Signed Bitcoin Transactions',
            icon: Layers,
            color: 'pkg-psbt',
            features: ['Create PSBTs', 'Sign & combine', 'BIP174/370']
        },
        {
            name: '@caravan/multisig',
            description: 'Wallet configuration management',
            icon: Users,
            color: 'pkg-multisig',
            features: ['Wallet configs', 'Quorum settings', 'Export/import']
        },
        {
            name: '@caravan/wallets',
            description: 'Hardware wallet integrations',
            icon: Shield,
            color: 'pkg-wallets',
            features: ['Ledger', 'Trezor', 'Coldcard']
        }
    ];

    return (
        <div className="my-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Boxes className="w-6 h-6 text-primary" />
                Caravan Packages
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
                {packages.map((pkg, index) => {
                    const IconComponent = pkg.icon;
                    return (
                        <motion.div
                            key={pkg.name}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className={`h-full border-${pkg.color}/30 hover:border-${pkg.color}/60 transition-all`}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg bg-${pkg.color}/10`}>
                                            <IconComponent className={`w-5 h-5 text-${pkg.color}`} />
                                        </div>
                                        <div>
                                            <CardTitle className="text-base font-mono">{pkg.name}</CardTitle>
                                            <p className="text-xs text-text-muted">{pkg.description}</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {pkg.features.map((feature) => (
                                            <span
                                                key={feature}
                                                className={`text-xs px-2 py-1 rounded bg-${pkg.color}/10 text-${pkg.color}`}
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function StartPage() {
    return (
        <div className="min-h-screen bg-bg-primary py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-6"
                >
                    <Link href="/" className="inline-flex items-center text-primary hover:text-primary-light transition-colors">
                        <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
                        Back to Home
                    </Link>
                </motion.div>

                {/* Hero Section */}
                {/* <AnimatedHero /> */}

                {/* What You'll Learn */}
                <section className="mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl font-bold mb-6 flex items-center gap-3"
                    >
                        <Sparkles className="w-6 h-6 text-primary" />
                        What You'll Learn
                    </motion.h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-primary" />
                                        Bitcoin Fundamentals
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {['Keys, addresses & their types', 'HD wallets & derivation paths', 'Transaction basics & UTXOs', 'Multisig security concepts'].map((item) => (
                                        <div key={item} className="flex items-center gap-2 text-text-secondary">
                                            <Check className="text-green-500 w-4 h-4 flex-shrink-0" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Code2 className="w-5 h-5 text-pkg-psbt" />
                                        Practical Skills
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {['Validate & generate addresses', 'Work with PSBTs', 'Create multisig wallets', 'Coordinate signing'].map((item) => (
                                        <div key={item} className="flex items-center gap-2 text-text-secondary">
                                            <Check className="text-green-500 w-4 h-4 flex-shrink-0" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </section>

                {/* Interactive Tip */}
                <Callout type="tip" title="🎮 Interactive Learning">
                    <p>
                        Every code example on this site is <strong>runnable</strong>! Click the "Run" button
                        to execute code and see results. Modify the code and experiment - that's the best way to learn.
                    </p>
                </Callout>

                {/* First Example Section */}
                <section id="first-example" className="my-12 scroll-mt-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl font-bold mb-4 flex items-center gap-3"
                    >
                        <Terminal className="w-6 h-6 text-primary" />
                        Your First Caravan Code
                    </motion.h2>

                    <p className="text-text-secondary mb-6">
                        Let's start with something simple: validating a Bitcoin address.
                        This uses <code className="text-primary">@caravan/bitcoin</code> - try it out!
                    </p>

                    <CodePlayground
                        title="🚀 Address Validation - Your First Example"
                        initialCode={`// Welcome to Caravan Interactive! 🎉
// This is your first hands-on example.

const { validateAddress, Network } = CaravanBitcoin;

// A valid Bitcoin mainnet address (Native SegWit)
const address = 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq';

// Validate it against mainnet
const error = validateAddress(address, Network.MAINNET);

if (error) {
  console.log('❌ Invalid address:', error);
} else {
  console.log('✅ Valid Bitcoin address!');
  console.log('');
  console.log('Address:', address);
  console.log('Type: Native SegWit (P2WPKH)');
  console.log('Network: Mainnet');
  console.log('');
  console.log('💡 Try changing the address above and run again!');
  console.log('   Try: "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2" (Legacy)');
  console.log('   Try: "invalid-address" (Invalid)');
}`}
                        imports={{ CaravanBitcoin }}
                        height="380px"
                    />

                    <Callout type="info" title="What just happened?">
                        <p>
                            You used <code>validateAddress()</code> from <code>@caravan/bitcoin</code> to check
                            if an address is valid for Bitcoin mainnet. The function returns an empty string if
                            valid, or an error message if invalid. Simple!
                        </p>
                    </Callout>
                </section>

                {/* Try Different Address Types */}
                <section className="my-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl font-bold mb-4"
                    >
                        Try Different Address Types
                    </motion.h2>

                    <p className="text-text-secondary mb-6">
                        Bitcoin has evolved through several address formats. Each offers different
                        features and fee characteristics:
                    </p>

                    <CodePlayground
                        title="Bitcoin Address Types"
                        initialCode={`const { validateAddress, Network } = CaravanBitcoin;

// Different Bitcoin address formats
const addresses = [
  {
    address: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
    type: 'Legacy (P2PKH)',
    prefix: '1...',
    fees: '💰💰💰 Highest'
  },
  {
    address: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
    type: 'Script Hash (P2SH)',
    prefix: '3...',
    fees: '💰💰 Medium'
  },
  {
    address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
    type: 'Native SegWit (P2WPKH)',
    prefix: 'bc1q... (42 chars)',
    fees: '💰 Lower'
  },
  {
    address: 'bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3',
    type: 'Native SegWit Multisig (P2WSH)',
    prefix: 'bc1q... (62 chars)',
    fees: '💰 Lower (for multisig)'
  }
];

console.log("=== Bitcoin Address Types ===\\n");

addresses.forEach(({ address, type, prefix, fees }) => {
  const error = validateAddress(address, Network.MAINNET);
  const status = error ? '❌' : '✅';
  
  console.log(\`\${status} \${type}\`);
  console.log(\`   Prefix: \${prefix}\`);
  console.log(\`   Fees: \${fees}\`);
  console.log(\`   Address: \${address.slice(0, 20)}...\`);
  console.log('');
});

console.log("💡 For Caravan multisig, we use P2WSH (62-char bc1q addresses)");
console.log("   This gives you the lowest fees for multisig transactions!");`}
                        imports={{ CaravanBitcoin }}
                        height="480px"
                    />
                </section>

                {/* Learning Path Visualization */}
                <LearningPathVisualization />

                {/* What You'll Build */}
                <WhatYoullBuild />

                {/* Caravan Packages Overview */}
                <CaravanPackagesOverview />

                {/* Network Example */}
                <section className="my-12">
                    <h2 className="text-2xl font-bold mb-4">One More Thing: Networks</h2>

                    <p className="text-text-secondary mb-6">
                        Caravan supports all Bitcoin networks. Always develop on <strong>testnet</strong> first!
                    </p>

                    <CodePlayground
                        title="Working with Networks"
                        initialCode={`const { Network, networkData, validateAddress } = CaravanBitcoin;

console.log("=== Caravan Network Support ===\\n");

// List all supported networks
const networks = [
  { net: Network.MAINNET, name: 'Mainnet', emoji: '🟠' },
  { net: Network.TESTNET, name: 'Testnet', emoji: '🟣' },
  { net: Network.REGTEST, name: 'Regtest', emoji: '🔵' }
];

networks.forEach(({ net, name, emoji }) => {
  const data = networkData(net);
  console.log(\`\${emoji} \${name}\`);
  console.log(\`   bech32: \${data.bech32}\`);
  console.log(\`   pubKeyHash: \${data.pubKeyHash}\`);
  console.log('');
});

// Validate testnet address
const testnetAddress = 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx';
const error = validateAddress(testnetAddress, Network.TESTNET);

console.log("Testnet address validation:");
console.log(error || "✅ Valid testnet address!");
console.log('');
console.log("⚠️  PRO TIP: Always test on testnet before mainnet!");
console.log("   Get free testnet coins at: coinfaucet.eu/en/btc-testnet");`}
                        imports={{ CaravanBitcoin }}
                        height="400px"
                    />
                </section>

                {/* Call to Action */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="my-12 p-8 bg-gradient-to-r from-primary/20 to-pkg-psbt/20 rounded-2xl border border-primary/30 text-center"
                >
                    <h2 className="text-3xl font-bold mb-4">Ready to Continue?</h2>
                    <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
                        You've taken your first steps with Caravan! Next, let's dive into Bitcoin
                        fundamentals and understand the concepts that make multisig work.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Button asChild size="lg" className="bg-primary hover:bg-primary-dark text-black font-bold">
                            <Link href="/learn/foundations/bitcoin-basics">
                                Continue to Bitcoin Basics
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href="/learn/overview">
                                View Full Course Outline
                            </Link>
                        </Button>
                    </div>
                </motion.section>

                {/* Quick Links */}
                <div className="grid md:grid-cols-3 gap-4 mt-12">
                    {[
                        { title: 'Playground', desc: 'Experiment freely', href: '/playground', icon: Terminal },
                        { title: 'Caravan App', desc: 'Production tool', href: 'https://www.caravanmultisig.com', icon: Rocket },
                        { title: 'GitHub', desc: 'Source code', href: 'https://github.com/caravan-bitcoin', icon: Code2 }
                    ].map((link) => {
                        const IconComponent = link.icon;
                        return (
                            <Card key={link.title} className="hover:border-primary/50 transition-all">
                                <CardContent className="pt-6">
                                    <Link
                                        href={link.href}
                                        target={link.href.startsWith('http') ? '_blank' : undefined}
                                        className="flex items-center gap-3"
                                    >
                                        <IconComponent className="w-8 h-8 text-primary" />
                                        <div>
                                            <div className="font-bold">{link.title}</div>
                                            <div className="text-sm text-text-muted">{link.desc}</div>
                                        </div>
                                        <ArrowRight className="w-5 h-5 ml-auto text-text-muted" />
                                    </Link>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}