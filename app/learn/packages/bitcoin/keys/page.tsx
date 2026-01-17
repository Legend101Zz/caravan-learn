'use client';

import { CodePlayground } from '@/components/interactive/code-playground';
import { Callout } from '@/components/content/callout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageNavigation } from '@/components/layout/page-navigation';
import { XpubExplorerTool } from '@/components/interactive/xpub-explorer-tool';
import * as CaravanBitcoin from '@caravan/bitcoin';

export default function KeysPage() {
    return (
        <div className="prose prose-invert max-w-none">
            <div className="not-prose mb-8">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                    @caravan/bitcoin
                </div>
                <h1 className="text-5xl font-bold mb-4">Keys</h1>
                <p className="text-xl text-text-secondary">
                    Public keys, extended keys, and HD wallet derivation
                </p>
            </div>

            <h2>Interactive Extended Key Explorer</h2>

            <p>
                Extended public keys (xpubs) are the foundation of HD wallets and multisig coordination.
                Use this tool to validate and analyze extended public keys:
            </p>

            {/* Interactive Tool */}
            <div className="not-prose">
                <XpubExplorerTool />
            </div>

            <h2>Understanding Extended Public Keys</h2>

            <p>
                An <strong>Extended Public Key (xpub)</strong> is a powerful concept that allows you to
                derive unlimited child public keys without exposing any private keys.
            </p>

            <div className="not-prose my-8">
                <Card className="bg-bg-secondary">
                    <CardContent className="pt-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-4 bg-red-950/20 border border-red-500/30 rounded">
                                <h3 className="font-semibold text-red-400 mb-3">❌ Without Extended Keys</h3>
                                <div className="text-sm text-text-secondary space-y-2">
                                    <p>For each address you need:</p>
                                    <ul className="space-y-1 text-xs">
                                        <li>• Share individual public keys</li>
                                        <li>• Coordinate for each new address</li>
                                        <li>• Manual address generation</li>
                                        <li>• Complex backup procedures</li>
                                        <li>• Difficult to stay in sync</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="p-4 bg-green-950/20 border border-green-500/30 rounded">
                                <h3 className="font-semibold text-green-400 mb-3">✅ With Extended Keys</h3>
                                <div className="text-sm text-text-secondary space-y-2">
                                    <p>Share xpub once, then:</p>
                                    <ul className="space-y-1 text-xs">
                                        <li>• Derive unlimited public keys</li>
                                        <li>• Generate addresses independently</li>
                                        <li>• Automatic synchronization</li>
                                        <li>• Simple backup (just the xpub)</li>
                                        <li>• Perfect for multisig!</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <h2>Extended Key Format</h2>

            <p>
                Extended keys contain more than just the public key - they include metadata for derivation:
            </p>

            <div className="not-prose my-6">
                <Card className="bg-bg-secondary">
                    <CardHeader>
                        <CardTitle>Extended Key Structure</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-bg-tertiary rounded font-mono text-xs break-all">
                            <div className="text-primary mb-2">Example Testnet xpub:</div>
                            <div className="text-text-secondary">
                                tpubDFH9dgzveyD8zTbPUFuLrGmCydNvxehyNdUXKJAQN62j3S3L3zHNhYLm8vGZb9SSBG3pXnXdDVaK7i1cqwqVgqVvPVXdoFKqGLPqvBPqUUa
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="p-3 bg-primary/10 rounded">
                                <div className="font-semibold text-primary mb-2">Version (4 bytes)</div>
                                <div className="text-text-secondary text-xs">
                                    <code>tpub</code> = testnet public<br />
                                    <code>xpub</code> = mainnet public<br />
                                    <code>xprv</code> = mainnet private (secret!)
                                </div>
                            </div>

                            <div className="p-3 bg-pkg-psbt/10 rounded">
                                <div className="font-semibold text-pkg-psbt mb-2">Depth (1 byte)</div>
                                <div className="text-text-secondary text-xs">
                                    How many derivations from master<br />
                                    (e.g., m/48'/0'/0'/2' = depth 4)
                                </div>
                            </div>

                            <div className="p-3 bg-pkg-wallets/10 rounded">
                                <div className="font-semibold text-pkg-wallets mb-2">Fingerprint (4 bytes)</div>
                                <div className="text-text-secondary text-xs">
                                    Parent key identifier<br />
                                    Used to verify key relationships
                                </div>
                            </div>

                            <div className="p-3 bg-pkg-multisig/10 rounded">
                                <div className="font-semibold text-pkg-multisig mb-2">Child Number (4 bytes)</div>
                                <div className="text-text-secondary text-xs">
                                    Which child in sequence<br />
                                    Hardened if ≥ 2³¹
                                </div>
                            </div>

                            <div className="p-3 bg-pkg-clients/10 rounded">
                                <div className="font-semibold text-pkg-clients mb-2">Chain Code (32 bytes)</div>
                                <div className="text-text-secondary text-xs">
                                    Entropy for derivation<br />
                                    Enables child key generation
                                </div>
                            </div>

                            <div className="p-3 bg-pkg-fees/10 rounded">
                                <div className="font-semibold text-pkg-fees mb-2">Public Key (33 bytes)</div>
                                <div className="text-text-secondary text-xs">
                                    Compressed public key<br />
                                    The actual cryptographic key
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <h2>Validating Extended Keys</h2>

            <CodePlayground
                title="Extended Key Validation"
                initialCode={`const { validateExtendedPublicKey, Network } = CaravanBitcoin;

// Test various extended keys
const keys = [
  {
    name: "Valid testnet xpub",
    key: "tpubDFH9dgzveyD8zTbPUFuLrGmCydNvxehyNdUXKJAQN62j3S3L3zHNhYLm8vGZb9SSBG3pXnXdDVaK7i1cqwqVgqVvPVXdoFKqGLPqvBPqUUa",
    network: Network.TESTNET
  },
  {
    name: "Testnet xpub on mainnet (wrong network)",
    key: "tpubDFH9dgzveyD8zTbPUFuLrGmCydNvxehyNdUXKJAQN62j3S3L3zHNhYLm8vGZb9SSBG3pXnXdDVaK7i1cqwqVgqVvPVXdoFKqGLPqvBPqUUa",
    network: Network.MAINNET
  },
  {
    name: "Invalid checksum",
    key: "tpubDFH9dgzveyD8zTbPUFuLrGmCydNvxehyNdUXKJAQN62j3S3L3zHNhYLm8vGZb9SSBG3pXnXdDVaK7i1cqwqVgqVvPVXdoFKqGLPqvBPqXXX",
    network: Network.TESTNET
  },
  {
    name: "Too short",
    key: "tpubshort",
    network: Network.TESTNET
  }
];

console.log("Extended Key Validation Tests:\\n");

keys.forEach(({ name, key, network }) => {
  const error = validateExtendedPublicKey(key, network);
  
  console.log(\`Test: \${name}\`);
  console.log(\`Key: \${key.substring(0, 30)}...\`);
  console.log(\`Network: \${network === Network.MAINNET ? 'Mainnet' : 'Testnet'}\`);
  console.log(\`Result: \${error ? '❌ ' + error : '✅ Valid'}\`);
  console.log('');
});`}
                imports={{ CaravanBitcoin }}
                height="450px"
            />

            <Callout type="warning" title="xpub vs xprv">
                <p>
                    <strong>CRITICAL:</strong> Extended keys come in two flavors:
                </p>
                <ul>
                    <li>• <strong>xpub/tpub:</strong> Extended PUBLIC key - safe to share</li>
                    <li>• <strong>xprv/tprv:</strong> Extended PRIVATE key - NEVER share!</li>
                </ul>
                <p>
                    An xprv can derive both public AND private keys. Anyone with your xprv can spend
                    all Bitcoin controlled by that key. Keep it secret!
                </p>
            </Callout>

            <h2>Public Key Operations</h2>

            <p>
                Caravan provides utilities for working with public keys:
            </p>

            <CodePlayground
                title="Public Key Utilities"
                initialCode={`const { 
  validatePublicKey,
  compressPublicKey,
  toHexString
} = CaravanBitcoin;

// Example public keys
const uncompressedPubkey = "04678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb649f6bc3f4cef38c4f35504e51ec112de5c384df7ba0b8d578a4c702b6bf11d5f";
const compressedPubkey = "02678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb6";

console.log("Public Key Operations:\\n");

// Validate keys
console.log("Validation:");
console.log(\`Uncompressed (\${uncompressedPubkey.length} chars): \${validatePublicKey(uncompressedPubkey) || '✅'}\`);
console.log(\`Compressed (\${compressedPubkey.length} chars): \${validatePublicKey(compressedPubkey) || '✅'}\`);

console.log('');
console.log("Key Information:");
console.log("Uncompressed keys:");
console.log("  • Start with 04");
console.log("  • 130 hex characters (65 bytes)");
console.log("  • Contains both X and Y coordinates");
console.log('');
console.log("Compressed keys:");
console.log("  • Start with 02 or 03");
console.log("  • 66 hex characters (33 bytes)");
console.log("  • Contains X coordinate + Y parity");
console.log("  • Saves space (preferred)");`}
                imports={{ CaravanBitcoin }}
                height="450px"
            />

            <h2>Deriving Child Keys</h2>

            <p>
                While extended keys enable child key derivation, this is typically handled by higher-level
                functions (like the Braid). Here's the concept:
            </p>

            <div className="not-prose my-8">
                <Card className="bg-bg-secondary">
                    <CardHeader>
                        <CardTitle>Child Key Derivation</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 text-sm">
                            <div className="p-4 bg-primary/10 rounded border border-primary/30">
                                <div className="font-semibold text-primary mb-2">Parent xpub</div>
                                <div className="font-mono text-xs text-text-muted break-all mb-3">
                                    tpubDFH9dgzveyD8zTbPUFuLrGmCydNvxehyNdUXKJAQN62j3S3L3zHNhYLm8vGZb9...
                                </div>
                                <div className="text-xs text-text-secondary">
                                    At derivation path: m/48'/1'/0'/2'
                                </div>
                            </div>

                            <div className="flex items-center justify-center text-primary">
                                <div className="text-2xl">↓</div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-3">
                                <div className="p-3 bg-green-950/20 border border-green-500/30 rounded">
                                    <div className="font-semibold text-green-400 mb-2 text-xs">
                                        Receive Chain (0)
                                    </div>
                                    <div className="space-y-1 text-xs text-text-muted font-mono">
                                        <div>.../0/0 → addr #0</div>
                                        <div>.../0/1 → addr #1</div>
                                        <div>.../0/2 → addr #2</div>
                                        <div>.../0/... → ∞ addresses</div>
                                    </div>
                                </div>

                                <div className="p-3 bg-yellow-950/20 border border-yellow-500/30 rounded">
                                    <div className="font-semibold text-yellow-400 mb-2 text-xs">
                                        Change Chain (1)
                                    </div>
                                    <div className="space-y-1 text-xs text-text-muted font-mono">
                                        <div>.../1/0 → change #0</div>
                                        <div>.../1/1 → change #1</div>
                                        <div>.../1/2 → change #2</div>
                                        <div>.../1/... → ∞ addresses</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <h2>xpub Best Practices</h2>

            <div className="not-prose my-6 space-y-4">
                <Card className="border-green-500/30">
                    <CardHeader>
                        <CardTitle className="text-lg">✅ Best Practices</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-text-secondary space-y-2">
                        <ul className="space-y-2">
                            <li>• <strong>Backup your xpubs:</strong> Store them with your wallet config</li>
                            <li>• <strong>Verify before sharing:</strong> Always validate xpubs before use</li>
                            <li>• <strong>Use standard paths:</strong> BIP48 (m/48'/0'/0'/2') for multisig</li>
                            <li>• <strong>Check the network:</strong> xpub=mainnet, tpub=testnet</li>
                            <li>• <strong>Document derivation paths:</strong> Know where your xpub came from</li>
                            <li>• <strong>Test on testnet first:</strong> Always!</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-red-500/30">
                    <CardHeader>
                        <CardTitle className="text-lg">❌ Common Mistakes</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-text-secondary space-y-2">
                        <ul className="space-y-2">
                            <li>• <strong>Sharing xprv instead of xpub:</strong> Game over - funds can be stolen!</li>
                            <li>• <strong>Wrong network validation:</strong> Testnet xpub on mainnet fails</li>
                            <li>• <strong>Non-standard paths:</strong> May not work with other wallets</li>
                            <li>• <strong>Not backing up:</strong> Lose xpub = can't derive addresses</li>
                            <li>• <strong>Mixing account levels:</strong> Use same derivation depth for all</li>
                        </ul>
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
                                <span>Extended public keys enable unlimited address derivation</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>xpub is safe to share, xprv is SECRET</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Always validate xpubs against the correct network</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Extended keys contain metadata for deterministic derivation</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Use BIP48 paths for multisig compatibility</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <PageNavigation />
        </div>
    );
}