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
    Key, TreePine, Layers, ArrowDown, ArrowRight, Shield, Lock,
    Unlock, Check, X, Sparkles, GitBranch, FolderTree, Boxes,
    ChevronRight, Copy, ExternalLink, AlertTriangle, Info, Zap,
    Network
} from 'lucide-react';
import * as CaravanBitcoin from '@caravan/bitcoin';

// ============================================
// ANIMATED VISUAL COMPONENTS
// ============================================

// Animated Seed to Tree visualization
const SeedToTreeAnimation = () => {
    const [step, setStep] = useState(0);
    const steps = ['seed', 'master', 'purpose', 'coin', 'account', 'addresses'];

    useEffect(() => {
        const timer = setInterval(() => {
            setStep((prev) => (prev + 1) % steps.length);
        }, 2000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative p-8 bg-gradient-to-br from-bg-secondary to-bg-tertiary rounded-2xl border border-border overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full">
                    <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <div className="relative flex flex-col items-center gap-6">
                {/* Seed */}
                <motion.div
                    className={`p-4 rounded-xl border-2 ${step >= 0 ? 'bg-primary/20 border-primary' : 'bg-bg-card border-border'}`}
                    animate={{ scale: step === 0 ? 1.1 : 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="flex items-center gap-3">
                        <Key className={`w-6 h-6 ${step >= 0 ? 'text-primary' : 'text-text-muted'}`} />
                        <div>
                            <div className="font-bold text-sm">Seed Phrase</div>
                            <div className="text-xs text-text-muted font-mono">
                                "abandon ability able..."
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Arrow */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: step >= 1 ? 1 : 0, y: step >= 1 ? 0 : -10 }}
                >
                    <ArrowDown className="w-5 h-5 text-primary" />
                </motion.div>

                {/* Master Key */}
                <motion.div
                    className={`p-4 rounded-xl border-2 ${step >= 1 ? 'bg-yellow-500/20 border-yellow-500' : 'bg-bg-card border-border'}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: step >= 1 ? 1 : 0.3,
                        scale: step === 1 ? 1.1 : 1
                    }}
                >
                    <div className="flex items-center gap-3">
                        <TreePine className={`w-6 h-6 ${step >= 1 ? 'text-yellow-500' : 'text-text-muted'}`} />
                        <div>
                            <div className="font-bold text-sm">Master Key (m)</div>
                            <div className="text-xs text-text-muted">Root of the tree</div>
                        </div>
                    </div>
                </motion.div>

                {/* Branching Tree */}
                <div className="flex gap-8 mt-4">
                    {/* BIP48 Branch */}
                    <motion.div
                        className="flex flex-col items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: step >= 2 ? 1 : 0.2, x: step >= 2 ? 0 : -20 }}
                    >
                        <div className="w-px h-6 bg-primary" />
                        <div className={`p-3 rounded-lg border ${step >= 2 ? 'bg-primary/10 border-primary' : 'bg-bg-card border-border'}`}>
                            <div className="text-xs font-mono font-bold">48'</div>
                            <div className="text-xs text-text-muted">Multisig</div>
                        </div>

                        <motion.div
                            className="flex flex-col items-center gap-2"
                            animate={{ opacity: step >= 3 ? 1 : 0.3 }}
                        >
                            <div className="w-px h-4 bg-blue-500" />
                            <div className={`p-2 rounded border ${step >= 3 ? 'bg-blue-500/10 border-blue-500' : 'bg-bg-card border-border'}`}>
                                <div className="text-xs font-mono">0'</div>
                                <div className="text-xs text-text-muted">BTC</div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="flex flex-col items-center gap-2"
                            animate={{ opacity: step >= 4 ? 1 : 0.3 }}
                        >
                            <div className="w-px h-4 bg-green-500" />
                            <div className={`p-2 rounded border ${step >= 4 ? 'bg-green-500/10 border-green-500' : 'bg-bg-card border-border'}`}>
                                <div className="text-xs font-mono">0'/2'</div>
                                <div className="text-xs text-text-muted">Account</div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="flex gap-2"
                            animate={{ opacity: step >= 5 ? 1 : 0.3 }}
                        >
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className={`p-2 rounded border text-center ${step >= 5 ? 'bg-purple-500/10 border-purple-500' : 'bg-bg-card border-border'}`}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: step >= 5 ? 1 : 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <div className="text-xs font-mono">{i}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Other branches (grayed out) */}
                    <motion.div
                        className="flex flex-col items-center gap-3 opacity-30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: step >= 2 ? 0.3 : 0 }}
                    >
                        <div className="w-px h-6 bg-text-muted" />
                        <div className="p-3 rounded-lg border bg-bg-card border-border">
                            <div className="text-xs font-mono">44'</div>
                            <div className="text-xs text-text-muted">Legacy</div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex flex-col items-center gap-3 opacity-30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: step >= 2 ? 0.3 : 0 }}
                    >
                        <div className="w-px h-6 bg-text-muted" />
                        <div className="p-3 rounded-lg border bg-bg-card border-border">
                            <div className="text-xs font-mono">84'</div>
                            <div className="text-xs text-text-muted">SegWit</div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Step indicator */}
            <div className="flex justify-center gap-2 mt-6">
                {steps.map((s, i) => (
                    <motion.div
                        key={s}
                        className={`w-2 h-2 rounded-full ${i === step ? 'bg-primary' : 'bg-text-muted/30'}`}
                        animate={{ scale: i === step ? 1.3 : 1 }}
                    />
                ))}
            </div>
        </div>
    );
};

// Interactive Derivation Path Builder
const DerivationPathBuilder = () => {
    const [purpose, setPurpose] = useState<'44' | '48' | '84' | '49'>('48');
    const [coinType, setCoinType] = useState<'0' | '1'>('0');
    const [account, setAccount] = useState(0);
    const [scriptType, setScriptType] = useState<'1' | '2'>('2');
    const [change, setChange] = useState<0 | 1>(0);
    const [index, setIndex] = useState(0);

    const purposeInfo = {
        '44': { name: 'Legacy (BIP44)', type: 'P2PKH', prefix: '1...', color: 'text-orange-500' },
        '49': { name: 'Nested SegWit (BIP49)', type: 'P2SH-P2WPKH', prefix: '3...', color: 'text-yellow-500' },
        '84': { name: 'Native SegWit (BIP84)', type: 'P2WPKH', prefix: 'bc1q...', color: 'text-blue-500' },
        '48': { name: 'Multisig (BIP48)', type: 'P2WSH', prefix: 'bc1q... (62 char)', color: 'text-primary' },
    };

    const buildPath = () => {
        if (purpose === '48') {
            return `m/${purpose}'/${coinType}'/${account}'/${scriptType}'/${change}/${index}`;
        }
        return `m/${purpose}'/${coinType}'/${account}'/${change}/${index}`;
    };

    return (
        <div className="p-6 bg-bg-secondary rounded-2xl border border-border">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-primary" />
                Interactive Path Builder
            </h3>

            {/* Path Display */}
            <div className="mb-6 p-4 bg-bg-tertiary rounded-xl">
                <div className="text-xs text-text-muted mb-2">Your Derivation Path:</div>
                <div className="font-mono text-xl text-primary font-bold break-all">
                    {buildPath()}
                </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Purpose */}
                <div>
                    <label className="text-xs text-text-muted block mb-2">Purpose (Standard)</label>
                    <div className="grid grid-cols-2 gap-1">
                        {(['44', '49', '84', '48'] as const).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPurpose(p)}
                                className={`px-3 py-2 rounded text-xs font-mono transition-all ${purpose === p
                                    ? 'bg-primary text-black font-bold'
                                    : 'bg-bg-card hover:bg-bg-tertiary'
                                    }`}
                            >
                                {p}'
                            </button>
                        ))}
                    </div>
                </div>

                {/* Coin Type */}
                <div>
                    <label className="text-xs text-text-muted block mb-2">Coin Type</label>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setCoinType('0')}
                            className={`flex-1 px-3 py-2 rounded text-xs transition-all ${coinType === '0'
                                ? 'bg-primary text-black font-bold'
                                : 'bg-bg-card hover:bg-bg-tertiary'
                                }`}
                        >
                            0' (Mainnet)
                        </button>
                        <button
                            onClick={() => setCoinType('1')}
                            className={`flex-1 px-3 py-2 rounded text-xs transition-all ${coinType === '1'
                                ? 'bg-primary text-black font-bold'
                                : 'bg-bg-card hover:bg-bg-tertiary'
                                }`}
                        >
                            1' (Testnet)
                        </button>
                    </div>
                </div>

                {/* Account */}
                <div>
                    <label className="text-xs text-text-muted block mb-2">Account</label>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setAccount(Math.max(0, account - 1))}
                            className="px-3 py-2 rounded bg-bg-card hover:bg-bg-tertiary"
                        >
                            -
                        </button>
                        <span className="font-mono flex-1 text-center">{account}'</span>
                        <button
                            onClick={() => setAccount(account + 1)}
                            className="px-3 py-2 rounded bg-bg-card hover:bg-bg-tertiary"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Script Type (BIP48 only) */}
                {purpose === '48' && (
                    <div>
                        <label className="text-xs text-text-muted block mb-2">Script Type</label>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setScriptType('1')}
                                className={`flex-1 px-2 py-2 rounded text-xs transition-all ${scriptType === '1'
                                    ? 'bg-primary text-black font-bold'
                                    : 'bg-bg-card hover:bg-bg-tertiary'
                                    }`}
                            >
                                1' (P2SH-P2WSH)
                            </button>
                            <button
                                onClick={() => setScriptType('2')}
                                className={`flex-1 px-2 py-2 rounded text-xs transition-all ${scriptType === '2'
                                    ? 'bg-primary text-black font-bold'
                                    : 'bg-bg-card hover:bg-bg-tertiary'
                                    }`}
                            >
                                2' (P2WSH) ⭐
                            </button>
                        </div>
                    </div>
                )}

                {/* Change */}
                <div>
                    <label className="text-xs text-text-muted block mb-2">Change</label>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setChange(0)}
                            className={`flex-1 px-3 py-2 rounded text-xs transition-all ${change === 0
                                ? 'bg-primary text-black font-bold'
                                : 'bg-bg-card hover:bg-bg-tertiary'
                                }`}
                        >
                            0 (Receive)
                        </button>
                        <button
                            onClick={() => setChange(1)}
                            className={`flex-1 px-3 py-2 rounded text-xs transition-all ${change === 1
                                ? 'bg-primary text-black font-bold'
                                : 'bg-bg-card hover:bg-bg-tertiary'
                                }`}
                        >
                            1 (Change)
                        </button>
                    </div>
                </div>

                {/* Index */}
                <div>
                    <label className="text-xs text-text-muted block mb-2">Address Index</label>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIndex(Math.max(0, index - 1))}
                            className="px-3 py-2 rounded bg-bg-card hover:bg-bg-tertiary"
                        >
                            -
                        </button>
                        <span className="font-mono flex-1 text-center">{index}</span>
                        <button
                            onClick={() => setIndex(index + 1)}
                            className="px-3 py-2 rounded bg-bg-card hover:bg-bg-tertiary"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>

            {/* Result Info */}
            <div className="mt-6 p-4 bg-bg-card rounded-xl border border-border">
                <div className={`font-bold ${purposeInfo[purpose].color}`}>
                    {purposeInfo[purpose].name}
                </div>
                <div className="text-sm text-text-muted mt-1">
                    Type: {purposeInfo[purpose].type} • Addresses start with: {purposeInfo[purpose].prefix}
                </div>
            </div>
        </div>
    );
};

