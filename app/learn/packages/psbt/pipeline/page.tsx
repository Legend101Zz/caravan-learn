/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Callout } from '@/components/content/callout';
import { PageNavigation } from '@/components/layout/page-navigation';
import {
    Play,
    Pause,
    RotateCcw,
    FileText,
    RefreshCw,
    PenTool,
    Merge,
    Package,
    Send,
    ChevronRight,
    Zap,
    CheckCircle2,
    Circle
} from 'lucide-react';

// Node component for the pipeline
const PipelineNode = ({
    id,
    icon: Icon,
    label,
    description,
    isActive,
    isComplete,
    color,
    onClick,
    position
}: {
    id: string;
    icon: any;
    label: string;
    description: string;
    isActive: boolean;
    isComplete: boolean;
    color: string;
    onClick: () => void;
    position: { x: number; y: number };
}) => (
    <motion.g
        style={{ cursor: 'pointer' }}
        onClick={onClick}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: position.x / 500 }}
    >
        {/* Outer ring for active state */}
        {isActive && (
            <motion.circle
                cx={position.x}
                cy={position.y}
                r={45}
                fill="none"
                stroke={color}
                strokeWidth={2}
                strokeDasharray="4 4"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: `${position.x}px ${position.y}px` }}
            />
        )}

        {/* Main circle */}
        <motion.circle
            cx={position.x}
            cy={position.y}
            r={35}
            fill={isComplete ? color : isActive ? `${color}40` : '#1a1a2e'}
            stroke={isComplete || isActive ? color : '#374151'}
            strokeWidth={3}
            whileHover={{ scale: 1.1 }}
            animate={isActive ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
        />

        {/* Checkmark for complete */}
        {isComplete && (
            <motion.path
                d={`M ${position.x - 10} ${position.y} L ${position.x - 3} ${position.y + 8} L ${position.x + 12} ${position.y - 8}`}
                stroke="white"
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
            />
        )}

        {/* Label */}
        <text
            x={position.x}
            y={position.y + 60}
            textAnchor="middle"
            fill={isActive || isComplete ? color : '#9ca3af'}
            fontSize="14"
            fontWeight="bold"
        >
            {label}
        </text>
    </motion.g>
);

// Connection line component
const ConnectionLine = ({
    from,
    to,
    isActive,
    isComplete,
    color
}: {
    from: { x: number; y: number };
    to: { x: number; y: number };
    isActive: boolean;
    isComplete: boolean;
    color: string;
}) => {
    const pathRef = useRef<SVGPathElement>(null);

    // Calculate control point for curved line
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const dx = to.x - from.x;
    const dy = to.y - from.y;

    // Create a slight curve
    const curvePath = `M ${from.x + 35} ${from.y} 
                       Q ${midX} ${from.y - 20} 
                       ${to.x - 35} ${to.y}`;

    return (
        <g>
            {/* Background line */}
            <path
                d={curvePath}
                fill="none"
                stroke="#374151"
                strokeWidth={3}
                strokeLinecap="round"
            />

            {/* Animated line */}
            {(isActive || isComplete) && (
                <motion.path
                    ref={pathRef}
                    d={curvePath}
                    fill="none"
                    stroke={color}
                    strokeWidth={3}
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: isComplete ? 1 : 0.5 }}
                    transition={{ duration: 0.5 }}
                />
            )}

            {/* Moving dot */}
            {isActive && (
                <motion.circle
                    r={5}
                    fill={color}
                    initial={{ offsetDistance: '0%' }}
                    animate={{ offsetDistance: '100%' }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{ offsetPath: `path('${curvePath}')` }}
                />
            )}
        </g>
    );
};

// PSBT Data packet visualization
const PSBTPacket = ({
    currentStep,
    steps
}: {
    currentStep: number;
    steps: Array<{ label: string; color: string }>;
}) => {
    const step = steps[currentStep];

    return (
        <motion.div
            className="absolute left-1/2 -translate-x-1/2 bottom-8 flex items-center gap-2"
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <div
                className="px-4 py-2 rounded-lg border-2 font-bold text-sm"
                style={{
                    backgroundColor: `${step.color}20`,
                    borderColor: step.color,
                    color: step.color
                }}
            >
                📜 PSBT
            </div>
            <ChevronRight style={{ color: step.color }} />
            <div className="text-sm text-text-secondary">
                {step.label}
            </div>
        </motion.div>
    );
};

// Step detail panel
const StepDetailPanel = ({
    step
}: {
    step: {
        id: string;
        label: string;
        description: string;
        color: string;
        actions: string[];
        code: string;
    };
}) => (
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="p-4 rounded-xl border-2"
        style={{ borderColor: `${step.color}50`, backgroundColor: `${step.color}10` }}
    >
        <h3 className="font-bold text-lg mb-2" style={{ color: step.color }}>
            {step.label}
        </h3>
        <p className="text-sm text-text-secondary mb-4">{step.description}</p>

        <div className="space-y-2 mb-4">
            <div className="text-xs text-text-muted uppercase tracking-wider">Actions:</div>
            {step.actions.map((action, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 size={14} style={{ color: step.color }} />
                    <span>{action}</span>
                </div>
            ))}
        </div>

        <div className="p-3 bg-bg-secondary rounded-lg">
            <div className="text-xs text-text-muted mb-2">Example:</div>
            <pre className="text-xs font-mono text-text-secondary overflow-x-auto">
                {step.code}
            </pre>
        </div>
    </motion.div>
);

