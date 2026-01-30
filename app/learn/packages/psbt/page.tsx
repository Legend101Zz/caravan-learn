/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Callout } from '@/components/content/callout';
import { PageNavigation } from '@/components/layout/page-navigation';
import {
    ArrowRight,
    Users,
    FileText,
    Shield,
    Laptop,
    Smartphone,
    HardDrive,
    CheckCircle2,
    XCircle,
    Layers,
    Send,
    Lock,
    Unlock,
    Zap,
    RefreshCw,
    Eye,
    PenTool,
    Merge,
    Package
} from 'lucide-react';

// Hand-drawn style underline
const DoodleUnderline = () => (
    <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" preserveAspectRatio="none">
        <motion.path
            d="M0 8 Q 50 2, 100 8 T 200 8"
            stroke="#E8813B"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
        />
    </svg>
);

// Animated data packet
const DataPacket = ({
    delay = 0,
    fromX,
    toX,
    y,
    color = "#E8813B",
    label
}: {
    delay?: number;
    fromX: number;
    toX: number;
    y: number;
    color?: string;
    label?: string;
}) => (
    <motion.g
        initial={{ x: fromX, opacity: 0 }}
        animate={{
            x: [fromX, toX],
            opacity: [0, 1, 1, 0]
        }}
        transition={{
            duration: 3,
            delay,
            repeat: Infinity,
            repeatDelay: 2,
            ease: "easeInOut"
        }}
    >
        <rect
            x={0}
            y={y - 10}
            width={40}
            height={20}
            rx={4}
            fill={color}
            opacity={0.9}
        />
        <text
            x={20}
            y={y + 4}
            textAnchor="middle"
            fill="white"
            fontSize="8"
            fontWeight="bold"
        >
            {label || "PSBT"}
        </text>
    </motion.g>
);

