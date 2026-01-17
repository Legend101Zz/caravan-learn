/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
/* eslint-disable react/no-unescaped-entities */
'use client';

import { CodePlayground } from '@/components/interactive/code-playground';
import { Callout } from '@/components/content/callout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageNavigation } from '@/components/layout/page-navigation';
import { BraidBuilderTool } from '@/components/interactive/braid-builder-tool';
import * as CaravanBitcoin from '@caravan/bitcoin';

export default function BraidPage() {
    return (
        <div className="prose prose-invert max-w-none">
            <div className="not-prose mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
                    <span className="text-xl">⭐</span>
                    @caravan/bitcoin
                </div>
                <h1 className="text-5xl font-bold mb-4">The Braid</h1>
                <p className="text-xl text-text-secondary">
                    Caravan's powerful abstraction for deterministic multisig wallet management
                </p>
            </div>

            <h2>What is a Braid?</h2>

            <p>
                The <strong>Braid</strong> is Caravan's unique concept that elegantly solves a fundamental
                challenge in multisig wallets: how do multiple participants independently generate the same
                addresses in the same order?
            </p>

            <div className="not-prose my-8">
                <Card className="bg-gradient-to-br from-primary/10 to-pkg-psbt/10 border-primary/30">
                    <CardContent className="pt-6">
                        <div className="text-center mb-6">
                            <div className="text-6xl mb-4">🧬</div>
                            <h3 className="text-2xl font-bold text-primary mb-2">Think of it like DNA</h3>
                            <p className="text-text-secondary max-w-2xl mx-auto">
                                Just like DNA contains the instructions to build an organism, a Braid contains
                                all the information needed to deterministically derive your entire multisig wallet.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div className="p-4 bg-bg-tertiary rounded-lg">
                                <div className="font-semibold text-primary mb-2">Single Source of Truth</div>
                                <div className="text-text-secondary text-xs">
                                    All wallet configuration in one place - network, address type, quorum, and xpubs
                                </div>
                            </div>
                            <div className="p-4 bg-bg-tertiary rounded-lg">
                                <div className="font-semibold text-pkg-psbt mb-2">Deterministic</div>
                                <div className="text-text-secondary text-xs">
                                    Same Braid = same addresses, every time, for everyone
                                </div>
                            </div>
                            <div className="p-4 bg-bg-tertiary rounded-lg">
                                <div className="font-semibold text-pkg-wallets mb-2">Portable</div>
                                <div className="text-text-secondary text-xs">
                                    Export, share, and restore your entire wallet configuration
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <h2>Interactive Braid Builder</h2>

            <p>
                Experience the power of the Braid! Add your xpubs, configure your multisig settings,
                and watch as Caravan generates deterministic addresses:
            </p>

            {/* Interactive Tool */}
            <div className="not-prose">
                <BraidBuilderTool />
            </div>

            <h2>The Problem: Address Coordination</h2>

            <p>
                Without the Braid concept, multisig wallet management is painful:
            </p>

            <div className="not-prose my-8">
                <Card className="bg-bg-secondary">
                    <CardContent className="pt-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-4 bg-red-950/20 border border-red-500/30 rounded">
                                <h3 className="font-semibold text-red-400 mb-3">❌ Without Braid</h3>
                                <div className="text-sm text-text-secondary space-y-2">
                                    <p className="font-semibold text-red-300 mb-2">The Nightmare:</p>
                                    <ul className="space-y-1 text-xs">
                                        <li>• Each address needs manual coordination</li>
                                        <li>• "What index are we on now?"</li>
                                        <li>• Different participants might derive different addresses</li>
                                        <li>• Address reuse if not careful</li>
                                        <li>• Complex state management</li>
                                        <li>• Error-prone process</li>
                                        <li>• Difficult to restore wallet</li>
                                    </ul>
                                    <div className="mt-4 p-3 bg-bg-tertiary rounded text-xs">
                                        <div className="font-mono text-red-400">
                                            Alice: "I generated address at index 5"<br />
                                            Bob: "Wait, I thought we were at index 3?"<br />
                                            Carol: "I have a different address entirely!"
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-green-950/20 border border-green-500/30 rounded">
                                <h3 className="font-semibold text-green-400 mb-3">✅ With Braid</h3>
                                <div className="text-sm text-text-secondary space-y-2">
                                    <p className="font-semibold text-green-300 mb-2">The Solution:</p>
                                    <ul className="space-y-1 text-xs">
                                        <li>• Share Braid config once</li>
                                        <li>• Everyone derives same addresses</li>
                                        <li>• Automatic index management</li>
                                        <li>• No coordination needed</li>
                                        <li>• Deterministic and verifiable</li>
                                        <li>• Easy wallet restoration</li>
                                        <li>• One config file to backup</li>
                                    </ul>
                                    <div className="mt-4 p-3 bg-bg-tertiary rounded text-xs">
                                        <div className="font-mono text-green-400">
                                            Alice: deriveByIndex(braid, 5) → bc1q...<br />
                                            Bob: deriveByIndex(braid, 5) → bc1q...<br />
                                            Carol: deriveByIndex(braid, 5) → bc1q...
                                        </div>
                                        <div className="text-green-300 mt-2">All the same! ✓</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <h2>Braid Structure</h2>

            <p>
                A Braid contains all the information needed to derive your multisig wallet:
            </p>

            <CodePlayground
                title="Understanding Braid Structure"
                initialCode={`const { 
  Network,
  generateBraid,
  braidConfig
} = CaravanBitcoin;

// Extended public keys from each participant
const extendedPublicKeys = [
  {
    base58String: "tpubDFH9dgzveyD8zTbPUFuLrGmCydNvxehyNdUXKJAQN62j3S3L3zHNhYLm8vGZb9SSBG3pXnXdDVaK7i1cqwqVgqVvPVXdoFKqGLPqvBPqUUa",
    path: "m/48'/1'/0'/2'",  // Standard BIP48 path
    rootFingerprint: "a1b2c3d4"
  },
  {
    base58String: "tpubDFH9dgzveyD8zTbPUFuLrGmCydNvxehyNdUXKJAQN62j3S3L3zHNhYLm8vGZb9SSBG3pXnXdDVaK7i1cqwqVgqVvPVXdoFKqGLPqvBPqUUa",
    path: "m/48'/1'/0'/2'",
    rootFingerprint: "e5f6g7h8"
  }
];

// Generate the Braid
const braid = generateBraid(
  Network.TESTNET,      // Network
  "P2WSH",              // Address type
  extendedPublicKeys,   // The xpubs
  2,                    // Required signers (M)
  "0"                   // Index: 0 = receive, 1 = change
);

console.log("Braid Configuration:\\n");
console.log(JSON.stringify(braidConfig(braid), null, 2));

console.log("\\nThis Braid encodes:");
console.log("• Network: Testnet");
console.log("• Type: P2WSH (Native SegWit)");
console.log("• Quorum: 2-of-2");
console.log("• Chain: 0 (Receive addresses)");`}
                imports={{ CaravanBitcoin }}
                height="520px"
            />

            <Callout type="info" title="Braid Components">
                <p>Every Braid contains:</p>
                <ul>
                    <li><strong>network:</strong> Mainnet, Testnet, or Regtest</li>
                    <li><strong>addressType:</strong> P2SH, P2SH-P2WSH, or P2WSH</li>
                    <li><strong>extendedPublicKeys:</strong> Array of xpubs with metadata</li>
                    <li><strong>requiredSigners:</strong> The M in M-of-N</li>
                    <li><strong>index:</strong> "0" for receive, "1" for change addresses</li>
                </ul>
            </Callout>

            <h2>Deriving Addresses from a Braid</h2>

            <p>
                Once you have a Braid, deriving addresses is trivial:
            </p>

            <CodePlayground
                title="Address Derivation with Braid"
                initialCode={`const { 
  Network,
  generateBraid,
  deriveMultisigByIndex,
  multisigAddress
} = CaravanBitcoin;

// Setup (in real app, you'd load this from storage)
const extendedPublicKeys = [
  { 
    base58String: "tpubDFH9dgzveyD8zTbPUFuLrGmCydNvxehyNdUXKJAQN62j3S3L3zHNhYLm8vGZb9SSBG3pXnXdDVaK7i1cqwqVgqVvPVXdoFKqGLPqvBPqUUa",
    path: "m/48'/1'/0'/2'"
  },
  { 
    base58String: "tpubDFH9dgzveyD8zTbPUFuLrGmCydNvxehyNdUXKJAQN62j3S3L3zHNhYLm8vGZb9SSBG3pXnXdDVaK7i1cqwqVgqVvPVXdoFKqGLPqvBPqUUa",
    path: "m/48'/1'/0'/2'"
  }
];

const braid = generateBraid(
  Network.TESTNET,
  "P2WSH",
  extendedPublicKeys,
  2,
  "0"
);

console.log("Deriving addresses from Braid:\\n");

// Derive first 5 receive addresses
for (let i = 0; i < 5; i++) {
  const multisig = deriveMultisigByIndex(braid, i);
  const address = multisigAddress(multisig);
  
  console.log(\`Address #\${i}:\`);
  console.log(\`  \${address}\`);
}

console.log("\\n✨ Every participant with this Braid");
console.log("   will derive the exact same addresses!");`}
                imports={{ CaravanBitcoin }}
                height="480px"
            />

            <h2>Receive vs Change Braids</h2>

            <p>
                HD wallets use two chains - one for receiving and one for change. You need separate Braids:
            </p>

            <div className="not-prose my-8">
                <Card className="bg-bg-secondary">
                    <CardContent className="pt-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-4 bg-green-950/20 border border-green-500/30 rounded">
                                <h3 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
                                    <span className="text-2xl">📥</span>
                                    Receive Braid (index: "0")
                                </h3>
                                <div className="text-sm text-text-secondary space-y-2">
                                    <p className="text-xs mb-3">For addresses you share with others:</p>
                                    <div className="space-y-1 text-xs font-mono">
                                        <div className="text-green-400">m/.../0/0 → First receive address</div>
                                        <div className="text-green-400">m/.../0/1 → Second receive address</div>
                                        <div className="text-green-400">m/.../0/2 → Third receive address</div>
                                        <div className="text-text-muted">... unlimited addresses</div>
                                    </div>
                                    <div className="mt-3 p-2 bg-bg-tertiary rounded text-xs">
                                        <strong className="text-green-300">Use for:</strong> Invoices, receiving payments
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-yellow-950/20 border border-yellow-500/30 rounded">
                                <h3 className="font-semibold text-yellow-400 mb-3 flex items-center gap-2">
                                    <span className="text-2xl">💸</span>
                                    Change Braid (index: "1")
                                </h3>
                                <div className="text-sm text-text-secondary space-y-2">
                                    <p className="text-xs mb-3">Internal addresses for change:</p>
                                    <div className="space-y-1 text-xs font-mono">
                                        <div className="text-yellow-400">m/.../1/0 → First change address</div>
                                        <div className="text-yellow-400">m/.../1/1 → Second change address</div>
                                        <div className="text-yellow-400">m/.../1/2 → Third change address</div>
                                        <div className="text-text-muted">... unlimited addresses</div>
                                    </div>
                                    <div className="mt-3 p-2 bg-bg-tertiary rounded text-xs">
                                        <strong className="text-yellow-300">Use for:</strong> Change from your own transactions
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <CodePlayground
                title="Creating Both Braids"
                initialCode={`const { Network, generateBraid } = CaravanBitcoin;

const extendedPublicKeys = [
  { 
    base58String: "tpubDFH9dgzveyD8zTbPUFuLrGmCydNvxehyNdUXKJAQN62j3S3L3zHNhYLm8vGZb9SSBG3pXnXdDVaK7i1cqwqVgqVvPVXdoFKqGLPqvBPqUUa",
    path: "m/48'/1'/0'/2'"
  },
  { 
    base58String: "tpubDFH9dgzveyD8zTbPUFuLrGmCydNvxehyNdUXKJAQN62j3S3L3zHNhYLm8vGZb9SSBG3pXnXdDVaK7i1cqwqVgqVvPVXdoFKqGLPqvBPqUUa",
    path: "m/48'/1'/0'/2'"
  }
];

// Receive addresses
const receiveBraid = generateBraid(
  Network.TESTNET,
  "P2WSH",
  extendedPublicKeys,
  2,
  "0"  // 👈 Receive chain
);

// Change addresses
const changeBraid = generateBraid(
  Network.TESTNET,
  "P2WSH",
  extendedPublicKeys,
  2,
  "1"  // 👈 Change chain
);

console.log("✅ Two Braids created:");
console.log("1. Receive Braid - for sharing with payers");
console.log("2. Change Braid - for internal use");
console.log("");
console.log("Same xpubs, same config, different chains!");
console.log("This maintains privacy while staying organized.");`}
                imports={{ CaravanBitcoin }}
                height="450px"
            />

            <h2>Exporting and Importing Braids</h2>

            <p>
                Braids can be serialized to JSON for storage and sharing:
            </p>

            <CodePlayground
                title="Braid Serialization"
                initialCode={`const { 
  Network,
  generateBraid,
  braidConfig,
  Braid
} = CaravanBitcoin;

const extendedPublicKeys = [
  { 
    base58String: "tpubDFH9dgzveyD8zTbPUFuLrGmCydNvxehyNdUXKJAQN62j3S3L3zHNhYLm8vGZb9SSBG3pXnXdDVaK7i1cqwqVgqVvPVXdoFKqGLPqvBPqUUa",
    path: "m/48'/1'/0'/2'"
  },
  { 
    base58String: "tpubDFH9dgzveyD8zTbPUFuLrGmCydNvxehyNdUXKJAQN62j3S3L3zHNhYLm8vGZb9SSBG3pXnXdDVaK7i1cqwqVgqVvPVXdoFKqGLPqvBPqUUa",
    path: "m/48'/1'/0'/2'"
  }
];

// Create Braid
const braid = generateBraid(
  Network.TESTNET,
  "P2WSH",
  extendedPublicKeys,
  2,
  "0"
);

// Export to JSON
const braidJSON = braidConfig(braid);
console.log("Exported Braid Configuration:\\n");
console.log(braidJSON);

// Import from JSON
const restoredBraid = Braid.fromJSON(braidJSON);
console.log("\\n✅ Braid restored from JSON!");

console.log("\\nUse cases:");
console.log("• Save to file for backup");
console.log("• Share with other participants");
console.log("• Store in wallet database");
console.log("• Version control with git");`}
                imports={{ CaravanBitcoin }}
                height="480px"
            />

            <Callout type="tip" title="Backup Your Braid">
                <p>
                    Your Braid configuration is precious! It contains all the information needed to
                    derive your wallet addresses. Make sure to:
                </p>
                <ul>
                    <li>• Export to JSON and save securely</li>
                    <li>• Back up alongside your seed phrases</li>
                    <li>• Share with all participants</li>
                    <li>• Keep multiple copies in different locations</li>
                    <li>• Test restoration periodically</li>
                </ul>
            </Callout>

            <h2>Why Braid is Powerful</h2>

            <div className="not-prose my-8 space-y-4">
                <Card className="border-primary/30">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <span className="text-2xl">🎯</span>
                            Deterministic
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-text-secondary">
                        <p>
                            Same Braid configuration = same addresses, always. No coordination needed.
                            All participants independently derive identical addresses.
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-pkg-psbt/30">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <span className="text-2xl">📦</span>
                            Portable
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-text-secondary">
                        <p>
                            Export your entire wallet configuration as a single JSON file. Easy to backup,
                            share, and restore. Works across all Caravan implementations.
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-pkg-wallets/30">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <span className="text-2xl">🔒</span>
                            Secure
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-text-secondary">
                        <p>
                            Only contains public information (xpubs). Safe to share with coordinators.
                            Private keys never exposed. Can't be used to spend funds.
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-pkg-multisig/30">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <span className="text-2xl">♾️</span>
                            Unlimited Addresses
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-text-secondary">
                        <p>
                            Generate as many addresses as needed from a single Braid. No need to coordinate
                            for each new address. Perfect for high-volume operations.
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-pkg-clients/30">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <span className="text-2xl">🔄</span>
                            Version Control Friendly
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-text-secondary">
                        <p>
                            JSON format works great with git. Track changes to your wallet configuration.
                            Review modifications before merging. Perfect for organizational workflows.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <h2>Real-World Example</h2>

            <p>
                Here's how the Braid makes multisig practical for a 3-person team:
            </p>

            <div className="not-prose my-8">
                <Card className="bg-bg-secondary border-primary/30">
                    <CardHeader>
                        <CardTitle>Team Treasury Scenario</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="p-4 bg-primary/10 rounded border border-primary/30">
                            <div className="font-semibold text-primary mb-2">Step 1: Initial Setup</div>
                            <div className="text-text-secondary space-y-1 text-xs">
                                <div>• Alice, Bob, and Carol each generate seed phrases</div>
                                <div>• Each derives their xpub at m/48'/0'/0'/2'</div>
                                <div>• They meet to create the 2-of-3 Braid</div>
                                <div>• Export Braid JSON, everyone saves a copy</div>
                            </div>
                        </div>

                        <div className="p-4 bg-pkg-wallets/10 rounded border border-pkg-wallets/30">
                            <div className="font-semibold text-pkg-wallets mb-2">Step 2: Daily Operations</div>
                            <div className="text-text-secondary space-y-1 text-xs">
                                <div>• Need a new invoice? Alice derives address #47 from Braid</div>
                                <div>• Payment received? Bob checks address #47 - same as Alice!</div>
                                <div>• New customer? Carol derives address #48</div>
                                <div>• No coordination needed - everyone has the Braid</div>
                            </div>
                        </div>

                        <div className="p-4 bg-green-950/20 rounded border border-green-500/30">
                            <div className="font-semibold text-green-400 mb-2">Step 3: Spending</div>
                            <div className="text-text-secondary space-y-1 text-xs">
                                <div>• Alice creates PSBT using the Braid</div>
                                <div>• Bob signs with his hardware wallet</div>
                                <div>• Carol signs (now have 2 of 3 signatures)</div>
                                <div>• Broadcast transaction - funds spent!</div>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-950/20 rounded border border-blue-500/30">
                            <div className="font-semibold text-blue-400 mb-2">Step 4: Team Member Changes</div>
                            <div className="text-text-secondary space-y-1 text-xs">
                                <div>• Carol leaves the team</div>
                                <div>• Create new Braid with Alice, Bob, and new member David</div>
                                <div>• Sweep funds from old Braid to new Braid</div>
                                <div>• Old wallet deprecated, new wallet active</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <h2>Key Takeaways</h2>

            <div className="not-prose my-6">
                <Card className="bg-primary/5 border-primary/30">
                    <CardContent className="pt-6">
                        <ul className="space-y-3 text-text-secondary">
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Braid is Caravan's abstraction for multisig wallet config</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Contains network, type, xpubs, quorum, and chain index</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Enables deterministic address derivation</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Eliminates need for address coordination</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Portable as JSON - easy to backup and share</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Use index "0" for receive, "1" for change</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Safe to share - only contains public information</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <h2>What's Next?</h2>

            <p>
                Congratulations! 🎉 You've mastered the Braid - Caravan's most powerful concept.
                You now understand how to:
            </p>

            <ul>
                <li>Create Braids from extended public keys</li>
                <li>Derive deterministic multisig addresses</li>
                <li>Export and import wallet configurations</li>
                <li>Use separate receive and change chains</li>
            </ul>

            <p>
                Ready to put it all together? Head to <strong>Part 3: Build Your Wallet</strong> where
                we'll use everything you've learned to create a complete multisig wallet from scratch!
            </p>

            <PageNavigation />
        </div>
    );
}