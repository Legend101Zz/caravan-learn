'use client';

import { CodePlayground } from '@/components/interactive/code-playground';
import { Callout } from '@/components/content/callout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageNavigation } from '@/components/layout/page-navigation';
import Link from 'next/link';
import { ArrowRight, Package, Zap, Shield, Code2 } from 'lucide-react';
import * as CaravanBitcoin from '@caravan/bitcoin';

export default function CaravanBitcoinPage() {
    return (
        <div className="prose prose-invert max-w-none">
            <div className="not-prose mb-8">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                    @caravan/bitcoin
                </div>
                <h1 className="text-5xl font-bold mb-4">Caravan Bitcoin Package</h1>
                <p className="text-xl text-text-secondary">
                    The core package for Bitcoin operations: addresses, keys, multisig, and more
                </p>
            </div>

            <h2>What is @caravan/bitcoin?</h2>

            <p>
                <code>@caravan/bitcoin</code> is Caravan's foundational package that provides
                essential Bitcoin utilities. It handles everything from address validation to
                multisig coordination, all with a clean, TypeScript-friendly API.
            </p>

            <div className="not-prose my-8 grid md:grid-cols-2 gap-6">
                <Card className="border-primary/30">
                    <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                            <Package className="text-primary" size={24} />
                        </div>
                        <CardTitle className="text-lg">Core Features</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-text-secondary space-y-2">
                        <ul className="space-y-2">
                            <li>• Address validation & generation</li>
                            <li>• Public key operations</li>
                            <li>• Extended key (xpub/xprv) support</li>
                            <li>• Network configuration (mainnet/testnet/regtest)</li>
                            <li>• Multisig address creation</li>
                            <li>• Fee estimation utilities</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-pkg-psbt/30">
                    <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-pkg-psbt/10 flex items-center justify-center mb-3">
                            <Zap className="text-pkg-psbt" size={24} />
                        </div>
                        <CardTitle className="text-lg">Why Use It?</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-text-secondary space-y-2">
                        <ul className="space-y-2">
                            <li>• Battle-tested in production</li>
                            <li>• Full TypeScript support</li>
                            <li>• Browser & Node.js compatible</li>
                            <li>• Comprehensive test coverage</li>
                            <li>• Active development</li>
                            <li>• Open source (MIT license)</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <h2>Installation</h2>

            <div className="not-prose my-6">
                <Card className="bg-bg-secondary">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-semibold text-text-secondary">npm</span>
                        </div>
                        <pre className="bg-bg-tertiary p-4 rounded-lg overflow-x-auto">
                            <code className="text-sm text-primary">npm install @caravan/bitcoin</code>
                        </pre>
                    </CardContent>
                </Card>
            </div>

            <h2>Quick Start</h2>

            <CodePlayground
                title="Your First @caravan/bitcoin Code"
                initialCode={`// Import what you need
const { 
  Network, 
  validateAddress,
  networkData 
} = CaravanBitcoin;

// Check what network you're on
const mainnet = networkData(Network.MAINNET);
console.log("Network:", mainnet.label);
console.log("BIP32 Public:", mainnet.bip32.public);

// Validate a Bitcoin address
const address = "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq";
const error = validateAddress(address, Network.MAINNET);

if (error) {
  console.log("❌ Invalid:", error);
} else {
  console.log("✅ Valid Bitcoin address!");
}

// That's it! Simple and clean.
console.log("\\n🚀 You're ready to build with Caravan!");`}
                imports={{ CaravanBitcoin }}
                height="380px"
            />

            <h2>Package Modules</h2>

            <p>
                The package is organized into focused modules. Let's explore each one:
            </p>

            <div className="not-prose my-8 space-y-4">
                <Card className="group hover:border-primary/50 transition-all cursor-pointer">
                    <Link href="/learn/packages/bitcoin/networks">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <Shield className="text-primary" size={20} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Networks</CardTitle>
                                        <CardDescription>Mainnet, Testnet, and Regtest configuration</CardDescription>
                                    </div>
                                </div>
                                <ArrowRight className="text-text-muted group-hover:text-primary transition-colors" size={20} />
                            </div>
                        </CardHeader>
                    </Link>
                </Card>

                <Card className="group hover:border-primary/50 transition-all cursor-pointer">
                    <Link href="/learn/packages/bitcoin/addresses">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-pkg-psbt/10 flex items-center justify-center group-hover:bg-pkg-psbt/20 transition-colors">
                                        <Code2 className="text-pkg-psbt" size={20} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Addresses</CardTitle>
                                        <CardDescription>Validate, generate, and work with Bitcoin addresses</CardDescription>
                                    </div>
                                </div>
                                <ArrowRight className="text-text-muted group-hover:text-primary transition-colors" size={20} />
                            </div>
                        </CardHeader>
                    </Link>
                </Card>

                <Card className="group hover:border-primary/50 transition-all cursor-pointer">
                    <Link href="/learn/packages/bitcoin/keys">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-pkg-wallets/10 flex items-center justify-center group-hover:bg-pkg-wallets/20 transition-colors">
                                        <Package className="text-pkg-wallets" size={20} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Keys</CardTitle>
                                        <CardDescription>Public keys, extended keys, and key management</CardDescription>
                                    </div>
                                </div>
                                <ArrowRight className="text-text-muted group-hover:text-primary transition-colors" size={20} />
                            </div>
                        </CardHeader>
                    </Link>
                </Card>

                <Card className="group hover:border-primary/50 transition-all cursor-pointer">
                    <Link href="/learn/packages/bitcoin/multisig">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-pkg-multisig/10 flex items-center justify-center group-hover:bg-pkg-multisig/20 transition-colors">
                                        <Shield className="text-pkg-multisig" size={20} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Multisig</CardTitle>
                                        <CardDescription>Create and manage multisignature addresses</CardDescription>
                                    </div>
                                </div>
                                <ArrowRight className="text-text-muted group-hover:text-primary transition-colors" size={20} />
                            </div>
                        </CardHeader>
                    </Link>
                </Card>

                <Card className="group hover:border-primary/50 transition-all cursor-pointer border-primary/30">
                    <Link href="/learn/packages/bitcoin/braid">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                                        <Zap className="text-primary" size={20} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">The Braid ⭐</CardTitle>
                                        <CardDescription>Caravan's powerful wallet abstraction</CardDescription>
                                    </div>
                                </div>
                                <ArrowRight className="text-text-muted group-hover:text-primary transition-colors" size={20} />
                            </div>
                        </CardHeader>
                    </Link>
                </Card>
            </div>

            <Callout type="tip" title="Interactive Learning">
                <p>
                    Each section includes interactive examples and tools. You can run code, experiment
                    with parameters, and see real-time results. Learning by doing is the best way!
                </p>
            </Callout>

            <h2>Common Patterns</h2>

            <p>
                Here are some common patterns you'll use throughout your Bitcoin development:
            </p>

            <CodePlayground
                title="Common @caravan/bitcoin Patterns"
                initialCode={`const { 
  Network,
  validateAddress,
  validateExtendedPublicKey,
  networkData
} = CaravanBitcoin;

// Pattern 1: Always specify the network
const network = Network.TESTNET; // or MAINNET, REGTEST

// Pattern 2: Validate before using
function safeValidateAddress(address) {
  const error = validateAddress(address, network);
  if (error) {
    throw new Error(\`Invalid address: \${error}\`);
  }
  return address;
}

// Pattern 3: Get network-specific data
const netData = networkData(network);
console.log("Network prefix:", netData.bip32.public);

// Pattern 4: Handle both mainnet and testnet
const addresses = {
  mainnet: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
  testnet: "tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx"
};

for (const [net, addr] of Object.entries(addresses)) {
  const netEnum = net === 'mainnet' ? Network.MAINNET : Network.TESTNET;
  const error = validateAddress(addr, netEnum);
  console.log(\`\${net}: \${error ? '❌' : '✅'}\`);
}

console.log("\\n✓ These patterns will serve you well!");`}
                imports={{ CaravanBitcoin }}
                height="450px"
            />

            <h2>TypeScript Support</h2>

            <p>
                <code>@caravan/bitcoin</code> is written in TypeScript and provides excellent type safety:
            </p>

            <div className="not-prose my-6">
                <Card className="bg-bg-secondary">
                    <CardContent className="pt-6">
                        <pre className="bg-bg-tertiary p-4 rounded-lg overflow-x-auto text-sm">
                            <code className="text-text-secondary">{`import { 
  Network,           // Enum for network types
  validateAddress,   // (address: string, network: Network) => string
  MultisigAddressType, // P2SH | P2SH-P2WSH | P2WSH
  ExtendedPublicKey  // Interface for xpub structure
} from '@caravan/bitcoin';

// Types guide you to correct usage
const network: Network = Network.MAINNET;
const address: string = "bc1q...";
const error: string = validateAddress(address, network);

// Autocompletion works everywhere!
const addressType: MultisigAddressType = "P2WSH";`}</code>
                        </pre>
                    </CardContent>
                </Card>
            </div>

            <h2>Next Steps</h2>

            <p>
                Ready to dive deeper? Start with any of these modules:
            </p>

            <div className="not-prose my-8 grid md:grid-cols-2 gap-4">
                <Button asChild size="lg" variant="outline">
                    <Link href="/learn/packages/bitcoin/networks">
                        Explore Networks
                        <ArrowRight size={20} />
                    </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                    <Link href="/learn/packages/bitcoin/addresses">
                        Work with Addresses
                        <ArrowRight size={20} />
                    </Link>
                </Button>
            </div>

            <PageNavigation />
        </div>
    );
}