/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
/* eslint-disable react/no-unescaped-entities */
'use client';

import { CodePlayground } from '@/components/interactive/code-playground';
import { Callout } from '@/components/content/callout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageNavigation } from '@/components/layout/page-navigation';
import * as CaravanBitcoin from '@caravan/bitcoin';

export default function KeysAddressesPage() {
    return (
        <div className="prose prose-invert max-w-none">
            <h1>Chapter 2: Keys & Addresses</h1>

            <p className="lead text-xl text-text-secondary">
                Understanding the relationship between private keys, public keys, and addresses
                is crucial for Bitcoin development. Let's demystify these concepts.
            </p>

            <h2>The Key Hierarchy</h2>

            <div className="not-prose my-8">
                <Card className="bg-bg-secondary">
                    <CardContent className="pt-6">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-32 text-right text-sm font-semibold text-primary">Private Key</div>
                                <div className="flex-1">
                                    <div className="p-3 bg-red-950/20 border border-red-500/30 rounded">
                                        <code className="text-xs text-red-400">
                                            5HpHagT65TZzG1PH3CSu63k8DbpvD8s5ip4nEB3kEsreAv...</code>
                                    </div>
                                    <p className="text-xs text-text-muted mt-1">🔒 Secret - NEVER share this!</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 mx-12 border-l-2 border-b-2 border-primary rounded-bl-lg" />
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-32 text-right text-sm font-semibold text-primary">Public Key</div>
                                <div className="flex-1">
                                    <div className="p-3 bg-blue-950/20 border border-blue-500/30 rounded">
                                        <code className="text-xs text-blue-400">
                                            04678afdb0fe5548271967f1a67130b7105cd6a828e03909a...</code>
                                    </div>
                                    <p className="text-xs text-text-muted mt-1">🔓 Derived from private key - Safe to share</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 mx-12 border-l-2 border-b-2 border-primary rounded-bl-lg" />
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-32 text-right text-sm font-semibold text-primary">Address</div>
                                <div className="flex-1">
                                    <div className="p-3 bg-green-950/20 border border-green-500/30 rounded">
                                        <code className="text-xs text-green-400">
                                            bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq</code>
                                    </div>
                                    <p className="text-xs text-text-muted mt-1">📫 Hash of public key - Share with anyone</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Callout type="danger" title="Critical Security Rule">
                <p>
                    <strong>Never, EVER share your private key!</strong> Anyone with your private key
                    can spend your Bitcoin. Private keys are called "private" for a reason.
                </p>
            </Callout>

            <h2>Extended Public Keys (xpubs)</h2>

            <p>
                For multisig wallets, we don't work with individual keys. Instead, we use
                <strong> Extended Public Keys (xpubs)</strong>, which allow us to derive unlimited
                addresses without exposing private keys.
            </p>

            <div className="not-prose my-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">What is an xpub?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-text-secondary mb-4">
                            An extended public key is like a "master public key" that can generate child public keys.
                            Each participant in a multisig wallet shares their xpub, allowing everyone to derive the same addresses.
                        </p>
                        <div className="p-4 bg-bg-tertiary rounded font-mono text-xs break-all">
                            <div className="text-primary mb-1">Example xpub (testnet):</div>
                            <div className="text-text-secondary">
                                tpubDFH9dgzveyD8zTbPUFuLrGmCydNvxehyNdUXKJAQN62..........
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <h2>Derivation Paths</h2>

            <p>
                HD (Hierarchical Deterministic) wallets use <strong>derivation paths</strong> to
                organize keys. Think of it like a filing system:
            </p>

            <CodePlayground
                title="Understanding Derivation Paths"
                initialCode={`// Derivation paths follow BIP44/48 standards

// Format: m / purpose' / coin_type' / account' / change / address_index

const paths = {
  "BIP44 (Legacy)": "m/44'/0'/0'/0/0",
  "BIP49 (Wrapped SegWit)": "m/49'/0'/0'/0/0",
  "BIP84 (Native SegWit)": "m/84'/0'/0'/0/0",
  "BIP48 (Multisig)": "m/48'/0'/0'/2'/0/0",
};

console.log("Common Derivation Paths:\\n");

for (const [standard, path] of Object.entries(paths)) {
  console.log(\`\${standard}\`);
  console.log(\`  Path: \${path}\`);
  console.log('');
}

console.log("Path Components:");
console.log("• m = master key");
console.log("• 44'/49'/84'/48' = purpose (standard)");
console.log("• 0' = Bitcoin (1' = Testnet)");
console.log("• 0' = account number");
console.log("• 2' = script type (for BIP48)");
console.log("• 0 = receive (1 = change)");
console.log("• 0 = address index");`}
                imports={{ CaravanBitcoin }}
                height="450px"
            />

            <Callout type="info" title="The Hardened Notation">
                <p>
                    The apostrophe (') in derivation paths means "hardened derivation."
                    Hardened keys provide extra security by preventing child key derivation if
                    the parent public key is compromised.
                </p>
            </Callout>

            <h2>Address Generation Flow</h2>

            <div className="not-prose my-6 p-6 bg-bg-secondary rounded-lg border border-border">
                <div className="space-y-4 text-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">1</div>
                        <div className="flex-1">
                            <div className="font-semibold">Generate Seed Phrase</div>
                            <div className="text-text-muted">12 or 24 words (BIP39)</div>
                        </div>
                    </div>

                    <div className="ml-4 border-l-2 border-border h-8" />

                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">2</div>
                        <div className="flex-1">
                            <div className="font-semibold">Derive Master Key</div>
                            <div className="text-text-muted">Root of the HD tree</div>
                        </div>
                    </div>

                    <div className="ml-4 border-l-2 border-border h-8" />

                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">3</div>
                        <div className="flex-1">
                            <div className="font-semibold">Follow Derivation Path</div>
                            <div className="text-text-muted">m/48'/0'/0'/2' for multisig</div>
                        </div>
                    </div>

                    <div className="ml-4 border-l-2 border-border h-8" />

                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">4</div>
                        <div className="flex-1">
                            <div className="font-semibold">Get Extended Public Key</div>
                            <div className="text-text-muted">This is your xpub - safe to share</div>
                        </div>
                    </div>

                    <div className="ml-4 border-l-2 border-border h-8" />

                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center text-green-400 font-bold">5</div>
                        <div className="flex-1">
                            <div className="font-semibold">Derive Child Keys & Addresses</div>
                            <div className="text-text-muted">Unlimited addresses from one xpub</div>
                        </div>
                    </div>
                </div>
            </div>

            <h2>Why This Matters for Multisig</h2>

            <p>
                In a multisig wallet:
            </p>

            <div className="not-prose my-6">
                <Card className="border-primary/30">
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">👥</span>
                            <div>
                                <div className="font-semibold mb-1">Multiple Participants</div>
                                <div className="text-sm text-text-secondary">
                                    Each person has their own seed phrase and derives their own xpub
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">🔗</span>
                            <div>
                                <div className="font-semibold mb-1">Shared Coordination</div>
                                <div className="text-sm text-text-secondary">
                                    Everyone shares their xpubs (NOT private keys!)
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">📫</span>
                            <div>
                                <div className="font-semibold mb-1">Deterministic Addresses</div>
                                <div className="text-sm text-text-secondary">
                                    All participants can derive the same addresses independently
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">✍️</span>
                            <div>
                                <div className="font-semibold mb-1">Collaborative Signing</div>
                                <div className="text-sm text-text-secondary">
                                    Each person signs with their own private keys (never shared)
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <h2>Try It: Validate an xpub</h2>

            <CodePlayground
                title="Extended Public Key Validation"
                initialCode={`const { validateExtendedPublicKey, Network } = CaravanBitcoin;

// Example testnet xpub
const xpub = "tpubDFH9dgzveyD8zTbPUFuLrGmCydNvxehyNdUXKJAQN62j3S3L3zHNhYLm8vGZb9SSBG3pXnXdDVaK7i1cqwqVgqVvPVXdoFKqGLPqvBPqUUa";

console.log("Validating Extended Public Key:\\n");

const error = validateExtendedPublicKey(xpub, Network.TESTNET);

if (error) {
  console.log("❌ Invalid xpub");
  console.log("Error:", error);
} else {
  console.log("✅ Valid testnet xpub!");
  console.log("");
  console.log("This xpub can be used to:");
  console.log("• Derive unlimited public keys");
  console.log("• Generate receive addresses");
  console.log("• Monitor wallet balance");
  console.log("• Build multisig wallets");
  console.log("");
  console.log("But CANNOT be used to:");
  console.log("• Spend Bitcoin");
  console.log("• Sign transactions");
  console.log("• Derive private keys");
}`}
                imports={{ CaravanBitcoin }}
                height="420px"
            />

            <Callout type="tip" title="Safety of xpubs">
                <p>
                    xpubs are safe to share because they only contain public information. However,
                    you should still treat them carefully:
                </p>
                <ul>
                    <li>✅ Safe: Sharing with multisig coordinators</li>
                    <li>✅ Safe: Storing in wallet configuration files</li>
                    <li>⚠️ Careful: Posting publicly (privacy concerns)</li>
                    <li>❌ Never: Share your private keys or seed phrase!</li>
                </ul>
            </Callout>

            <h2>Key Takeaways</h2>

            <div className="not-prose my-6">
                <Card className="bg-primary/5 border-primary/30">
                    <CardContent className="pt-6">
                        <ul className="space-y-3 text-text-secondary">
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Private keys are secret - never share them</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Public keys are derived from private keys</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Addresses are hashes of public keys</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>xpubs let you derive unlimited addresses</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Derivation paths organize keys hierarchically</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>For multisig, share xpubs (not private keys!)</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <h2>What's Next?</h2>

            <p>
                Now you understand keys and addresses! Next, we'll explore <strong>HD wallets</strong>
                in depth and learn about the BIP standards that make everything work together.
            </p>

            <PageNavigation />
        </div>
    );
}