// Hardened vs Non-Hardened Visualization
const HardenedVisualization = () => {
    const [hoveredType, setHoveredType] = useState<'hardened' | 'normal' | null>(null);

    return (
        <div className="grid md:grid-cols-2 gap-6">
            {/* Hardened */}
            <motion.div
                className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${hoveredType === 'hardened'
                    ? 'bg-green-500/20 border-green-500 shadow-lg shadow-green-500/20'
                    : 'bg-bg-secondary border-border'
                    }`}
                onMouseEnter={() => setHoveredType('hardened')}
                onMouseLeave={() => setHoveredType(null)}
                whileHover={{ scale: 1.02 }}
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-green-500/20">
                        <Lock className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                        <h4 className="font-bold">Hardened Derivation</h4>
                        <code className="text-sm text-primary">m/48'/0'/0'</code>
                    </div>
                </div>

                <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Requires parent <strong>private key</strong></span>
                    </div>
                    <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>More secure - leaked child doesn't expose parent</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>Used for upper levels (purpose, coin, account)</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                        <span>Cannot derive from xpub alone</span>
                    </div>
                </div>

                <div className="mt-4 p-3 bg-bg-tertiary rounded-lg">
                    <div className="text-xs text-text-muted mb-1">Marked with apostrophe:</div>
                    <code className="text-primary">48' = hardened at index 48</code>
                </div>
            </motion.div>

            {/* Non-Hardened */}
            <motion.div
                className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${hoveredType === 'normal'
                    ? 'bg-blue-500/20 border-blue-500 shadow-lg shadow-blue-500/20'
                    : 'bg-bg-secondary border-border'
                    }`}
                onMouseEnter={() => setHoveredType('normal')}
                onMouseLeave={() => setHoveredType(null)}
                whileHover={{ scale: 1.02 }}
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-blue-500/20">
                        <Unlock className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <h4 className="font-bold">Non-Hardened (Normal)</h4>
                        <code className="text-sm text-primary">m/.../0/0</code>
                    </div>
                </div>

                <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-blue-500 mt-0.5" />
                        <span>Can derive from <strong>public key only</strong></span>
                    </div>
                    <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-blue-500 mt-0.5" />
                        <span>Enables watch-only wallets</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-blue-500 mt-0.5" />
                        <span>Used for lower levels (change, address index)</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                        <span>Leaked key + parent xpub = danger!</span>
                    </div>
                </div>

                <div className="mt-4 p-3 bg-bg-tertiary rounded-lg">
                    <div className="text-xs text-text-muted mb-1">No apostrophe:</div>
                    <code className="text-primary">0 = non-hardened at index 0</code>
                </div>
            </motion.div>
        </div>
    );
};

