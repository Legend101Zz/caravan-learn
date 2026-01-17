/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
/* eslint-disable react/no-unescaped-entities */
'use client';

import { CodePlayground } from '@/components/interactive/code-playground';
import { Callout } from '@/components/content/callout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageNavigation } from '@/components/layout/page-navigation';
import { PSBTDecoderTool } from '@/components/interactive/psbt-decoder-tool';
import * as CaravanPSBT from '@caravan/psbt';

export default function PSBTStructurePage() {
    return (
        <div className="prose prose-invert max-w-none">
            <div className="not-prose mb-8">
                <div className="inline-block px-3 py-1 rounded-full bg-pkg-psbt/20 text-pkg-psbt text-sm font-medium mb-4">
                    @caravan/psbt
                </div>
                <h1 className="text-5xl font-bold mb-4">PSBT Structure</h1>
                <p className="text-xl text-text-secondary">
                    Understanding the internal format of Partially Signed Bitcoin Transactions
                </p>
            </div>

            <h2>Interactive PSBT Decoder</h2>

            <p>
                Decode and explore the structure of a PSBT:
            </p>

            {/* Interactive Tool */}
            <div className="not-prose">
                <PSBTDecoderTool />
            </div>

            <h2>PSBT Format Overview</h2>

            <p>
                A PSBT is structured as a set of key-value maps. Think of it like a form with different
                sections that get filled in at different stages:
            </p>

            <div className="not-prose my-8">
                <Card className="bg-bg-secondary">
                    <CardHeader>
                        <CardTitle>PSBT Components</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 bg-primary/10 rounded border border-primary/30">
                                <div className="font-semibold text-primary mb-2">Global Map</div>
                                <div className="text-sm text-text-secondary space-y-1">
                                    <div className="text-xs">Information about the whole transaction:</div>
                                    <ul className="text-xs space-y-1 mt-2">
                                        <li>• Unsigned transaction</li>
                                        <li>• PSBT version</li>
                                        <li>• Extended public keys</li>
                                        <li>• Transaction version</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="p-4 bg-pkg-psbt/10 rounded border border-pkg-psbt/30">
                                <div className="font-semibold text-pkg-psbt mb-2">Input Maps</div>
                                <div className="text-sm text-text-secondary space-y-1">
                                    <div className="text-xs">One map per input, containing:</div>
                                    <ul className="text-xs space-y-1 mt-2">
                                        <li>• Previous UTXO data</li>
                                        <li>• Redeem/witness scripts</li>
                                        <li>• Partial signatures</li>
                                        <li>• Derivation paths</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="p-4 bg-pkg-wallets/10 rounded border border-pkg-wallets/30">
                                <div className="font-semibold text-pkg-wallets mb-2">Output Maps</div>
                                <div className="text-sm text-text-secondary space-y-1">
                                    <div className="text-xs">One map per output, containing:</div>
                                    <ul className="text-xs space-y-1 mt-2">
                                        <li>• Redeem scripts (if applicable)</li>
                                        <li>• Witness scripts (if applicable)</li>
                                        <li>• Derivation paths (for change)</li>
                                        <li>• Output descriptors</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="p-4 bg-pkg-multisig/10 rounded border border-pkg-multisig/30">
                                <div className="font-semibold text-pkg-multisig mb-2">Proprietary Fields</div>
                                <div className="text-sm text-text-secondary space-y-1">
                                    <div className="text-xs">Custom data for specific wallets:</div>
                                    <ul className="text-xs space-y-1 mt-2">
                                        <li>• Wallet-specific metadata</li>
                                        <li>• Custom signing info</li>
                                        <li>• Application data</li>
                                        <li>• Extensions</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <h2>Global Map Fields</h2>

            <p>
                The global map contains information that applies to the entire transaction:
            </p>

            <CodePlayground
                title="Global Map Structure"
                initialCode={`// PSBT Global Map conceptual structure

console.log("PSBT Global Map Fields:\\n");

const globalMap = {
  PSBT_GLOBAL_UNSIGNED_TX: {
    description: "The unsigned transaction",
    type: 0x00,
    required: true,
    note: "Contains inputs and outputs (without signatures)"
  },
  
  PSBT_GLOBAL_XPUB: {
    description: "Extended public key",
    type: 0x01,
    required: false,
    note: "Can have multiple xpubs for multisig"
  },
  
  PSBT_GLOBAL_VERSION: {
    description: "PSBT version number",
    type: 0xfb,
    required: false,
    note: "0 for PSBTv0, 2 for PSBTv2"
  },
  
  PSBT_GLOBAL_TX_VERSION: {
    description: "Transaction version (PSBTv2)",
    type: 0x02,
    required: false,
    note: "Usually 2 for modern transactions"
  }
};

for (const [field, info] of Object.entries(globalMap)) {
  console.log(\`\${field}:\`);
  console.log(\`  Type: 0x\${info.type.toString(16).padStart(2, '0')}\`);
  console.log(\`  Required: \${info.required ? 'Yes' : 'No'}\`);
  console.log(\`  \${info.note}\`);
  console.log('');
}`}
                imports={{ CaravanPSBT }}
                height="450px"
            />

            <h2>Input Map Fields</h2>

            <p>
                Each input has its own map with information needed to sign that input:
            </p>

            <div className="not-prose my-8">
                <Card className="bg-bg-secondary">
                    <CardHeader>
                        <CardTitle className="text-lg">Critical Input Fields</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                        <div className="p-3 bg-primary/10 rounded">
                            <div className="font-semibold text-primary mb-1">PSBT_IN_NON_WITNESS_UTXO</div>
                            <div className="text-text-secondary text-xs">
                                Full previous transaction (for non-SegWit inputs). Allows verification
                                of input value and scriptPubKey.
                            </div>
                        </div>

                        <div className="p-3 bg-pkg-psbt/10 rounded">
                            <div className="font-semibold text-pkg-psbt mb-1">PSBT_IN_WITNESS_UTXO</div>
                            <div className="text-text-secondary text-xs">
                                Just the UTXO being spent (for SegWit). Smaller and sufficient for SegWit signing.
                            </div>
                        </div>

                        <div className="p-3 bg-pkg-wallets/10 rounded">
                            <div className="font-semibold text-pkg-wallets mb-1">PSBT_IN_PARTIAL_SIG</div>
                            <div className="text-text-secondary text-xs">
                                Signature from one of the signers. Can have multiple for multisig.
                            </div>
                        </div>

                        <div className="p-3 bg-pkg-multisig/10 rounded">
                            <div className="font-semibold text-pkg-multisig mb-1">PSBT_IN_REDEEM_SCRIPT / WITNESS_SCRIPT</div>
                            <div className="text-text-secondary text-xs">
                                The script needed to spend this input (critical for P2SH/P2WSH).
                            </div>
                        </div>

                        <div className="p-3 bg-pkg-clients/10 rounded">
                            <div className="font-semibold text-pkg-clients mb-1">PSBT_IN_BIP32_DERIVATION</div>
                            <div className="text-text-secondary text-xs">
                                Derivation path for this input's key. Helps hardware wallets derive the right key.
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <CodePlayground
                title="Input Map Example"
                initialCode={`// Example input map structure for a multisig input

console.log("Multisig Input Map Example:\\n");

const inputMap = {
  // The UTXO being spent
  witnessUtxo: {
    value: 100000000, // 1 BTC in satoshis
    scriptPubKey: "0020ab12cd34..." // P2WSH script
  },
  
  // The witness script (2-of-3 multisig)
  witnessScript: "5221abc...53ae", // OP_2 <pubkey1> <pubkey2> <pubkey3> OP_3 OP_CHECKMULTISIG
  
  // BIP32 derivation paths for each key
  bip32Derivation: [
    {
      pubkey: "02abc...",
      masterFingerprint: "a1b2c3d4",
      path: "m/48'/0'/0'/2'/0/0"
    },
    {
      pubkey: "03def...",
      masterFingerprint: "e5f6g7h8",
      path: "m/48'/0'/0'/2'/0/0"
    },
    {
      pubkey: "02ghi...",
      masterFingerprint: "i9j0k1l2",
      path: "m/48'/0'/0'/2'/0/0"
    }
  ],
  
  // Partial signatures (after signing)
  partialSigs: [
    {
      pubkey: "02abc...",
      signature: "304402..."
    },
    {
      pubkey: "03def...",
      signature: "304502..."
    }
    // Missing third signature - only need 2 of 3!
  ]
};

console.log(JSON.stringify(inputMap, null, 2));
console.log("\\n✓ This input has 2 of 3 required signatures!");`}
                imports={{ CaravanPSBT }}
                height="520px"
            />

            <Callout type="info" title="Why All This Data?">
                <p>
                    The PSBT format includes all this information so that:
                </p>
                <ul>
                    <li>• Hardware wallets can verify what they're signing</li>
                    <li>• Signers don't need access to the blockchain</li>
                    <li>• Transaction can be validated before broadcasting</li>
                    <li>• All parties can independently verify the details</li>
                </ul>
            </Callout>

            <h2>PSBT Encoding</h2>

            <p>
                PSBTs are encoded in a binary format, then typically base64-encoded for transport:
            </p>

            <div className="not-prose my-8">
                <Card className="bg-bg-secondary">
                    <CardContent className="pt-6 space-y-4">
                        <div className="p-4 bg-primary/10 rounded border border-primary/30">
                            <div className="font-semibold text-primary mb-2">1. Binary Format</div>
                            <div className="text-sm text-text-secondary mb-3">
                                Magic bytes + version + key-value maps
                            </div>
                            <div className="font-mono text-xs text-text-muted break-all">
                                70 73 62 74 ff 01 00 fd ...
                            </div>
                        </div>

                        <div className="text-center text-2xl">↓</div>

                        <div className="p-4 bg-pkg-psbt/10 rounded border border-pkg-psbt/30">
                            <div className="font-semibold text-pkg-psbt mb-2">2. Base64 Encoding</div>
                            <div className="text-sm text-text-secondary mb-3">
                                Makes it text-safe for sharing
                            </div>
                            <div className="font-mono text-xs text-text-muted break-all">
                                cHNidP8BAH0CAAAAAe7xFx...
                            </div>
                        </div>

                        <div className="text-center text-2xl">↓</div>

                        <div className="p-4 bg-pkg-wallets/10 rounded border border-pkg-wallets/30">
                            <div className="font-semibold text-pkg-wallets mb-2">3. Transport</div>
                            <div className="text-sm text-text-secondary">
                                Share via file, QR code, clipboard, or NFC
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <h2>PSBTv0 vs PSBTv2 Differences</h2>

            <CodePlayground
                title="Version Differences"
                initialCode={`console.log("PSBTv0 vs PSBTv2 Differences:\\n");

console.log("=== PSBTv0 (BIP174) ===");
console.log("Global Map:");
console.log("  • Unsigned transaction (required)");
console.log("  • Extended public keys (optional)");
console.log("");
console.log("Input/Output Maps:");
console.log("  • Basic signing information");
console.log("  • Limited metadata support");
console.log("");

console.log("=== PSBTv2 (BIP370) ===");
console.log("Global Map:");
console.log("  • Transaction version (new)");
console.log("  • Fallback locktime (new)");
console.log("  • Input/output counts (new)");
console.log("  • Transaction modifiable flags (new)");
console.log("");
console.log("Input Maps:");
console.log("  • Previous txid (new)");
console.log("  • Output index (new)");
console.log("  • Sequence (new)");
console.log("  • Required time/height locktime (new)");
console.log("");
console.log("Output Maps:");
console.log("  • Amount (new)");
console.log("  • Script (new)");
console.log("");
console.log("Key Improvement:");
console.log("PSBTv2 allows constructing the transaction");
console.log("piece by piece, rather than requiring the");
console.log("full unsigned tx upfront. Better for:");
console.log("  • CoinJoin");
console.log("  • Complex fee bumping");
console.log("  • Advanced use cases");`}
                imports={{ CaravanPSBT }}
                height="520px"
            />

            <h2>Key Takeaways</h2>

            <div className="not-prose my-6">
                <Card className="bg-pkg-psbt/5 border-pkg-psbt/30">
                    <CardContent className="pt-6">
                        <ul className="space-y-3 text-text-secondary">
                            <li className="flex gap-3">
                                <span className="text-pkg-psbt text-xl">✓</span>
                                <span>PSBTs are structured as key-value maps</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-pkg-psbt text-xl">✓</span>
                                <span>Global map for transaction-wide data</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-pkg-psbt text-xl">✓</span>
                                <span>Input maps contain signing information</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-pkg-psbt text-xl">✓</span>
                                <span>Output maps have script and derivation data</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-pkg-psbt text-xl">✓</span>
                                <span>Encoded as binary, typically transported as base64</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-pkg-psbt text-xl">✓</span>
                                <span>PSBTv2 adds more flexibility for complex transactions</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <PageNavigation />
        </div>
    );
}