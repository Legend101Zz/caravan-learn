/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
/* eslint-disable react/no-unescaped-entities */
'use client';

import { CodePlayground } from '@/components/interactive/code-playground';
import { Callout } from '@/components/content/callout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageNavigation } from '@/components/layout/page-navigation';
import * as CaravanBitcoin from '@caravan/bitcoin';

export default function HDWalletsPage() {
    return (
        <div className="prose prose-invert max-w-none">
            <h1>Chapter 3: HD Wallets</h1>

            <p className="lead text-xl text-text-secondary">
                Hierarchical Deterministic (HD) wallets revolutionized Bitcoin by allowing users to
                generate unlimited addresses from a single seed. Let's understand how they work and
                why they're essential for multisig.
            </p>

            <h2>The Problem HD Wallets Solve</h2>

            <div className="not-prose my-8 grid md:grid-cols-2 gap-6">
                <Card className="border-red-500/30">
                    <CardHeader>
                        <CardTitle className="text-lg">❌ Old Way (Random Keys)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-text-secondary">
                        <p>Before HD wallets, each address needed its own private key:</p>
                        <ul className="space-y-2">
                            <li>• Generated random keys for each address</li>
                            <li>• Had to backup every single key</li>
                            <li>• Lost keys = lost Bitcoin forever</li>
                            <li>• Managing keys was a nightmare</li>
                            <li>• Privacy issues from address reuse</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-green-500/30">
                    <CardHeader>
                        <CardTitle className="text-lg">✅ HD Wallets</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-text-secondary">
                        <p>HD wallets derive everything from one seed:</p>
                        <ul className="space-y-2">
                            <li>• One seed → unlimited addresses</li>
                            <li>• Only backup seed phrase once</li>
                            <li>• Deterministic: same seed = same keys</li>
                            <li>• Easy key management</li>
                            <li>• New address for every transaction</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <h2>BIP39: Mnemonic Seed Phrases</h2>

            <p>
                You've probably seen 12 or 24 word seed phrases. These come from <strong>BIP39</strong>
                (Bitcoin Improvement Proposal 39), which standardized how we convert random data into
                memorable words.
            </p>

            <div className="not-prose my-6">
                <Card className="bg-bg-secondary">
                    <CardContent className="pt-6">
                        <div className="text-center mb-6">
                            <div className="text-sm text-text-muted mb-3">Example 12-word seed phrase:</div>
                            <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
                                {['witch', 'collapse', 'practice', 'feed', 'shame', 'open', 'despair', 'creek', 'road', 'again', 'ice', 'least'].map((word, i) => (
                                    <div key={i} className="p-3 bg-primary/10 rounded-lg">
                                        <span className="text-xs text-text-muted mr-2">{i + 1}.</span>
                                        <span className="font-mono text-primary">{word}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="text-center text-sm text-text-secondary">
                            <p>These 12 words contain all the entropy needed to derive your entire wallet</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Callout type="danger" title="Critical: Seed Phrase Security">
                <p><strong>Your seed phrase IS your Bitcoin.</strong></p>
                <ul>
                    <li>• Anyone with your seed phrase can take all your Bitcoin</li>
                    <li>• Never enter it into websites or apps you don't trust</li>
                    <li>• Never share it with anyone</li>
                    <li>• Store it securely offline (steel backup recommended)</li>
                    <li>• If you lose it, your Bitcoin is gone forever</li>
                </ul>
            </Callout>

            <h2>BIP32: Hierarchical Derivation</h2>

            <p>
                <strong>BIP32</strong> defines how to create a tree of keys from a single seed.
                Think of it like a family tree - one master key at the root, with children, grandchildren, etc.
            </p>

            <div className="not-prose my-8 p-6 bg-bg-secondary rounded-lg border border-border">
                <div className="font-mono text-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-32 text-primary">Master Seed</div>
                        <div className="flex-1 p-3 bg-bg-tertiary rounded">
                            <code className="text-xs text-text-secondary break-all">
                                witch collapse practice feed shame open...
                            </code>
                        </div>
                    </div>

                    <div className="ml-8 border-l-2 border-primary/30 pl-8 space-y-4">
                        <div>
                            <div className="text-primary text-xs mb-2">↓ Derive Master Key (m)</div>
                            <div className="p-3 bg-bg-tertiary rounded">
                                <code className="text-xs">xprv9s21ZrQH143K...</code>
                            </div>
                        </div>

                        <div className="ml-8 border-l-2 border-primary/30 pl-8 space-y-4">
                            <div>
                                <div className="text-primary text-xs mb-2">↓ Purpose (m/48')</div>
                                <div className="p-2 bg-bg-tertiary rounded text-xs">Multisig standard</div>
                            </div>

                            <div className="ml-8 border-l-2 border-primary/30 pl-8 space-y-4">
                                <div>
                                    <div className="text-primary text-xs mb-2">↓ Coin Type (m/48'/0')</div>
                                    <div className="p-2 bg-bg-tertiary rounded text-xs">Bitcoin mainnet</div>
                                </div>

                                <div className="ml-8 border-l-2 border-primary/30 pl-8 space-y-4">
                                    <div>
                                        <div className="text-primary text-xs mb-2">↓ Account (m/48'/0'/0')</div>
                                        <div className="p-2 bg-bg-tertiary rounded text-xs">First account</div>
                                    </div>

                                    <div className="ml-8 border-l-2 border-primary/30 pl-8 space-y-4">
                                        <div>
                                            <div className="text-primary text-xs mb-2">↓ Script Type (m/48'/0'/0'/2')</div>
                                            <div className="p-2 bg-bg-tertiary rounded text-xs">P2WSH (Native SegWit)</div>
                                        </div>

                                        <div className="ml-8 border-l-2 border-green-500/30 pl-8 space-y-2">
                                            <div className="text-green-400 text-xs mb-2">↓ Extended Public Key (xpub)</div>
                                            <div className="p-3 bg-green-950/20 border border-green-500/30 rounded">
                                                <div className="text-xs text-green-400">tpubDFH9dgzveyD8...</div>
                                                <div className="text-xs text-text-muted mt-2">
                                                    ✓ Share this for multisig coordination
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <h2>BIP44/48/84: Address Standards</h2>

            <p>
                Different BIPs define standards for different wallet types:
            </p>

            <CodePlayground
                title="Understanding BIP Standards"
                initialCode={`// BIP standards define derivation path conventions

const standards = {
  "BIP44": {
    path: "m/44'/0'/0'/0/0",
    type: "Legacy (P2PKH)",
    addresses: "Start with 1...",
    fees: "Highest",
    note: "Original standard, highest compatibility"
  },
  "BIP49": {
    path: "m/49'/0'/0'/0/0",
    type: "Wrapped SegWit (P2SH-P2WPKH)",
    addresses: "Start with 3...",
    fees: "Medium",
    note: "Compatibility + some SegWit benefits"
  },
  "BIP84": {
    path: "m/84'/0'/0'/0/0",
    type: "Native SegWit (P2WPKH)",
    addresses: "Start with bc1q... (42 chars)",
    fees: "Lower",
    note: "Single-sig SegWit, lower fees"
  },
  "BIP48": {
    path: "m/48'/0'/0'/2'/0/0",
    type: "Multisig SegWit (P2WSH)",
    addresses: "Start with bc1q... (62 chars)",
    fees: "Lowest for multisig",
    note: "⭐ Recommended for Caravan multisig"
  }
};

console.log("Bitcoin BIP Standards:\\n");

for (const [bip, info] of Object.entries(standards)) {
  console.log(\`=== \${bip} ===\`);
  console.log(\`Path: \${info.path}\`);
  console.log(\`Type: \${info.type}\`);
  console.log(\`Addresses: \${info.addresses}\`);
  console.log(\`Fees: \${info.fees}\`);
  console.log(\`Note: \${info.note}\`);
  console.log('');
}`}
                imports={{ CaravanBitcoin }}
                height="450px"
            />

            <h2>Understanding Hardened vs Non-Hardened Derivation</h2>

            <p>
                Notice the apostrophe (') in paths like <code>m/48'/0'/0'</code>?
                This indicates <strong>hardened derivation</strong>.
            </p>

            <div className="not-prose my-6 grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Non-Hardened (no ')</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-text-secondary">
                        <code className="text-primary">m/0/0</code>
                        <p><strong>Public Derivation:</strong></p>
                        <ul className="space-y-2">
                            <li>• Can derive child public keys from parent public key</li>
                            <li>• Useful for watch-only wallets</li>
                            <li>• Used for address indices (last two levels)</li>
                            <li>• Less secure if parent key leaked</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Hardened (with ')</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-text-secondary">
                        <code className="text-primary">m/48'/0'/0'</code>
                        <p><strong>Private Derivation:</strong></p>
                        <ul className="space-y-2">
                            <li>• Requires parent private key</li>
                            <li>• More secure against key leakage</li>
                            <li>• Used for upper levels (purpose, coin, account)</li>
                            <li>• Cannot derive children from xpub alone</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <h2>The Complete Path Breakdown</h2>

            <p>
                Let's break down the BIP48 path used for Caravan multisig wallets:
            </p>

            <div className="not-prose my-6">
                <Card className="bg-bg-secondary">
                    <CardContent className="pt-6 space-y-4 font-mono text-sm">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-primary/10 rounded">
                                <div className="text-primary mb-1">m</div>
                                <div className="text-xs text-text-secondary">Master key (the root)</div>
                            </div>
                            <div className="p-3 bg-primary/10 rounded">
                                <div className="text-primary mb-1">48'</div>
                                <div className="text-xs text-text-secondary">Purpose: Multisig (hardened)</div>
                            </div>
                            <div className="p-3 bg-primary/10 rounded">
                                <div className="text-primary mb-1">0'</div>
                                <div className="text-xs text-text-secondary">Coin: Bitcoin (1'=Testnet)</div>
                            </div>
                            <div className="p-3 bg-primary/10 rounded">
                                <div className="text-primary mb-1">0'</div>
                                <div className="text-xs text-text-secondary">Account: First account</div>
                            </div>
                            <div className="p-3 bg-primary/10 rounded">
                                <div className="text-primary mb-1">2'</div>
                                <div className="text-xs text-text-secondary">Script: P2WSH (Native SegWit)</div>
                            </div>
                            <div className="p-3 bg-green-600/10 rounded border border-green-500/30">
                                <div className="text-green-400 mb-1">xpub level</div>
                                <div className="text-xs text-text-muted">Export & share this level</div>
                            </div>
                            <div className="p-3 bg-blue-600/10 rounded">
                                <div className="text-blue-400 mb-1">0</div>
                                <div className="text-xs text-text-secondary">Change: Receive addresses</div>
                            </div>
                            <div className="p-3 bg-blue-600/10 rounded">
                                <div className="text-blue-400 mb-1">0,1,2...</div>
                                <div className="text-xs text-text-secondary">Index: Address number</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Callout type="info" title="Why Two Non-Hardened Levels?">
                <p>
                    The last two levels (change and index) are non-hardened so that:
                </p>
                <ul>
                    <li>• You can give someone your xpub to generate addresses</li>
                    <li>• They don't need your private keys</li>
                    <li>• Perfect for multisig coordination!</li>
                    <li>• Everyone can independently derive the same addresses</li>
                </ul>
            </Callout>

            <h2>Receive vs Change Addresses</h2>

            <p>
                HD wallets use two chains of addresses:
            </p>

            <div className="not-prose my-6 grid md:grid-cols-2 gap-6">
                <Card className="border-green-500/30">
                    <CardHeader>
                        <CardTitle className="text-lg">Receive Chain (0)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <code className="text-green-400">m/48'/0'/0'/2'/0/x</code>
                        <p className="text-text-secondary">
                            These are addresses you share with others to receive Bitcoin:
                        </p>
                        <ul className="space-y-2 text-text-secondary">
                            <li>• Index 0: First receive address</li>
                            <li>• Index 1: Second receive address</li>
                            <li>• Index 2: Third receive address</li>
                            <li>• ... and so on</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-yellow-500/30">
                    <CardHeader>
                        <CardTitle className="text-lg">Change Chain (1)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <code className="text-yellow-400">m/48'/0'/0'/2'/1/x</code>
                        <p className="text-text-secondary">
                            Internal addresses for receiving change from your own transactions:
                        </p>
                        <ul className="space-y-2 text-text-secondary">
                            <li>• Index 0: First change address</li>
                            <li>• Index 1: Second change address</li>
                            <li>• Better privacy (not reusing addresses)</li>
                            <li>• Automatically managed by wallet</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <h2>Try It: Understanding Extended Keys</h2>

            <CodePlayground
                title="Extended Public Key Properties"
                initialCode={`const { validateExtendedPublicKey, Network } = CaravanBitcoin;

// Example testnet xpub at m/48'/1'/0'/2'
const xpub = "tpubDFH9dgzveyD8zTbPUFuLrGmCydNvxehyNdUXKJAQN62j3S3L3zHNhYLm8vGZb9SSBG3pXnXdDVaK7i1cqwqVgqVvPVXdoFKqGLPqvBPqUUa";

console.log("Extended Public Key Analysis:\\n");

// Validate
const error = validateExtendedPublicKey(xpub, Network.TESTNET);

if (error) {
  console.log("❌ Invalid:", error);
} else {
  console.log("✅ Valid testnet xpub\\n");
  
  console.log("What this xpub represents:");
  console.log("• Derived at: m/48'/1'/0'/2'");
  console.log("• Network: Testnet");
  console.log("• Script type: P2WSH (Native SegWit)");
  console.log("• Account: 0 (first account)");
  console.log("");
  
  console.log("Can derive:");
  console.log("• Unlimited receive addresses (.../0/0, .../0/1, .../0/2...)");
  console.log("• Unlimited change addresses (.../1/0, .../1/1, .../1/2...)");
  console.log("");
  
  console.log("Cannot derive:");
  console.log("• Private keys (need seed phrase)");
  console.log("• Different accounts (would need different xpub)");
  console.log("• Different script types (would need different path)");
  console.log("");
  
  console.log("Perfect for:");
  console.log("• 🤝 Multisig coordination");
  console.log("• 👀 Watch-only wallets");
  console.log("• 📊 Balance monitoring");
}`}
                imports={{ CaravanBitcoin }}
                height="520px"
            />

            <h2>Gap Limit</h2>

            <p>
                One important concept in HD wallets is the <strong>gap limit</strong>.
            </p>

            <div className="not-prose my-6">
                <Card className="bg-bg-secondary">
                    <CardContent className="pt-6">
                        <div className="text-center mb-4">
                            <div className="text-4xl mb-2">🔍</div>
                            <h3 className="font-semibold text-lg mb-2">The Gap Limit Problem</h3>
                        </div>
                        <p className="text-text-secondary mb-4 text-center max-w-2xl mx-auto">
                            Since HD wallets can generate unlimited addresses, how does a wallet know when to stop
                            checking for transactions?
                        </p>
                        <div className="p-4 bg-bg-tertiary rounded">
                            <p className="text-sm text-text-secondary mb-3">
                                <strong className="text-primary">Solution:</strong> The gap limit (usually 20) means:
                            </p>
                            <ul className="space-y-2 text-sm text-text-secondary">
                                <li>• Generate addresses sequentially (0, 1, 2, 3...)</li>
                                <li>• If 20 consecutive addresses have no transactions, stop</li>
                                <li>• This prevents scanning forever</li>
                                <li>• Always use addresses in order for best compatibility</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Callout type="warning" title="Skipping Addresses">
                <p>
                    Don't skip addresses! If you use address #25 but never used #0-#24, some wallets
                    might not find your Bitcoin (they stop at the gap limit). Always use addresses in order.
                </p>
            </Callout>

            <h2>Putting It All Together</h2>

            <div className="not-prose my-8">
                <Card className="border-primary/30">
                    <CardHeader>
                        <CardTitle>HD Wallet Flow for Multisig</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 text-sm">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">1</div>
                                <div>
                                    <div className="font-semibold">Each participant generates a seed phrase</div>
                                    <div className="text-text-muted text-xs mt-1">12 or 24 words - kept totally secret</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 text-sm">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">2</div>
                                <div>
                                    <div className="font-semibold">Derive to BIP48 level</div>
                                    <div className="text-text-muted text-xs mt-1">Follow path m/48'/0'/0'/2' for Bitcoin mainnet P2WSH</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 text-sm">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">3</div>
                                <div>
                                    <div className="font-semibold">Export extended public key (xpub)</div>
                                    <div className="text-text-muted text-xs mt-1">This is safe to share with other signers</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 text-sm">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">4</div>
                                <div>
                                    <div className="font-semibold">Share xpubs among all participants</div>
                                    <div className="text-text-muted text-xs mt-1">Everyone needs everyone else's xpubs</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 text-sm">
                                <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center text-green-400 font-bold flex-shrink-0">5</div>
                                <div>
                                    <div className="font-semibold">Derive addresses independently</div>
                                    <div className="text-text-muted text-xs mt-1">All participants can generate the same addresses!</div>
                                </div>
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
                                <span>HD wallets generate unlimited keys from one seed</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>BIP39 converts entropy to memorable words</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>BIP32 defines the hierarchical key tree</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>BIP48 is the standard for multisig wallets</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Hardened (') derivation provides extra security</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>xpubs allow address derivation without private keys</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Always use addresses in order (gap limit)</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <h2>What's Next?</h2>

            <p>
                Now you understand how HD wallets work! Next, we'll dive into <strong>multisig basics</strong>
                and learn how multiple signatures work together to secure Bitcoin.
            </p>

            <PageNavigation />
        </div>
    );
}