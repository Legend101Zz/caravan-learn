/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
/* eslint-disable react/no-unescaped-entities */
'use client';

import { CodePlayground } from '@/components/interactive/code-playground';
import { Callout } from '@/components/content/callout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageNavigation } from '@/components/layout/page-navigation';
import { AddressValidatorTool } from '@/components/interactive/address-validator-tool';
import * as CaravanBitcoin from '@caravan/bitcoin';

export default function AddressesPage() {
    return (
        <div className="prose prose-invert max-w-none">
            <div className="not-prose mb-8">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                    @caravan/bitcoin
                </div>
                <h1 className="text-5xl font-bold mb-4">Addresses</h1>
                <p className="text-xl text-text-secondary">
                    Validate, decode, and understand Bitcoin addresses
                </p>
            </div>

            <h2>Interactive Address Validator</h2>

            <p>
                Try validating different Bitcoin addresses. Change the network and see how the same
                address format can be valid or invalid depending on the network!
            </p>

            {/* Interactive Tool */}
            <div className="not-prose">
                <AddressValidatorTool />
            </div>

            <h2>Understanding Bitcoin Addresses</h2>

            <p>
                A Bitcoin address is like an email address for Bitcoin - it's where someone can send you Bitcoin.
                But unlike email, Bitcoin addresses are derived from cryptographic public keys.
            </p>

            <div className="not-prose my-8">
                <Card className="bg-bg-secondary">
                    <CardContent className="pt-6">
                        <div className="text-center mb-6">
                            <div className="text-4xl mb-4">🔑 → 🔓 → 📫</div>
                            <h3 className="font-semibold text-lg mb-4">Address Generation Flow</h3>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                            <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                                <div className="font-semibold text-primary mb-2">1. Private Key</div>
                                <div className="text-text-secondary text-xs mb-2">256-bit random number</div>
                                <code className="text-xs text-text-muted break-all">
                                    E9873D79C6D87DC0FB6A5778633389F4...
                                </code>
                            </div>
                            <div className="p-4 bg-pkg-psbt/10 rounded-lg border border-pkg-psbt/30">
                                <div className="font-semibold text-pkg-psbt mb-2">2. Public Key</div>
                                <div className="text-text-secondary text-xs mb-2">Derived via ECDSA</div>
                                <code className="text-xs text-text-muted break-all">
                                    04678afdb0fe5548271967f1a67130b7105cd6a...
                                </code>
                            </div>
                            <div className="p-4 bg-pkg-wallets/10 rounded-lg border border-pkg-wallets/30">
                                <div className="font-semibold text-pkg-wallets mb-2">3. Address</div>
                                <div className="text-text-secondary text-xs mb-2">Hash + encoding</div>
                                <code className="text-xs text-text-muted break-all">
                                    bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq
                                </code>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <h2>Address Types Deep Dive</h2>

            <CodePlayground
                title="Analyzing Different Address Types"
                initialCode={`const { validateAddress, Network } = CaravanBitcoin;

const addresses = [
  {
    type: "P2PKH (Legacy)",
    address: "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
    description: "Original Bitcoin address format"
  },
  {
    type: "P2SH (Script Hash)",
    address: "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy",
    description: "Can contain scripts (like multisig)"
  },
  {
    type: "P2WPKH (Native SegWit)",
    address: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
    description: "Lower fees, 42 characters"
  },
  {
    type: "P2WSH (SegWit Script)",
    address: "bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3",
    description: "For multisig, 62 characters"
  }
];

console.log("Bitcoin Address Types:\\n");

addresses.forEach(({ type, address, description }) => {
  const error = validateAddress(address, Network.MAINNET);
  
  console.log(\`=== \${type} ===\`);
  console.log(\`Address: \${address}\`);
  console.log(\`Length: \${address.length} chars\`);
  console.log(\`Valid: \${error ? '❌' : '✅'}\`);
  console.log(\`Info: \${description}\`);
  console.log('');
});`}
                imports={{ CaravanBitcoin }}
                height="450px"
            />

            <h2>Why So Many Address Types?</h2>

            <p>
                Bitcoin has evolved over time. Each new address type brings improvements:
            </p>

            <div className="not-prose my-6 grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Evolution Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="flex gap-3">
                            <div className="w-16 text-primary font-semibold">2009</div>
                            <div>
                                <div className="font-semibold mb-1">P2PKH (Legacy)</div>
                                <div className="text-text-secondary text-xs">Original Bitcoin addresses</div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-16 text-primary font-semibold">2012</div>
                            <div>
                                <div className="font-semibold mb-1">P2SH</div>
                                <div className="text-text-secondary text-xs">Enabled multisig & complex scripts</div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-16 text-primary font-semibold">2017</div>
                            <div>
                                <div className="font-semibold mb-1">SegWit (P2WPKH/P2WSH)</div>
                                <div className="text-text-secondary text-xs">Lower fees, better scalability</div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="w-16 text-primary font-semibold">2021</div>
                            <div>
                                <div className="font-semibold mb-1">Taproot (P2TR)</div>
                                <div className="text-text-secondary text-xs">Privacy & smart contracts</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Feature Comparison</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                        <table className="w-full">
                            <thead className="text-xs text-text-muted">
                                <tr>
                                    <th className="text-left pb-2">Type</th>
                                    <th className="text-center pb-2">Fees</th>
                                    <th className="text-center pb-2">Privacy</th>
                                </tr>
                            </thead>
                            <tbody className="text-text-secondary">
                                <tr className="border-t border-border">
                                    <td className="py-2">P2PKH</td>
                                    <td className="text-center">⭐</td>
                                    <td className="text-center">⭐⭐</td>
                                </tr>
                                <tr className="border-t border-border">
                                    <td className="py-2">P2SH</td>
                                    <td className="text-center">⭐⭐</td>
                                    <td className="text-center">⭐⭐⭐</td>
                                </tr>
                                <tr className="border-t border-border">
                                    <td className="py-2">P2WPKH</td>
                                    <td className="text-center">⭐⭐⭐⭐</td>
                                    <td className="text-center">⭐⭐</td>
                                </tr>
                                <tr className="border-t border-border">
                                    <td className="py-2">P2WSH</td>
                                    <td className="text-center">⭐⭐⭐⭐⭐</td>
                                    <td className="text-center">⭐⭐⭐</td>
                                </tr>
                                <tr className="border-t border-border">
                                    <td className="py-2">P2TR</td>
                                    <td className="text-center">⭐⭐⭐⭐⭐</td>
                                    <td className="text-center">⭐⭐⭐⭐⭐</td>
                                </tr>
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>

            <Callout type="tip" title="Which to Use for Multisig?">
                <p>
                    For multisig wallets, <strong>P2WSH (Native SegWit)</strong> is the best choice:
                </p>
                <ul>
                    <li>• Lowest transaction fees</li>
                    <li>• Native SegWit benefits</li>
                    <li>• Widely supported</li>
                    <li>• Future-proof</li>
                    <li>• This is what Caravan uses by default</li>
                </ul>
            </Callout>

            <h2>Validation Functions</h2>

            <p>
                Caravan provides robust address validation that checks format, checksum, and network compatibility:
            </p>

            <CodePlayground
                title="Address Validation in Detail"
                initialCode={`const { validateAddress, Network } = CaravanBitcoin;

// Function to safely validate and get details
function analyzeAddress(address, network) {
  const error = validateAddress(address, network);
  
  return {
    address,
    network: network === Network.MAINNET ? 'Mainnet' : 'Testnet',
    valid: !error,
    error: error || null,
    length: address.length,
    prefix: address.substring(0, 4)
  };
}

// Test various addresses
const tests = [
  { addr: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq", net: Network.MAINNET },
  { addr: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq", net: Network.TESTNET },
  { addr: "invalid_address_format", net: Network.MAINNET },
  { addr: "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2", net: Network.MAINNET },
];

console.log("Address Validation Results:\\n");

tests.forEach(({ addr, net }, i) => {
  const result = analyzeAddress(addr, net);
  
  console.log(\`Test \${i + 1}:\`);
  console.log(\`  Address: \${result.address.substring(0, 30)}...\`);
  console.log(\`  Network: \${result.network}\`);
  console.log(\`  Valid: \${result.valid ? '✅' : '❌'}\`);
  if (result.error) {
    console.log(\`  Error: \${result.error}\`);
  }
  console.log('');
});`}
                imports={{ CaravanBitcoin }}
                height="480px"
            />

            <h2>Common Validation Errors</h2>

            <CodePlayground
                title="Understanding Validation Errors"
                initialCode={`const { validateAddress, Network } = CaravanBitcoin;

const invalidAddresses = {
  "Too short": "bc1q",
  "Invalid characters": "bc1q@#$%",
  "Wrong checksum": "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdX",
  "Wrong network": "tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx", // testnet on mainnet
  "Typo in address": "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mda",
};

console.log("Common Address Errors:\\n");

for (const [errorType, address] of Object.entries(invalidAddresses)) {
  const error = validateAddress(address, Network.MAINNET);
  
  console.log(\`❌ \${errorType}\`);
  console.log(\`   Address: \${address}\`);
  console.log(\`   Error: \${error}\`);
  console.log('');
}

console.log("💡 Always validate addresses before use!");`}
                imports={{ CaravanBitcoin }}
                height="420px"
            />

            <Callout type="danger" title="Why Validation Matters">
                <p>
                    <strong>Invalid addresses mean lost Bitcoin!</strong> The Bitcoin network has no "undo" button.
                    If you send to an invalid or wrong address:
                </p>
                <ul>
                    <li>• The funds may be lost forever</li>
                    <li>• No one can retrieve them</li>
                    <li>• There's no customer support to call</li>
                    <li>• <strong>Always validate before sending!</strong></li>
                </ul>
            </Callout>

            <h2>Key Takeaways</h2>

            <div className="not-prose my-6">
                <Card className="bg-primary/5 border-primary/30">
                    <CardContent className="pt-6">
                        <ul className="space-y-3 text-text-secondary">
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Always validate addresses before using them</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Different address types have different characteristics</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>P2WSH is best for multisig (lowest fees)</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Network matters - validate against correct network</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Use <code>validateAddress()</code> to prevent mistakes</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <PageNavigation />
        </div>
    );
}