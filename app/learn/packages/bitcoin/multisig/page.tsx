'use client';

import { CodePlayground } from '@/components/interactive/code-playground';
import { Callout } from '@/components/content/callout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageNavigation } from '@/components/layout/page-navigation';
import { MultisigGeneratorTool } from '@/components/interactive/multisig-generator-tool';
import * as CaravanBitcoin from '@caravan/bitcoin';

export default function MultisigPage() {
    return (
        <div className="prose prose-invert max-w-none">
            <div className="not-prose mb-8">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                    @caravan/bitcoin
                </div>
                <h1 className="text-5xl font-bold mb-4">Multisig Operations</h1>
                <p className="text-xl text-text-secondary">
                    Create and manage multisignature Bitcoin addresses
                </p>
            </div>

            <h2>Interactive Multisig Generator</h2>

            <p>
                Create multisig addresses from public keys. This tool demonstrates how Caravan
                combines multiple public keys into a single multisig address:
            </p>

            {/* Interactive Tool */}
            <div className="not-prose">
                <MultisigGeneratorTool />
            </div>

            <h2>Creating Multisig Addresses</h2>

            <p>
                The core of multisig is combining multiple public keys into a single address that
                requires M-of-N signatures to spend.
            </p>

            <CodePlayground
                title="Basic Multisig Address Creation"
                initialCode={`const { 
  Network,
  generateMultisigFromPublicKeys,
  multisigAddress,
  multisigRedeemScript
} = CaravanBitcoin;

// Three public keys
const pubkey1 = "02678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb6";
const pubkey2 = "03e7b6c4b5e8c9d3a1b2f4d6c8e0a2b4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8";
const pubkey3 = "02a1633cafcc01ebfb6d78e39f687a1f0995c62fc95f51ead10a02ee0be551b5dc";

// Create 2-of-3 multisig
const multisig = generateMultisigFromPublicKeys(
  Network.TESTNET,
  "P2WSH",          // Address type
  2,                // Required signatures
  pubkey1,
  pubkey2,
  pubkey3
);

// Get the address
const address = multisigAddress(multisig);
console.log("2-of-3 Multisig Address:");
console.log(address);

// Get the redeem script (important for spending!)
const redeemScript = multisigRedeemScript(multisig);
console.log("\\nRedeem Script (hex):");
console.log(redeemScript.toString('hex'));

console.log("\\n✓ Any 2 of these 3 keys can spend from this address!");`}
                imports={{ CaravanBitcoin }}
                height="450px"
            />

            <Callout type="info" title="Key Ordering">
                <p>
                    Caravan automatically sorts public keys lexicographically (BIP67 standard).
                    This ensures all participants generate the same address regardless of the order
                    they input the keys.
                </p>
            </Callout>

            <h2>Understanding the Multisig Script</h2>

            <p>
                Under the hood, multisig uses Bitcoin's scripting language:
            </p>

            <div className="not-prose my-8">
                <Card className="bg-bg-secondary">
                    <CardHeader>
                        <CardTitle>2-of-3 Multisig Script</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-bg-tertiary rounded font-mono text-sm">
                            <div className="text-primary mb-2">Script Structure:</div>
                            <div className="text-text-secondary space-y-1">
                                <div><span className="text-pkg-multisig">OP_2</span> <span className="text-text-muted">// Require 2 signatures</span></div>
                                <div><span className="text-pkg-wallets">&lt;pubkey1&gt;</span></div>
                                <div><span className="text-pkg-wallets">&lt;pubkey2&gt;</span></div>
                                <div><span className="text-pkg-wallets">&lt;pubkey3&gt;</span></div>
                                <div><span className="text-pkg-multisig">OP_3</span> <span className="text-text-muted">// Total of 3 keys</span></div>
                                <div><span className="text-primary">OP_CHECKMULTISIG</span> <span className="text-text-muted">// Verify signatures</span></div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-3 text-xs">
                            <div className="p-3 bg-pkg-multisig/10 rounded border border-pkg-multisig/30">
                                <div className="font-semibold text-pkg-multisig mb-1">OP_2</div>
                                <div className="text-text-secondary">M value - required signatures</div>
                            </div>
                            <div className="p-3 bg-pkg-wallets/10 rounded border border-pkg-wallets/30">
                                <div className="font-semibold text-pkg-wallets mb-1">Public Keys</div>
                                <div className="text-text-secondary">N keys in sorted order</div>
                            </div>
                            <div className="p-3 bg-primary/10 rounded border border-primary/30">
                                <div className="font-semibold text-primary mb-1">OP_CHECKMULTISIG</div>
                                <div className="text-text-secondary">Validates M of N signatures</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <h2>Address Types for Multisig</h2>

            <CodePlayground
                title="Comparing Multisig Address Types"
                initialCode={`const { 
  Network,
  generateMultisigFromPublicKeys,
  multisigAddress
} = CaravanBitcoin;

const pubkeys = [
  "02678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb6",
  "03e7b6c4b5e8c9d3a1b2f4d6c8e0a2b4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8"
];

const types = ["P2SH", "P2SH-P2WSH", "P2WSH"];

console.log("2-of-2 Multisig Addresses:\\n");

types.forEach(type => {
  const multisig = generateMultisigFromPublicKeys(
    Network.TESTNET,
    type,
    2,
    ...pubkeys
  );
  
  const address = multisigAddress(multisig);
  
  console.log(\`=== \${type} ===\`);
  console.log(\`Address: \${address}\`);
  console.log(\`Length: \${address.length} characters\`);
  console.log(\`Starts with: \${address.substring(0, 4)}\`);
  
  if (type === "P2WSH") {
    console.log("✓ Recommended - lowest fees");
  } else if (type === "P2SH") {
    console.log("• Legacy - highest fees");
  } else {
    console.log("• Wrapped SegWit - medium fees");
  }
  console.log('');
});`}
                imports={{ CaravanBitcoin }}
                height="450px"
            />

            <h2>Multisig Configuration Examples</h2>

            <div className="not-prose my-8 grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">2-of-3 (Most Common)</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3">
                        <div className="text-text-secondary">
                            <strong className="text-primary">Perfect for:</strong>
                            <ul className="mt-2 space-y-1 text-xs">
                                <li>• Personal backup (1 key you, 1 family, 1 vault)</li>
                                <li>• Small business (2 partners approve)</li>
                                <li>• Good balance of security & usability</li>
                            </ul>
                        </div>
                        <div className="p-3 bg-primary/10 rounded">
                            <div className="text-xs font-mono text-primary">
                                Required: 2 signatures<br />
                                Total: 3 keys<br />
                                Can lose: 1 key safely
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">3-of-5 (Enterprise)</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3">
                        <div className="text-text-secondary">
                            <strong className="text-pkg-multisig">Perfect for:</strong>
                            <ul className="mt-2 space-y-1 text-xs">
                                <li>• Organizations with multiple executives</li>
                                <li>• High security requirements</li>
                                <li>• Can tolerate 2 key losses</li>
                            </ul>
                        </div>
                        <div className="p-3 bg-pkg-multisig/10 rounded">
                            <div className="text-xs font-mono text-pkg-multisig">
                                Required: 3 signatures<br />
                                Total: 5 keys<br />
                                Can lose: 2 keys safely
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">2-of-2 (Joint Account)</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3">
                        <div className="text-text-secondary">
                            <strong className="text-pkg-wallets">Perfect for:</strong>
                            <ul className="mt-2 space-y-1 text-xs">
                                <li>• Joint accounts requiring both parties</li>
                                <li>• Escrow services</li>
                                <li>• Maximum security (both must agree)</li>
                            </ul>
                        </div>
                        <div className="p-3 bg-pkg-wallets/10 rounded">
                            <div className="text-xs font-mono text-pkg-wallets">
                                Required: 2 signatures<br />
                                Total: 2 keys<br />
                                Can lose: 0 keys (no backup!)
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">4-of-7 (Maximum Security)</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-3">
                        <div className="text-text-secondary">
                            <strong className="text-pkg-clients">Perfect for:</strong>
                            <ul className="mt-2 space-y-1 text-xs">
                                <li>• Very large organizations</li>
                                <li>• Extremely high value storage</li>
                                <li>• Maximum redundancy</li>
                            </ul>
                        </div>
                        <div className="p-3 bg-pkg-clients/10 rounded">
                            <div className="text-xs font-mono text-pkg-clients">
                                Required: 4 signatures<br />
                                Total: 7 keys<br />
                                Can lose: 3 keys safely
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <h2>Redeem Scripts and Witness Scripts</h2>

            <p>
                When you create a multisig address, Caravan generates scripts that define the spending conditions:
            </p>

            <CodePlayground
                title="Understanding Multisig Scripts"
                initialCode={`const { 
  Network,
  generateMultisigFromPublicKeys,
  multisigAddress,
  multisigRedeemScript,
  multisigWitnessScript
} = CaravanBitcoin;

const pubkeys = [
  "02678afdb0fe5548271967f1a67130b7105cd6a828e03909a67962e0ea1f61deb6",
  "03e7b6c4b5e8c9d3a1b2f4d6c8e0a2b4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8"
];

// P2WSH multisig
const multisig = generateMultisigFromPublicKeys(
  Network.TESTNET,
  "P2WSH",
  2,
  ...pubkeys
);

console.log("Multisig Scripts:\\n");

console.log("Address:");
console.log(multisigAddress(multisig));
console.log('');

console.log("Redeem Script (hex):");
const redeemScript = multisigRedeemScript(multisig);
console.log(redeemScript.toString('hex'));
console.log('');

console.log("Witness Script (hex):");
const witnessScript = multisigWitnessScript(multisig);
console.log(witnessScript.toString('hex'));
console.log('');

console.log("Important Notes:");
console.log("• Redeem script defines spending conditions");
console.log("• Must provide this when spending");
console.log("• Backup this with your wallet config!");
console.log("• Witness script used for SegWit addresses");`}
                imports={{ CaravanBitcoin }}
                height="480px"
            />

            <Callout type="danger" title="Save Your Scripts!">
                <p>
                    <strong>Critical:</strong> The redeem/witness script is required to spend from your multisig address!
                </p>
                <ul>
                    <li>• Save it with your wallet configuration</li>
                    <li>• Without it, you cannot create spending transactions</li>
                    <li>• Even with all private keys, you need the script</li>
                    <li>• Caravan's Braid automatically manages this for you</li>
                </ul>
            </Callout>

            <h2>Best Practices</h2>

            <div className="not-prose my-6 space-y-4">
                <Card className="border-green-500/30">
                    <CardHeader>
                        <CardTitle className="text-lg">✅ Do's</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-text-secondary space-y-2">
                        <ul className="space-y-2">
                            <li>• Use P2WSH for lowest fees</li>
                            <li>• Save the redeem/witness script</li>
                            <li>• Verify all participants generate the same address</li>
                            <li>• Test with small amounts first</li>
                            <li>• Document your M-of-N configuration</li>
                            <li>• Use standard BIP67 key ordering (automatic in Caravan)</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-red-500/30">
                    <CardHeader>
                        <CardTitle className="text-lg">❌ Don'ts</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-text-secondary space-y-2">
                        <ul className="space-y-2">
                            <li>• Don't use more than 15 keys (Bitcoin limit)</li>
                            <li>• Don't lose the redeem script</li>
                            <li>• Don't use uncompressed public keys (waste space)</li>
                            <li>• Don't manually sort keys (let Caravan handle it)</li>
                            <li>• Don't skip verification step</li>
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
                                <span>Multisig combines multiple public keys into one address</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Requires M-of-N signatures to spend</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>P2WSH is best for multisig (lowest fees)</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Redeem script is critical - must be saved!</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>BIP67 ensures consistent key ordering</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>2-of-3 is the sweet spot for most users</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <PageNavigation />
        </div>
    );
}