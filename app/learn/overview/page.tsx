import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, BookOpen, Code2, Rocket } from 'lucide-react';
import { PageNavigation } from '@/components/layout/page-navigation';

export default function OverviewPage() {
    return (
        <div className="prose prose-invert max-w-none">
            <h1>Course Overview</h1>

            <p className="lead text-xl text-text-secondary">
                Welcome to Caravan Interactive! This comprehensive guide will take you from Bitcoin
                basics to building production-ready multisig wallets.
            </p>

            <h2>What You'll Build</h2>

            <Card className="not-prose my-8 border-primary/30">
                <CardContent className="pt-6">
                    <div className="text-center">
                        <div className="text-4xl mb-4">🏗️</div>
                        <h3 className="text-2xl font-bold mb-2">A Complete Multisig Wallet</h3>
                        <p className="text-text-secondary">
                            By the end of this course, you'll build a fully functional 2-of-3 multisig wallet
                            that can receive and spend Bitcoin on testnet.
                        </p>
                    </div>
                </CardContent>
            </Card>

            <h2>Learning Path</h2>

            <div className="not-prose grid gap-6 my-8">
                <Card className="border-l-4 border-l-primary">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <BookOpen className="text-primary" size={24} />
                            </div>
                            <div>
                                <CardTitle>Part 1: Bitcoin Foundations</CardTitle>
                                <p className="text-sm text-text-secondary mt-1">4 chapters • ~2 hours</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-text-secondary">
                            <li>• Understanding Bitcoin transactions and the UTXO model</li>
                            <li>• Keys, addresses, and different address types</li>
                            <li>• HD wallets and derivation paths (BIP32/39/44)</li>
                            <li>• Introduction to multisignature security</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-pkg-psbt">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-pkg-psbt/10 flex items-center justify-center">
                                <Code2 className="text-pkg-psbt" size={24} />
                            </div>
                            <div>
                                <CardTitle>Part 2: Caravan Packages</CardTitle>
                                <p className="text-sm text-text-secondary mt-1">6 chapters • ~3 hours</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-text-secondary">
                            <li>• @caravan/bitcoin - Core Bitcoin utilities</li>
                            <li>• @caravan/psbt - Working with PSBTs</li>
                            <li>• @caravan/multisig - Multisig coordination</li>
                            <li>• The Braid concept ⭐ (Caravan's unique approach)</li>
                            <li>• Hardware wallet integration</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-pkg-wallets">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-pkg-wallets/10 flex items-center justify-center">
                                <Rocket className="text-pkg-wallets" size={24} />
                            </div>
                            <div>
                                <CardTitle>Part 3: Build Your Wallet</CardTitle>
                                <p className="text-sm text-text-secondary mt-1">5 chapters • ~2 hours</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-text-secondary">
                            <li>• Planning your multisig configuration</li>
                            <li>• Collecting extended public keys (xpubs)</li>
                            <li>• Creating the wallet with Braid</li>
                            <li>• Generating receive addresses</li>
                            <li>• Building, signing, and broadcasting transactions</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <h2>Prerequisites</h2>

            <p>This course assumes you have:</p>

            <ul>
                <li>Basic programming knowledge (JavaScript/TypeScript)</li>
                <li>Familiarity with npm and Node.js</li>
                <li>General understanding of Bitcoin (what it is, how transactions work at a high level)</li>
            </ul>

            <p>
                Don't worry if you're not an expert! We'll explain everything you need to know as we go.
            </p>

            <h2>How to Use This Guide</h2>

            <div className="not-prose my-6 p-6 rounded-lg bg-bg-secondary border border-border">
                <h3 className="text-lg font-semibold mb-4">Interactive Learning</h3>
                <p className="text-text-secondary mb-4">
                    Every code example in this guide is executable. You can:
                </p>
                <ul className="space-y-2 text-text-secondary">
                    <li>✅ Click "Run" to execute any code snippet</li>
                    <li>✅ Modify the code and experiment</li>
                    <li>✅ See real-time output in the console</li>
                    <li>✅ Learn by breaking things and fixing them</li>
                </ul>
            </div>

            <h2>Ready to Start?</h2>

            <p>
                Let's begin with the fundamentals of Bitcoin and build up to creating your own multisig wallet!
            </p>

            <div className="not-prose my-8">
                <Button size="lg" asChild>
                    <Link href="/learn/foundations/bitcoin-basics">
                        Start Learning
                        <ArrowRight size={20} />
                    </Link>
                </Button>
            </div>

            <PageNavigation />
        </div>
    );
}