/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
/* eslint-disable react/no-unescaped-entities */
'use client';

import { CodePlayground } from '@/components/interactive/code-playground';
import { Callout } from '@/components/content/callout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageNavigation } from '@/components/layout/page-navigation';
import * as CaravanBitcoin from '@caravan/bitcoin';

export default function MultisigBasicsPage() {
    return (
        <div className="prose prose-invert max-w-none">
            <h1>Chapter 4: Multisig Basics</h1>

            <p className="lead text-xl text-text-secondary">
                Multisignature (multisig) is Bitcoin's built-in way to require multiple signatures to spend funds.
                It's like needing multiple keys to open a safe - no single person has complete control.
            </p>

            <h2>What is Multisig?</h2>

            <p>
                A multisig wallet requires <strong>M signatures out of N total keys</strong> to spend Bitcoin.
                This is written as <strong>M-of-N</strong>.
            </p>

            <div className="not-prose my-8 grid md:grid-cols-3 gap-6">
                <Card className="border-primary/30">
                    <CardHeader>
                        <CardTitle className="text-lg text-center">2-of-3 Multisig</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center mb-4">
                            <div className="text-4xl mb-2">🔐🔐🔑</div>
                            <p className="text-sm text-text-secondary">
                                Any 2 out of 3 keys can spend
                            </p>
                        </div>
                        <div className="text-xs text-text-secondary space-y-2">
                            <p><strong>Use case:</strong> Personal backup</p>
                            <p>• Keep one key yourself</p>
                            <p>• Give one to trusted family</p>
                            <p>• Store one in safe deposit box</p>
                            <p>• Lose one key? Still secure!</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-pkg-wallets/30">
                    <CardHeader>
                        <CardTitle className="text-lg text-center">2-of-2 Multisig</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center mb-4">
                            <div className="text-4xl mb-2">🔐🔐</div>
                            <p className="text-sm text-text-secondary">
                                Both keys required to spend
                            </p>
                        </div>
                        <div className="text-xs text-text-secondary space-y-2">
                            <p><strong>Use case:</strong> Joint accounts</p>
                            <p>• Both parties must agree</p>
                            <p>• Perfect for partnerships</p>
                            <p>• Business escrow</p>
                            <p>• Maximum security</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-pkg-psbt/30">
                    <CardHeader>
                        <CardTitle className="text-lg text-center">3-of-5 Multisig</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center mb-4">
                            <div className="text-4xl mb-2">🔐🔐🔐🔑🔑</div>
                            <p className="text-sm text-text-secondary">
                                Any 3 out of 5 keys can spend
                            </p>
                        </div>
                        <div className="text-xs text-text-secondary space-y-2">
                            <p><strong>Use case:</strong> Organizations</p>
                            <p>• Distributed among executives</p>
                            <p>• Redundancy + security</p>
                            <p>• Can lose 2 keys safely</p>
                            <p>• No single point of failure</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <h2>Why Use Multisig?</h2>

            <div className="not-prose my-6 grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">🛡️ Enhanced Security</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-text-secondary space-y-2">
                        <p><strong>No single point of failure:</strong></p>
                        <ul className="space-y-1">
                            <li>• Attacker needs multiple keys</li>
                            <li>• Physical security distributed</li>
                            <li>• Reduces theft risk</li>
                            <li>• Can't lose everything from one mistake</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">🔄 Redundancy</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-text-secondary space-y-2">
                        <p><strong>Key loss protection:</strong></p>
                        <ul className="space-y-1">
                            <li>• 2-of-3: Can lose 1 key safely</li>
                            <li>• 3-of-5: Can lose 2 keys safely</li>
                            <li>• Peace of mind</li>
                            <li>• No single backup point</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">👥 Shared Control</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-text-secondary space-y-2">
                        <p><strong>Collaboration enabled:</strong></p>
                        <ul className="space-y-1">
                            <li>• Business partnerships</li>
                            <li>• Family inheritance planning</li>
                            <li>• Trust arrangements</li>
                            <li>• Organizational treasuries</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">✅ Accountability</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-text-secondary space-y-2">
                        <p><strong>Transparent operations:</strong></p>
                        <ul className="space-y-1">
                            <li>• Multiple approvals required</li>
                            <li>• Prevents unauthorized spending</li>
                            <li>• Audit trails</li>
                            <li>• Checks and balances</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <h2>How Multisig Works: Under the Hood</h2>

            <p>
                Bitcoin has native support for multisig through its scripting language. Let's see how it works:
            </p>

            <div className="not-prose my-8">
                <Card className="bg-bg-secondary">
                    <CardHeader>
                        <CardTitle>Multisig Script (2-of-3 Example)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-bg-tertiary rounded font-mono text-sm">
                            <div className="text-primary mb-2">Locking Script (Output):</div>
                            <code className="text-text-secondary">
                                OP_2 &lt;pubkey1&gt; &lt;pubkey2&gt; &lt;pubkey3&gt; OP_3 OP_CHECKMULTISIG
                            </code>
                        </div>

                        <div className="grid md:grid-cols-3 gap-3 text-xs">
                            <div className="p-3 bg-primary/10 rounded">
                                <div className="font-semibold text-primary mb-1">OP_2</div>
                                <div className="text-text-secondary">Require 2 signatures (the M)</div>
                            </div>
                            <div className="p-3 bg-pkg-psbt/10 rounded">
                                <div className="font-semibold text-pkg-psbt mb-1">&lt;pubkeys&gt;</div>
                                <div className="text-text-secondary">The 3 public keys (the N)</div>
                            </div>
                            <div className="p-3 bg-pkg-wallets/10 rounded">
                                <div className="font-semibold text-pkg-wallets mb-1">OP_CHECKMULTISIG</div>
                                <div className="text-text-secondary">Verify M of N signatures</div>
                            </div>
                        </div>

                        <div className="p-4 bg-bg-tertiary rounded font-mono text-sm">
                            <div className="text-primary mb-2">Unlocking Script (Input):</div>
                            <code className="text-text-secondary">
                                OP_0 &lt;signature1&gt; &lt;signature2&gt;
                            </code>
                        </div>

                        <div className="text-sm text-text-secondary">
                            <p>When spending, provide 2 valid signatures from any 2 of the 3 keys. Bitcoin verifies them and allows the spend if valid.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Callout type="info" title="Bitcoin Script">
                <p>
                    Bitcoin uses a stack-based scripting language to define spending conditions.
                    Multisig is just one type of script - Bitcoin can support complex spending rules!
                </p>
            </Callout>

            <h2>P2SH vs P2WSH: Wrapping Multisig</h2>

            <p>
                Multisig scripts can be long and complex. Bitcoin uses two methods to make them more manageable:
            </p>

            <div className="not-prose my-8 grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">P2SH (Pay-to-Script-Hash)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="text-xs font-mono p-2 bg-bg-tertiary rounded">
                            3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy
                        </div>
                        <div className="text-sm text-text-secondary space-y-2">
                            <p><strong>How it works:</strong></p>
                            <ul className="space-y-1 text-xs">
                                <li>• Hash the multisig script</li>
                                <li>• Address is hash of script</li>
                                <li>• Reveal script when spending</li>
                                <li>• Legacy format (starts with 3)</li>
                                <li>• Good compatibility</li>
                                <li>• Medium fees</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-primary/50">
                    <CardHeader>
                        <CardTitle className="text-lg">P2WSH (Pay-to-Witness-Script-Hash) ⭐</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="text-xs font-mono p-2 bg-bg-tertiary rounded break-all">
                            bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3
                        </div>
                        <div className="text-sm text-text-secondary space-y-2">
                            <p><strong>How it works:</strong></p>
                            <ul className="space-y-1 text-xs">
                                <li>• SegWit version of P2SH</li>
                                <li>• Hash goes in witness data</li>
                                <li>• Native SegWit (starts with bc1q)</li>
                                <li>• Lower transaction fees</li>
                                <li>• Better for multisig</li>
                                <li>• <strong>Recommended for Caravan</strong></li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <h2>Try It: Multisig Address Types</h2>

            <CodePlayground
                title="Comparing Multisig Address Types"
                initialCode={`const { validateAddress, Network } = CaravanBitcoin;

// Example multisig addresses
const addresses = {
  "P2SH (Legacy Multisig)": "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy",
  "P2WSH (SegWit Multisig)": "bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3",
};

console.log("Multisig Address Comparison:\\n");

for (const [type, address] of Object.entries(addresses)) {
  console.log(\`=== \${type} ===\`);
  console.log(\`Address: \${address}\`);
  console.log(\`Length: \${address.length} characters\`);
  
  const error = validateAddress(address, Network.MAINNET);
  console.log(\`Valid: \${error ? '❌' : '✅'}\`);
  
  if (type.includes("P2SH")) {
    console.log("Prefix: 3");
    console.log("Format: Legacy");
    console.log("Fees: Medium");
  } else {
    console.log("Prefix: bc1q");
    console.log("Format: Native SegWit");
    console.log("Fees: Lower ⭐");
  }
  
  console.log('');
}`}
                imports={{ CaravanBitcoin }}
                height="400px"
            />

            <h2>Signing Workflow</h2>

            <p>
                The multisig signing process involves coordination between participants:
            </p>

            <div className="not-prose my-8 p-6 bg-bg-secondary rounded-lg border border-border">
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">1</div>
                        <div className="flex-1">
                            <div className="font-semibold mb-2">Create Unsigned Transaction (PSBT)</div>
                            <p className="text-sm text-text-secondary">
                                One participant creates a Partially Signed Bitcoin Transaction (PSBT)
                                specifying inputs and outputs.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">2</div>
                        <div className="flex-1">
                            <div className="font-semibold mb-2">Share PSBT with Signers</div>
                            <p className="text-sm text-text-secondary">
                                The PSBT is passed to other participants (via file, QR code, or hardware wallet).
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">3</div>
                        <div className="flex-1">
                            <div className="font-semibold mb-2">Each Signer Adds Their Signature</div>
                            <p className="text-sm text-text-secondary">
                                Participants sign with their private keys (usually on hardware wallets).
                                Each signature is added to the PSBT.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold flex-shrink-0">4</div>
                        <div className="flex-1">
                            <div className="font-semibold mb-2">Combine Signatures</div>
                            <p className="text-sm text-text-secondary">
                                Once M signatures are collected, combine them into the final PSBT.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center text-green-400 font-bold flex-shrink-0">5</div>
                        <div className="flex-1">
                            <div className="font-semibold mb-2">Finalize and Broadcast</div>
                            <p className="text-sm text-text-secondary">
                                Extract the final transaction from the PSBT and broadcast to the Bitcoin network.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Callout type="tip" title="PSBT - The Multisig Glue">
                <p>
                    <strong>Partially Signed Bitcoin Transactions (PSBT)</strong> are the standard way
                    to coordinate multisig signing. We'll dive deep into PSBTs in Part 2!
                </p>
            </Callout>

            <h2>Key Ordering: BIP67</h2>

            <p>
                When creating a multisig address, the order of public keys matters! Different orders
                create different addresses.
            </p>

            <div className="not-prose my-6">
                <Card className="bg-bg-secondary">
                    <CardContent className="pt-6 space-y-4">
                        <div className="text-center mb-4">
                            <div className="text-4xl mb-2">🔀</div>
                            <h3 className="font-semibold">The Key Ordering Problem</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="p-4 bg-red-950/20 border border-red-500/30 rounded">
                                <div className="font-semibold text-red-400 mb-2">❌ Without Standard Ordering</div>
                                <div className="text-text-secondary space-y-1 text-xs font-mono">
                                    <div>Alice: [A, B, C] → addr1</div>
                                    <div>Bob: [B, C, A] → addr2</div>
                                    <div>Carol: [C, A, B] → addr3</div>
                                    <div className="mt-2 text-red-400">Different addresses! 💥</div>
                                </div>
                            </div>

                            <div className="p-4 bg-green-950/20 border border-green-500/30 rounded">
                                <div className="font-semibold text-green-400 mb-2">✅ With BIP67 (Lexicographic Order)</div>
                                <div className="text-text-secondary space-y-1 text-xs font-mono">
                                    <div>Alice: [A, B, C] → addr1</div>
                                    <div>Bob: [A, B, C] → addr1</div>
                                    <div>Carol: [A, B, C] → addr1</div>
                                    <div className="mt-2 text-green-400">Same address! ✓</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-bg-tertiary rounded text-sm">
                            <p className="text-text-secondary">
                                <strong className="text-primary">BIP67</strong> solves this by sorting public keys
                                lexicographically (alphabetically). Caravan automatically handles this!
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <h2>Security Considerations</h2>

            <div className="not-prose my-6 space-y-4">
                <Card className="border-green-500/30">
                    <CardHeader>
                        <CardTitle className="text-lg">✅ Best Practices</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-text-secondary space-y-2">
                        <ul className="space-y-2">
                            <li>• <strong>Geographic distribution:</strong> Keep keys in different locations</li>
                            <li>• <strong>Hardware wallets:</strong> Use for all signing operations</li>
                            <li>• <strong>Test first:</strong> Always test on testnet before mainnet</li>
                            <li>• <strong>Document setup:</strong> Record configuration for recovery</li>
                            <li>• <strong>Verify addresses:</strong> All participants should verify</li>
                            <li>• <strong>Backup xpubs:</strong> Keep wallet config file safe</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-red-500/30">
                    <CardHeader>
                        <CardTitle className="text-lg">❌ Common Pitfalls</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-text-secondary space-y-2">
                        <ul className="space-y-2">
                            <li>• <strong>All keys in one place:</strong> Defeats the purpose!</li>
                            <li>• <strong>Not testing recovery:</strong> Can you restore the wallet?</li>
                            <li>• <strong>Losing quorum:</strong> Can't find M keys to spend</li>
                            <li>• <strong>Wrong derivation path:</strong> Incompatible with other wallets</li>
                            <li>• <strong>Not verifying:</strong> Send to wrong address</li>
                            <li>• <strong>Reusing addresses:</strong> Privacy and security issue</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <h2>Choosing Your M-of-N</h2>

            <p>
                How do you choose the right configuration? Consider these factors:
            </p>

            <div className="not-prose my-6">
                <Card className="bg-bg-secondary">
                    <CardContent className="pt-6">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left p-3 text-primary">Setup</th>
                                    <th className="text-left p-3 text-primary">Security</th>
                                    <th className="text-left p-3 text-primary">Redundancy</th>
                                    <th className="text-left p-3 text-primary">Best For</th>
                                </tr>
                            </thead>
                            <tbody className="text-text-secondary">
                                <tr className="border-b border-border">
                                    <td className="p-3 font-mono">2-of-2</td>
                                    <td className="p-3">⭐⭐⭐⭐⭐</td>
                                    <td className="p-3">⭐ (no backup)</td>
                                    <td className="p-3">Joint accounts, escrow</td>
                                </tr>
                                <tr className="border-b border-border">
                                    <td className="p-3 font-mono">2-of-3</td>
                                    <td className="p-3">⭐⭐⭐⭐</td>
                                    <td className="p-3">⭐⭐⭐⭐</td>
                                    <td className="p-3">Personal, small teams</td>
                                </tr>
                                <tr className="border-b border-border">
                                    <td className="p-3 font-mono">3-of-5</td>
                                    <td className="p-3">⭐⭐⭐⭐⭐</td>
                                    <td className="p-3">⭐⭐⭐⭐⭐</td>
                                    <td className="p-3">Organizations, large amounts</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-mono">4-of-7</td>
                                    <td className="p-3">⭐⭐⭐⭐⭐</td>
                                    <td className="p-3">⭐⭐⭐⭐⭐</td>
                                    <td className="p-3">Enterprise, maximum security</td>
                                </tr>
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>

            <Callout type="info" title="The Sweet Spot">
                <p>
                    For most users, <strong>2-of-3 multisig</strong> offers the best balance of security
                    and usability. It's secure (need 2 keys to steal), resilient (can lose 1 key), and
                    relatively simple to manage.
                </p>
            </Callout>

            <h2>Key Takeaways</h2>

            <div className="not-prose my-6">
                <Card className="bg-primary/5 border-primary/30">
                    <CardContent className="pt-6">
                        <ul className="space-y-3 text-text-secondary">
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Multisig requires M signatures from N total keys</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Provides security, redundancy, and shared control</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>P2WSH (Native SegWit) is best for multisig</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>PSBTs enable multisig signing coordination</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>BIP67 ensures consistent key ordering</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>2-of-3 is the sweet spot for most users</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Always use hardware wallets and geographic distribution</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <h2>What's Next?</h2>

            <p>
                Congratulations! 🎉 You've completed Part 1: Bitcoin Foundations. You now understand:
            </p>

            <ul>
                <li>Bitcoin's UTXO model and transaction basics</li>
                <li>Keys, addresses, and extended public keys</li>
                <li>HD wallets and derivation paths</li>
                <li>How multisig works and why it's important</li>
            </ul>

            <p>
                In <strong>Part 2</strong>, we'll dive deep into Caravan's packages and learn how to
                actually build multisig wallets with code. Get ready for hands-on development!
            </p>

            <PageNavigation />
        </div>
    );
}