// The Problem Visualization - Before PSBT
const BeforePSBTVisualization = () => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStep(s => (s + 1) % 5);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    const participants = [
        { name: "Alice", x: 80, y: 60, icon: Laptop },
        { name: "Bob", x: 300, y: 60, icon: HardDrive },
        { name: "Carol", x: 190, y: 180, icon: Smartphone }
    ];

    const messages = [
        { from: 0, to: 1, label: "raw tx?", step: 0 },
        { from: 1, to: 0, label: "which inputs?", step: 1 },
        { from: 0, to: 2, label: "sign this?", step: 2 },
        { from: 2, to: 0, label: "format error!", step: 3 },
        { from: 1, to: 2, label: "incompatible!", step: 4 }
    ];

    return (
        <div className="relative w-full h-64 bg-gradient-to-br from-red-950/20 to-bg-secondary rounded-xl border border-red-500/30 overflow-hidden">
            <svg viewBox="0 0 380 220" className="w-full h-full">
                {/* Connection lines (chaotic) */}
                <motion.path
                    d="M 100 80 Q 190 40, 280 80"
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    fill="none"
                    animate={{ strokeDashoffset: [0, -20] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <motion.path
                    d="M 100 80 L 190 160"
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    fill="none"
                    animate={{ strokeDashoffset: [0, -20] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <motion.path
                    d="M 280 80 L 190 160"
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    fill="none"
                    animate={{ strokeDashoffset: [0, -20] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />

                {/* Participants */}
                {participants.map((p, i) => {
                    const Icon = p.icon;
                    return (
                        <g key={i}>
                            <motion.circle
                                cx={p.x}
                                cy={p.y}
                                r={30}
                                fill="#1a1a2e"
                                stroke="#ef4444"
                                strokeWidth="2"
                                animate={{
                                    scale: step === i || messages.find(m => (m.from === i || m.to === i) && m.step === step) ? [1, 1.1, 1] : 1
                                }}
                                transition={{ duration: 0.3 }}
                            />
                            <text
                                x={p.x}
                                y={p.y + 50}
                                textAnchor="middle"
                                fill="#f5f5f5"
                                fontSize="12"
                                fontWeight="bold"
                            >
                                {p.name}
                            </text>
                        </g>
                    );
                })}

                {/* Animated error messages */}
                <AnimatePresence mode="wait">
                    {messages.filter(m => m.step === step).map((msg, i) => (
                        <motion.g
                            key={`${msg.from}-${msg.to}-${step}`}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                        >
                            <rect
                                x={(participants[msg.from].x + participants[msg.to].x) / 2 - 35}
                                y={(participants[msg.from].y + participants[msg.to].y) / 2 - 12}
                                width={70}
                                height={24}
                                rx={4}
                                fill="#dc2626"
                            />
                            <text
                                x={(participants[msg.from].x + participants[msg.to].x) / 2}
                                y={(participants[msg.from].y + participants[msg.to].y) / 2 + 4}
                                textAnchor="middle"
                                fill="white"
                                fontSize="10"
                                fontWeight="bold"
                            >
                                {msg.label}
                            </text>
                        </motion.g>
                    ))}
                </AnimatePresence>

                {/* Confusion icons */}
                <motion.text
                    x="340"
                    y="30"
                    fontSize="24"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    😵
                </motion.text>
            </svg>

            <div className="absolute bottom-3 left-3 right-3 bg-red-950/80 rounded px-3 py-2">
                <div className="text-xs text-red-300 font-semibold">
                    ❌ Before PSBT: Incompatible formats, manual coordination, security risks
                </div>
            </div>
        </div>
    );
};

// The Solution Visualization - With PSBT
const WithPSBTVisualization = () => {
    const [currentRole, setCurrentRole] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentRole(r => (r + 1) % 6);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const roles = [
        { name: "Creator", icon: FileText, color: "#22c55e", desc: "Initialize PSBT" },
        { name: "Updater", icon: RefreshCw, color: "#3b82f6", desc: "Add metadata" },
        { name: "Signer 1", icon: PenTool, color: "#E8813B", desc: "Add signature" },
        { name: "Signer 2", icon: PenTool, color: "#E8813B", desc: "Add signature" },
        { name: "Combiner", icon: Merge, color: "#a855f7", desc: "Merge PSBTs" },
        { name: "Finalizer", icon: Package, color: "#06b6d4", desc: "Complete tx" }
    ];

    return (
        <div className="relative w-full h-64 bg-gradient-to-br from-green-950/20 to-bg-secondary rounded-xl border border-green-500/30 overflow-hidden">
            <svg viewBox="0 0 380 220" className="w-full h-full">
                {/* Flow line */}
                <motion.path
                    d="M 30 110 H 350"
                    stroke="#22c55e"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />

                {/* Role nodes */}
                {roles.map((role, i) => {
                    const x = 40 + i * 55;
                    const isActive = i === currentRole;
                    const isPast = i < currentRole;

                    return (
                        <g key={i}>
                            <motion.circle
                                cx={x}
                                cy={110}
                                r={isActive ? 22 : 18}
                                fill={isPast || isActive ? role.color : "#374151"}
                                stroke={isActive ? "#fff" : "transparent"}
                                strokeWidth={3}
                                animate={{
                                    scale: isActive ? [1, 1.15, 1] : 1
                                }}
                                transition={{ duration: 0.5, repeat: isActive ? Infinity : 0 }}
                            />
                            <text
                                x={x}
                                y={155}
                                textAnchor="middle"
                                fill="#f5f5f5"
                                fontSize="9"
                                fontWeight="bold"
                            >
                                {role.name}
                            </text>
                            {isActive && (
                                <motion.text
                                    x={x}
                                    y={180}
                                    textAnchor="middle"
                                    fill={role.color}
                                    fontSize="8"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    {role.desc}
                                </motion.text>
                            )}
                        </g>
                    );
                })}

                {/* PSBT packet animation */}
                <motion.g
                    animate={{
                        x: 40 + currentRole * 55 - 20
                    }}
                    transition={{ duration: 0.5 }}
                >
                    <rect
                        x={0}
                        y={55}
                        width={40}
                        height={20}
                        rx={4}
                        fill="#E8813B"
                    />
                    <text
                        x={20}
                        y={69}
                        textAnchor="middle"
                        fill="white"
                        fontSize="9"
                        fontWeight="bold"
                    >
                        PSBT
                    </text>
                </motion.g>

                {/* Progress indicator */}
                <motion.rect
                    x={30}
                    y={200}
                    width={(currentRole + 1) * 53}
                    height={6}
                    rx={3}
                    fill="#22c55e"
                    initial={{ width: 0 }}
                    animate={{ width: (currentRole + 1) * 53 }}
                    transition={{ duration: 0.5 }}
                />
                <rect
                    x={30}
                    y={200}
                    width={318}
                    height={6}
                    rx={3}
                    fill="#374151"
                    style={{ zIndex: -1 }}
                />
            </svg>

            <div className="absolute bottom-3 left-3 right-3 bg-green-950/80 rounded px-3 py-2">
                <div className="text-xs text-green-300 font-semibold">
                    ✓ With PSBT: Standardized format, clear roles, secure coordination
                </div>
            </div>
        </div>
    );
};

// PSBT Structure Visual
const PSBTStructureVisual = () => {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    const sections = [
        { id: 'magic', name: 'Magic Bytes', bytes: '70 73 62 74 ff', color: '#E8813B', desc: '"psbt" + separator - identifies this as a PSBT' },
        { id: 'global', name: 'Global Map', bytes: '01 00 fd...', color: '#22c55e', desc: 'Transaction-wide data: unsigned tx, xpubs, version' },
        { id: 'inputs', name: 'Input Maps', bytes: '02 00 00...', color: '#3b82f6', desc: 'Per-input data: UTXOs, scripts, derivation paths, signatures' },
        { id: 'outputs', name: 'Output Maps', bytes: '03 00 00...', color: '#a855f7', desc: 'Per-output data: amounts, scripts, derivation paths' }
    ];

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2 justify-center">
                {sections.map((section) => (
                    <motion.button
                        key={section.id}
                        className="px-4 py-3 rounded-lg border-2 transition-all"
                        style={{
                            borderColor: activeSection === section.id ? section.color : '#374151',
                            backgroundColor: activeSection === section.id ? `${section.color}20` : 'transparent'
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onMouseEnter={() => setActiveSection(section.id)}
                        onMouseLeave={() => setActiveSection(null)}
                    >
                        <div className="font-semibold text-sm" style={{ color: section.color }}>
                            {section.name}
                        </div>
                        <div className="font-mono text-xs text-text-muted mt-1">
                            {section.bytes}
                        </div>
                    </motion.button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeSection && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 rounded-lg bg-bg-tertiary border border-border text-center"
                    >
                        <p className="text-sm text-text-secondary">
                            {sections.find(s => s.id === activeSection)?.desc}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Role Cards Component
const RoleCard = ({
    icon: Icon,
    name,
    description,
    responsibilities,
    color
}: {
    icon: any;
    name: string;
    description: string;
    responsibilities: string[];
    color: string;
}) => (
    <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        className="p-4 rounded-xl border-2 bg-bg-secondary"
        style={{ borderColor: `${color}50` }}
    >
        <div className="flex items-center gap-3 mb-3">
            <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${color}20` }}
            >
                <Icon size={20} style={{ color }} />
            </div>
            <div>
                <h4 className="font-bold" style={{ color }}>{name}</h4>
                <p className="text-xs text-text-muted">{description}</p>
            </div>
        </div>
        <ul className="space-y-1">
            {responsibilities.map((r, i) => (
                <li key={i} className="text-xs text-text-secondary flex items-start gap-2">
                    <span style={{ color }}>•</span>
                    {r}
                </li>
            ))}
        </ul>
    </motion.div>
);

export default function PSBTIntroPage() {
    return (
        <div className="prose prose-invert max-w-none">
            {/* Hero Section */}
            <div className="not-prose mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="inline-block px-4 py-2 rounded-full bg-pkg-psbt/20 text-pkg-psbt text-sm font-bold mb-4">
                        📜 Chapter 4: PSBTs Deep Dive
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black mb-4 relative inline-block">
                        Partially Signed Bitcoin Transactions
                        <DoodleUnderline />
                    </h1>
                    <p className="text-xl text-text-secondary max-w-3xl mx-auto mt-6">
                        The universal language for Bitcoin transaction coordination.
                        Learn how PSBTs enable secure multisig, hardware wallet integration,
                        and collaborative transactions.
                    </p>
                </motion.div>
            </div>

            <h2>The Problem PSBT Solves</h2>

            <p>
                Before PSBTs, coordinating a multisig transaction was a nightmare.
                Different wallets used different formats, hardware devices couldn't
                communicate with software wallets, and there was no standard way to
                pass partially-signed transactions between parties.
            </p>

            <div className="not-prose my-8 grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-bold text-red-400 mb-3 flex items-center gap-2">
                        <XCircle size={20} />
                        Before PSBT
                    </h3>
                    <BeforePSBTVisualization />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                        <CheckCircle2 size={20} />
                        With PSBT
                    </h3>
                    <WithPSBTVisualization />
                </div>
            </div>

            <Callout type="info" title="Why PSBT Matters">
                <p>
                    PSBTs were introduced in <strong>BIP-174</strong> to solve the interoperability
                    problem. They provide a standardized container format that any wallet can read
                    and write, enabling seamless coordination between different devices and software.
                </p>
            </Callout>

            <h2>Key Benefits of PSBT</h2>

            <div className="not-prose my-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { icon: Shield, title: "Secure Signing", desc: "Private keys never leave the signing device", color: "#22c55e" },
                    { icon: Users, title: "Multi-Party", desc: "Multiple signers can collaborate safely", color: "#3b82f6" },
                    { icon: Laptop, title: "Interoperable", desc: "Works across all major wallets", color: "#E8813B" },
                    { icon: Layers, title: "Self-Contained", desc: "All signing data in one package", color: "#a855f7" }
                ].map((benefit, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 rounded-xl bg-bg-secondary border border-border hover:border-primary/50 transition-colors"
                    >
                        <benefit.icon size={32} style={{ color: benefit.color }} className="mb-3" />
                        <h4 className="font-bold mb-1">{benefit.title}</h4>
                        <p className="text-sm text-text-muted">{benefit.desc}</p>
                    </motion.div>
                ))}
            </div>

            <h2>PSBT Structure Overview</h2>

            <p>
                A PSBT is a binary format that starts with magic bytes and contains
                multiple key-value maps. Here's the high-level structure:
            </p>

            <div className="not-prose my-8">
                <Card className="bg-bg-secondary">
                    <CardContent className="pt-6">
                        <PSBTStructureVisual />
                    </CardContent>
                </Card>
            </div>

            <h2>The PSBT Roles</h2>

            <p>
                BIP-174 defines specific roles, each with distinct responsibilities.
                A single application (like Caravan) can perform multiple roles:
            </p>

            <div className="not-prose my-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <RoleCard
                    icon={FileText}
                    name="Creator"
                    description="Initializes the PSBT"
                    color="#22c55e"
                    responsibilities={[
                        "Creates empty PSBT with unsigned transaction",
                        "Sets inputs and outputs",
                        "Does NOT add signing data"
                    ]}
                />
                <RoleCard
                    icon={RefreshCw}
                    name="Updater"
                    description="Adds signing metadata"
                    color="#3b82f6"
                    responsibilities={[
                        "Adds UTXO information",
                        "Adds redeem/witness scripts",
                        "Adds BIP32 derivation paths"
                    ]}
                />
                <RoleCard
                    icon={PenTool}
                    name="Signer"
                    description="Adds signatures"
                    color="#E8813B"
                    responsibilities={[
                        "Verifies transaction details",
                        "Signs with private key(s)",
                        "Adds partial signatures to PSBT"
                    ]}
                />
                <RoleCard
                    icon={Merge}
                    name="Combiner"
                    description="Merges PSBTs"
                    color="#a855f7"
                    responsibilities={[
                        "Combines multiple PSBTs",
                        "Merges partial signatures",
                        "Handles parallel signing"
                    ]}
                />
                <RoleCard
                    icon={Package}
                    name="Finalizer"
                    description="Completes inputs"
                    color="#06b6d4"
                    responsibilities={[
                        "Constructs final scriptSig/witness",
                        "Removes unnecessary fields",
                        "Prepares for extraction"
                    ]}
                />
                <RoleCard
                    icon={Send}
                    name="Extractor"
                    description="Produces final transaction"
                    color="#f43f5e"
                    responsibilities={[
                        "Extracts complete transaction",
                        "Produces broadcastable format",
                        "Verifies all signatures present"
                    ]}
                />
            </div>

            <h2>PSBT Versions</h2>

            <div className="not-prose my-8 grid md:grid-cols-2 gap-6">
                <Card className="border-pkg-psbt/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded bg-pkg-psbt/20 text-pkg-psbt text-sm">v0</span>
                            BIP-174: PSBTv0
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-sm text-text-secondary">
                            The original PSBT specification. Widely supported and battle-tested.
                        </p>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-green-400">
                                <CheckCircle2 size={14} />
                                Universal wallet support
                            </div>
                            <div className="flex items-center gap-2 text-green-400">
                                <CheckCircle2 size={14} />
                                Simple and reliable
                            </div>
                            <div className="flex items-center gap-2 text-yellow-400">
                                <RefreshCw size={14} />
                                Fixed transaction structure
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-primary/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded bg-primary/20 text-primary text-sm">v2</span>
                            BIP-370: PSBTv2
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-sm text-text-secondary">
                            Enhanced version allowing dynamic construction of transactions.
                        </p>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-green-400">
                                <CheckCircle2 size={14} />
                                Add inputs/outputs after creation
                            </div>
                            <div className="flex items-center gap-2 text-green-400">
                                <CheckCircle2 size={14} />
                                Better locktime support
                            </div>
                            <div className="flex items-center gap-2 text-green-400">
                                <CheckCircle2 size={14} />
                                Modifiable flags for flexibility
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Callout type="tip" title="Caravan's Approach">
                <p>
                    Caravan uses <strong>PSBTv2 internally</strong> for its flexibility, but can
                    convert to PSBTv0 for compatibility with hardware wallets that don't yet
                    support v2. When you paste a PSBTv0, Caravan automatically converts it to v2.
                </p>
            </Callout>

            <h2>Continue Your Journey</h2>

            <div className="not-prose my-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Link href="/learn/psbt/bip174" className="group">
                    <Card className="h-full hover:border-pkg-psbt/50 transition-colors">
                        <CardContent className="pt-6">
                            <div className="text-4xl mb-3">📋</div>
                            <h3 className="font-bold mb-2 group-hover:text-pkg-psbt transition-colors">
                                BIP-174 Deep Dive
                            </h3>
                            <p className="text-sm text-text-muted">
                                Master the original PSBT specification with detailed examples
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/learn/psbt/bip370" className="group">
                    <Card className="h-full hover:border-primary/50 transition-colors">
                        <CardContent className="pt-6">
                            <div className="text-4xl mb-3">🚀</div>
                            <h3 className="font-bold mb-2 group-hover:text-primary transition-colors">
                                BIP-370 Deep Dive
                            </h3>
                            <p className="text-sm text-text-muted">
                                Explore PSBTv2's enhanced capabilities and new fields
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/learn/psbt/explorer" className="group">
                    <Card className="h-full hover:border-green-500/50 transition-colors">
                        <CardContent className="pt-6">
                            <div className="text-4xl mb-3">🔍</div>
                            <h3 className="font-bold mb-2 group-hover:text-green-400 transition-colors">
                                PSBT Explorer
                            </h3>
                            <p className="text-sm text-text-muted">
                                Decode and analyze any PSBT with detailed field explanations
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            </div>

            <PageNavigation
                prev={{ href: '/learn/foundations/multisig', label: 'Multisig Foundations' }}
                next={{ href: '/learn/psbt/bip174', label: 'BIP-174 Deep Dive' }}
            />
        </div>
    );
}