// Caravan's Braid Model Explanation
const CaravanBraidExplanation = () => {
    const [activeTab, setActiveTab] = useState<'standard' | 'caravan'>('standard');

    return (
        <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border border-primary/30">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/20">
                    <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-xl font-bold">Caravan's Unique Approach: The Braid Model</h3>
                    <p className="text-sm text-text-muted">How Unchained/Caravan handles derivation differently</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab('standard')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'standard'
                        ? 'bg-text-muted/20 text-text-primary'
                        : 'text-text-muted hover:text-text-primary'
                        }`}
                >
                    Standard Approach
                </button>
                <button
                    onClick={() => setActiveTab('caravan')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'caravan'
                        ? 'bg-primary text-black'
                        : 'text-text-muted hover:text-text-primary'
                        }`}
                >
                    Caravan's Braid Model ⭐
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'standard' ? (
                    <motion.div
                        key="standard"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
                        <div className="p-4 bg-bg-secondary rounded-xl">
                            <h4 className="font-bold mb-2">Traditional BIP48 Multisig</h4>
                            <div className="font-mono text-sm bg-bg-tertiary p-3 rounded mb-3">
                                m/48'/0'/0'/2'/0/0
                            </div>
                            <ul className="text-sm text-text-muted space-y-2">
                                <li>• Each wallet needs new xpub export from device</li>
                                <li>• Strict path enforcement by hardware wallets</li>
                                <li>• Cannot create new wallets without device</li>
                                <li>• Path indicates script type (signer knows how to hash)</li>
                            </ul>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="caravan"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
                        <div className="p-4 bg-bg-secondary rounded-xl">
                            <h4 className="font-bold mb-2 text-primary">Caravan's Account Key → Wallet Model</h4>

                            {/* Visual diagram */}
                            <div className="my-4 p-4 bg-bg-tertiary rounded-xl">
                                <div className="flex flex-col md:flex-row items-center gap-4">
                                    {/* Spool */}
                                    <div className="text-center">
                                        <div className="p-3 bg-primary/20 rounded-lg inline-block mb-2">
                                            <Boxes className="w-8 h-8 text-primary" />
                                        </div>
                                        <div className="font-bold text-sm">Account Key (Spool)</div>
                                        <code className="text-xs text-text-muted">m/45'/0'/0'</code>
                                    </div>

                                    <ArrowRight className="w-6 h-6 text-primary hidden md:block" />
                                    <ArrowDown className="w-6 h-6 text-primary md:hidden" />

                                    {/* Strands */}
                                    <div className="flex gap-2">
                                        {[0, 1, 2].map((i) => (
                                            <div key={i} className="text-center">
                                                <div className="p-2 bg-blue-500/20 rounded-lg inline-block mb-1">
                                                    <GitBranch className="w-5 h-5 text-blue-500" />
                                                </div>
                                                <div className="text-xs font-bold">Strand {i}</div>
                                                <code className="text-xs text-text-muted">.../0'/{i}</code>
                                            </div>
                                        ))}
                                    </div>

                                    <ArrowRight className="w-6 h-6 text-primary hidden md:block" />
                                    <ArrowDown className="w-6 h-6 text-primary md:hidden" />

                                    {/* Wallets */}
                                    <div className="text-center">
                                        <div className="p-3 bg-green-500/20 rounded-lg inline-block mb-2">
                                            <Network className="w-8 h-8 text-green-500" />
                                        </div>
                                        <div className="font-bold text-sm">Wallets</div>
                                        <div className="text-xs text-text-muted">Unlimited!</div>
                                    </div>
                                </div>
                            </div>

                            <ul className="text-sm text-text-muted space-y-2">
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                                    <span><strong>One-time import:</strong> Upload account key once, create unlimited wallets</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                                    <span><strong>Non-interactive:</strong> New wallets without reconnecting device</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                                    <span><strong>Key sharing:</strong> Share keys with connections easily</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                                    <span><strong>Script type flexibility:</strong> Descriptor defines type, not path</span>
                                </li>
                            </ul>
                        </div>

                        <Callout type="info" title="Why This Matters for SegWit">
                            <p>
                                Because Caravan uses <strong>descriptors</strong> (not paths) to define script type,
                                upgrading from P2SH to P2WSH (SegWit) doesn't require new key exports.
                                The same account key can be used in both legacy and SegWit wallets!
                            </p>
                        </Callout>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function HDWalletsPage() {
    return (
        <div className="prose prose-invert max-w-none">
            {/* Header */}
            <div className="not-prose mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
                >
                    Chapter 3
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl font-bold mb-4"
                >
                    HD Wallets & Derivation Paths
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-text-secondary"
                >
                    Hierarchical Deterministic wallets revolutionized Bitcoin by allowing unlimited
                    addresses from a single seed. Learn how they work and how Caravan uses them.
                </motion.p>
            </div>

            {/* Visual Introduction */}
            <section className="not-prose mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <TreePine className="w-7 h-7 text-primary" />
                    From Seed to Addresses
                </h2>
                <SeedToTreeAnimation />
            </section>

            {/* Problem/Solution */}
            <h2>The Problem HD Wallets Solve</h2>

            <div className="not-prose my-8 grid md:grid-cols-2 gap-6">
                <Card className="border-red-500/30">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <X className="w-5 h-5 text-red-500" />
                            Old Way (Random Keys)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-text-secondary">
                        <p>Before HD wallets, each address needed its own private key:</p>
                        <ul className="space-y-2">
                            <li>• Generated random keys for each address</li>
                            <li>• Had to backup every single key</li>
                            <li>• Lost keys = lost Bitcoin forever</li>
                            <li>• Managing 100s of keys was a nightmare</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-green-500/30">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Check className="w-5 h-5 text-green-500" />
                            HD Wallets (BIP32)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-text-secondary">
                        <p>HD wallets derive everything from one seed:</p>
                        <ul className="space-y-2">
                            <li>• One seed → unlimited addresses</li>
                            <li>• Only backup seed phrase once</li>
                            <li>• Deterministic: same seed = same keys</li>
                            <li>• New address for every transaction</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Interactive Path Builder */}
            <h2>Build Your Derivation Path</h2>

            <p>
                Derivation paths are like addresses in a filing system. Each level narrows
                down to a specific key. Try building a path below:
            </p>

            <div className="not-prose my-8">
                <DerivationPathBuilder />
            </div>

            {/* BIP Standards */}
            <h2>BIP Standards Explained</h2>

            <p>
                Different BIPs define standards for different wallet types. Here's what each means:
            </p>

            <CodePlayground
                title="Understanding BIP Standards"
                initialCode={`// BIP standards define derivation path conventions
// Each standard has a specific purpose

const standards = {
  "BIP44": {
    path: "m/44'/0'/0'/0/0",
    type: "Legacy (P2PKH)",
    addresses: "Start with 1...",
    fees: "Highest fees",
    use: "Original standard, maximum compatibility"
  },
  "BIP49": {
    path: "m/49'/0'/0'/0/0",
    type: "Wrapped SegWit (P2SH-P2WPKH)",
    addresses: "Start with 3...",
    fees: "Medium fees",
    use: "Backwards compatible SegWit"
  },
  "BIP84": {
    path: "m/84'/0'/0'/0/0",
    type: "Native SegWit (P2WPKH)",
    addresses: "Start with bc1q... (42 chars)",
    fees: "Lower fees",
    use: "Single-sig, modern wallets"
  },
  "BIP48": {
    path: "m/48'/0'/0'/2'/0/0",
    type: "Native SegWit Multisig (P2WSH)",
    addresses: "Start with bc1q... (62 chars)",
    fees: "Lowest for multisig",
    use: "⭐ RECOMMENDED for Caravan multisig!"
  }
};

console.log("=== Bitcoin Derivation Standards ===\\n");

for (const [bip, info] of Object.entries(standards)) {
  console.log(\`📌 \${bip}\`);
  console.log(\`   Path: \${info.path}\`);
  console.log(\`   Type: \${info.type}\`);
  console.log(\`   Addresses: \${info.addresses}\`);
  console.log(\`   \${info.fees}\`);
  console.log(\`   Use: \${info.use}\\n\`);
}

console.log("💡 For Caravan multisig, use BIP48 with script type 2' (P2WSH)");`}
                imports={{ CaravanBitcoin }}
                height="480px"
            />

            {/* Hardened vs Non-Hardened */}
            <h2>Hardened vs Non-Hardened Derivation</h2>

            <p>
                Notice the apostrophe (') in paths like <code>m/48'/0'/0'</code>?
                This indicates <strong>hardened derivation</strong>. Understanding the
                difference is crucial for security:
            </p>

            <div className="not-prose my-8">
                <HardenedVisualization />
            </div>

            <Callout type="warning" title="Security Implication">
                <p>
                    If a non-hardened child private key is leaked AND the parent xpub is known,
                    an attacker can derive ALL sibling private keys! This is why we use hardened
                    derivation for the upper levels of the path.
                </p>
            </Callout>

            {/* Caravan Specific Section */}
            <h2>How Caravan Handles Derivation</h2>

            <p>
                Caravan takes a unique approach to derivation paths that offers significant
                usability benefits for collaborative custody. This is called the <strong>Braid Model</strong>:
            </p>

            <div className="not-prose my-8">
                <CaravanBraidExplanation />
            </div>

            {/* Practical Code Example */}
            <h2>Working with Paths in Caravan</h2>

            <p>
                Let's see how Caravan validates and works with derivation paths:
            </p>

            <CodePlayground
                title="Caravan Path Validation"
                initialCode={`// Caravan provides utilities for working with BIP32 paths

const { validateBIP32Path, bip32PathToSequence } = CaravanBitcoin;

// Example paths to validate
const paths = [
  "m/48'/0'/0'/2'/0/0",  // Valid BIP48 multisig (mainnet)
  "m/48'/1'/0'/2'/0/0",  // Valid BIP48 multisig (testnet)
  "m/45'/0'/0'",         // Valid Caravan account key path
  "m/44'/0'/0'/0/0",     // Valid BIP44 legacy
  "invalid/path",        // Invalid
  "m/48/0/0",            // Missing hardened markers
];

console.log("=== Path Validation Results ===\\n");

paths.forEach(path => {
  const error = validateBIP32Path(path);
  
  if (error) {
    console.log(\`❌ "\${path}"\`);
    console.log(\`   Error: \${error}\\n\`);
  } else {
    console.log(\`✅ "\${path}"\`);
    
    // Parse the path into indices
    try {
      const indices = bip32PathToSequence(path);
      console.log(\`   Indices: [\${indices.join(', ')}]\`);
      
      // Check if it looks like a Caravan path
      if (path.startsWith("m/45'")) {
        console.log(\`   Type: Caravan Account Key (Spool)\`);
      } else if (path.startsWith("m/48'")) {
        console.log(\`   Type: BIP48 Multisig\`);
      } else if (path.startsWith("m/44'")) {
        console.log(\`   Type: BIP44 Legacy\`);
      }
    } catch (e) {
      console.log(\`   (Could not parse indices)\`);
    }
    console.log('');
  }
});

console.log("💡 Caravan uses m/45' for account keys (spools)");
console.log("   Then derives wallet keys with additional depth");`}
                imports={{ CaravanBitcoin }}
                height="520px"
            />

            {/* SegWit Migration Explanation */}
            <h2>The SegWit Upgrade Path</h2>

            <p>
                One of the advantages of Caravan's approach is seamless SegWit upgrades.
                Here's how it works:
            </p>

            <div className="not-prose my-8 p-6 bg-bg-secondary rounded-2xl border border-border">
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4">
                        <div className="text-4xl mb-3">1️⃣</div>
                        <h4 className="font-bold mb-2">Same Account Key</h4>
                        <p className="text-sm text-text-muted">
                            Your existing <code>m/45'/...</code> account key works for both legacy and SegWit
                        </p>
                    </div>
                    <div className="text-center p-4">
                        <div className="text-4xl mb-3">2️⃣</div>
                        <h4 className="font-bold mb-2">Descriptor Defines Type</h4>
                        <p className="text-sm text-text-muted">
                            Script type is specified in the wallet descriptor, not the path
                        </p>
                    </div>
                    <div className="text-center p-4">
                        <div className="text-4xl mb-3">3️⃣</div>
                        <h4 className="font-bold mb-2">Create New Vault</h4>
                        <p className="text-sm text-text-muted">
                            Simply create a new vault to get SegWit addresses - no re-export needed!
                        </p>
                    </div>
                </div>
            </div>

            <Callout type="tip" title="Practical Tip">
                <p>
                    When using Caravan with Unchained, you don't need to worry about exporting
                    different xpubs for SegWit. The platform handles it automatically using your
                    existing account key. Just create a new vault and choose the SegWit option!
                </p>
            </Callout>

            {/* Key Takeaways */}
            <h2>Key Takeaways</h2>

            <div className="not-prose my-6">
                <Card className="bg-primary/5 border-primary/30">
                    <CardContent className="pt-6">
                        <ul className="space-y-3 text-text-secondary">
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>HD wallets generate unlimited keys from one seed using BIP32</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>BIP48 (m/48'/coin'/account'/script'/...) is the standard for multisig</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Hardened derivation (') provides security for upper path levels</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Caravan uses the Braid model for flexible key management</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Descriptors (not paths) define script types in Caravan</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>SegWit upgrades don't require new key exports in Caravan</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <h2>What's Next?</h2>

            <p>
                Now you understand HD wallets and how Caravan handles derivation!
                Next, we'll dive into <strong>multisig basics</strong> and learn how multiple
                signatures work together to secure your Bitcoin.
            </p>

            <PageNavigation />
        </div>
    );
}