export default function PSBTPipelinePage() {
    const [currentStep, setCurrentStep] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedStep, setSelectedStep] = useState<number | null>(null);

    const steps = [
        {
            id: 'creator',
            icon: FileText,
            label: 'Creator',
            description: 'Initializes the PSBT with unsigned transaction',
            color: '#22c55e',
            position: { x: 100, y: 120 },
            actions: [
                'Create empty PSBT structure',
                'Set transaction version',
                'Define inputs and outputs',
                'Set locktime (if needed)'
            ],
            code: `const psbt = new PsbtV2();
psbt.PSBT_GLOBAL_TX_VERSION = 2;
psbt.addInput({ txid, vout });
psbt.addOutput({ address, amount });`
        },
        {
            id: 'updater',
            icon: RefreshCw,
            label: 'Updater',
            description: 'Adds necessary signing information',
            color: '#3b82f6',
            position: { x: 250, y: 120 },
            actions: [
                'Add UTXO information',
                'Add redeem/witness scripts',
                'Add BIP32 derivation paths',
                'Prepare for signers'
            ],
            code: `psbt.addWitnessUtxo(0, utxoData);
psbt.addWitnessScript(0, witnessScript);
psbt.addBIP32Derivation(0, {
  fingerprint, path, pubkey
});`
        },
        {
            id: 'signer1',
            icon: PenTool,
            label: 'Signer 1',
            description: 'First signer adds their signature',
            color: '#E8813B',
            position: { x: 400, y: 80 },
            actions: [
                'Verify transaction details',
                'Check derivation paths',
                'Sign with private key',
                'Add partial signature'
            ],
            code: `// On hardware wallet or signing device
const sig = signWithKey(privateKey, sighash);
psbt.addPartialSig(0, pubkey, sig);`
        },
        {
            id: 'signer2',
            icon: PenTool,
            label: 'Signer 2',
            description: 'Second signer adds their signature',
            color: '#E8813B',
            position: { x: 400, y: 160 },
            actions: [
                'Receive PSBT from first signer',
                'Verify transaction unchanged',
                'Sign with their key',
                'Add partial signature'
            ],
            code: `// Second signer (can happen in parallel)
const sig2 = signWithKey(privateKey2, sighash);
psbt.addPartialSig(0, pubkey2, sig2);`
        },
        {
            id: 'combiner',
            icon: Merge,
            label: 'Combiner',
            description: 'Merges partial signatures from all signers',
            color: '#a855f7',
            position: { x: 550, y: 120 },
            actions: [
                'Collect all signed PSBTs',
                'Merge partial signatures',
                'Verify no conflicts',
                'Check signature count'
            ],
            code: `const combined = PsbtV2.combine([
  psbtWithSig1,
  psbtWithSig2
]);
// Now has both signatures!`
        },
        {
            id: 'finalizer',
            icon: Package,
            label: 'Finalizer',
            description: 'Completes the transaction inputs',
            color: '#06b6d4',
            position: { x: 700, y: 120 },
            actions: [
                'Construct final scriptSig/witness',
                'Remove signing metadata',
                'Verify all signatures present',
                'Mark inputs as finalized'
            ],
            code: `psbt.finalizeInput(0);
// Creates final witness:
// OP_0 <sig1> <sig2> <witnessScript>`
        },
        {
            id: 'extractor',
            icon: Send,
            label: 'Extractor',
            description: 'Produces the final broadcastable transaction',
            color: '#f43f5e',
            position: { x: 850, y: 120 },
            actions: [
                'Extract complete transaction',
                'Serialize to hex format',
                'Ready for broadcast!',
                'Transaction complete'
            ],
            code: `const tx = psbt.extractTransaction();
const txHex = tx.toHex();
// Broadcast to network!
await broadcast(txHex);`
        }
    ];

    // Auto-play logic
    useEffect(() => {
        if (isPlaying) {
            const timer = setTimeout(() => {
                if (currentStep < steps.length - 1) {
                    setCurrentStep(prev => prev + 1);
                } else {
                    setIsPlaying(false);
                }
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isPlaying, currentStep, steps.length]);

    const handlePlay = () => {
        if (currentStep >= steps.length - 1) {
            setCurrentStep(-1);
        }
        setIsPlaying(true);
    };

    const handleReset = () => {
        setIsPlaying(false);
        setCurrentStep(-1);
        setSelectedStep(null);
    };

    const handleNodeClick = (index: number) => {
        setSelectedStep(selectedStep === index ? null : index);
    };

    return (
        <div className="prose prose-invert max-w-none">
            <div className="not-prose mb-8">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
                    🔄 Interactive Pipeline
                </div>
                <h1 className="text-5xl font-bold mb-4">PSBT Pipeline Flow</h1>
                <p className="text-xl text-text-secondary">
                    Watch how a PSBT flows through each role, from creation to broadcast.
                    Click any node to learn more about that stage.
                </p>
            </div>

            {/* Pipeline Visualization */}
            <div className="not-prose mb-8">
                <Card className="bg-bg-secondary overflow-hidden">
                    <CardHeader className="border-b border-border">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Zap size={20} className="text-primary" />
                                PSBT Lifecycle Pipeline
                            </CardTitle>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleReset}
                                >
                                    <RotateCcw size={16} className="mr-2" />
                                    Reset
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={isPlaying ? () => setIsPlaying(false) : handlePlay}
                                >
                                    {isPlaying ? (
                                        <>
                                            <Pause size={16} className="mr-2" />
                                            Pause
                                        </>
                                    ) : (
                                        <>
                                            <Play size={16} className="mr-2" />
                                            Play
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="relative h-[300px] bg-gradient-to-b from-bg-secondary to-bg-tertiary">
                            <svg viewBox="0 0 950 240" className="w-full h-full">
                                {/* Connection lines */}
                                {/* Creator → Updater */}
                                <ConnectionLine
                                    from={steps[0].position}
                                    to={steps[1].position}
                                    isActive={currentStep === 0}
                                    isComplete={currentStep > 0}
                                    color={steps[0].color}
                                />

                                {/* Updater → Signer 1 */}
                                <ConnectionLine
                                    from={steps[1].position}
                                    to={steps[2].position}
                                    isActive={currentStep === 1}
                                    isComplete={currentStep > 1}
                                    color={steps[1].color}
                                />

                                {/* Updater → Signer 2 */}
                                <ConnectionLine
                                    from={steps[1].position}
                                    to={steps[3].position}
                                    isActive={currentStep === 1}
                                    isComplete={currentStep > 1}
                                    color={steps[1].color}
                                />

                                {/* Signer 1 → Combiner */}
                                <ConnectionLine
                                    from={steps[2].position}
                                    to={steps[4].position}
                                    isActive={currentStep === 2 || currentStep === 3}
                                    isComplete={currentStep > 3}
                                    color={steps[2].color}
                                />

                                {/* Signer 2 → Combiner */}
                                <ConnectionLine
                                    from={steps[3].position}
                                    to={steps[4].position}
                                    isActive={currentStep === 2 || currentStep === 3}
                                    isComplete={currentStep > 3}
                                    color={steps[3].color}
                                />

                                {/* Combiner → Finalizer */}
                                <ConnectionLine
                                    from={steps[4].position}
                                    to={steps[5].position}
                                    isActive={currentStep === 4}
                                    isComplete={currentStep > 4}
                                    color={steps[4].color}
                                />

                                {/* Finalizer → Extractor */}
                                <ConnectionLine
                                    from={steps[5].position}
                                    to={steps[6].position}
                                    isActive={currentStep === 5}
                                    isComplete={currentStep > 5}
                                    color={steps[5].color}
                                />

                                {/* Nodes */}
                                {steps.map((step, index) => (
                                    <PipelineNode
                                        key={step.id}
                                        {...step}
                                        isActive={currentStep === index}
                                        isComplete={currentStep > index}
                                        onClick={() => handleNodeClick(index)}
                                    />
                                ))}
                            </svg>

                            {/* PSBT Packet indicator */}
                            <AnimatePresence>
                                {currentStep >= 0 && currentStep < steps.length && (
                                    <PSBTPacket currentStep={currentStep} steps={steps} />
                                )}
                            </AnimatePresence>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Step Detail Panel */}
            <div className="not-prose mb-8">
                <AnimatePresence mode="wait">
                    {selectedStep !== null && (
                        <StepDetailPanel step={steps[selectedStep]} />
                    )}
                </AnimatePresence>

                {selectedStep === null && (
                    <div className="text-center text-text-muted py-8">
                        Click on any node above to see details about that stage
                    </div>
                )}
            </div>

            {/* Step-by-step breakdown */}
            <h2>Pipeline Stages Explained</h2>

            <div className="not-prose my-8 space-y-4">
                {steps.map((step, i) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-4 p-4 rounded-xl border border-border hover:border-primary/30 transition-colors cursor-pointer"
                        onClick={() => setSelectedStep(i)}
                    >
                        <div
                            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${step.color}20` }}
                        >
                            <step.icon size={24} style={{ color: step.color }} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold" style={{ color: step.color }}>
                                    {i + 1}. {step.label}
                                </span>
                                <ChevronRight size={16} className="text-text-muted" />
                            </div>
                            <p className="text-sm text-text-secondary">{step.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <Callout type="info" title="Parallel Signing">
                <p>
                    Notice how Signer 1 and Signer 2 are positioned in parallel? In PSBTs,
                    multiple signers can sign independently and simultaneously. The Combiner
                    then merges all the signatures together. This is one of the key advantages
                    of the PSBT format!
                </p>
            </Callout>

            <PageNavigation
                prev={{ href: '/learn/psbt/explorer', label: 'PSBT Explorer' }}
                next={{ href: '/learn/psbt/builder', label: 'PSBT Builder Tool' }}
            />
        </div>
    );
}