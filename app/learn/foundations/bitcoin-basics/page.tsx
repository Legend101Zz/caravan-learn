'use client';

import { CodePlayground } from '@/components/interactive/code-playground';
import { Callout } from '@/components/content/callout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageNavigation } from '@/components/layout/page-navigation';
import * as CaravanBitcoin from '@caravan/bitcoin';

export default function BitcoinBasicsPage() {
    return (
        <div className="prose prose-invert max-w-none">
            <h1>Chapter 1: Bitcoin Basics</h1>

            <p className="lead text-xl text-text-secondary">
                Before diving into multisig, let's understand Bitcoin's fundamental concepts.
                Don't worry - we'll keep it practical and focused on what you need to build wallets.
            </p>

            <h2>The UTXO Model</h2>

            <p>
                Bitcoin uses a <strong>UTXO (Unspent Transaction Output)</strong> model. Think of UTXOs
                like cash bills in your wallet:
            </p>

            <div className="not-prose my-6">
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold mb-2 text-primary">🏦 Bank Account Model</h4>
                                <p className="text-sm text-text-secondary">
                                    Your account has a balance. When you spend, the balance decreases.
                                    When you receive, it increases.
                                </p>
                                <div className="mt-4 p-3 bg-bg-tertiary rounded text-sm font-mono">
                                    Balance: $1,000<br />
                                    Send $300 → Balance: $700
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2 text-primary">₿ Bitcoin UTXO Model</h4>
                                <p className="text-sm text-text-secondary">
                                    You have individual "bills" (UTXOs). When you spend, you consume entire
                                    UTXOs and create new ones.
                                </p>
                                <div className="mt-4 p-3 bg-bg-tertiary rounded text-sm font-mono">
                                    UTXOs: [1 BTC, 0.5 BTC]<br />
                                    Send 0.7 → Consume both, create<br />
                                    0.7 BTC (recipient) + 0.8 BTC (change)
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Callout type="info" title="Key Concept">
                <p>
                    In Bitcoin, you don't have a "balance." You have a collection of UTXOs that you can spend.
                    Your wallet's balance is simply the sum of all your UTXOs.
                </p>
            </Callout>

            <h2>Bitcoin Networks</h2>

            <p>
                Bitcoin has multiple networks. The most important for development are:
            </p>

            <CodePlayground
                title="Understanding Bitcoin Networks"
                initialCode={`const { Network, networkData } = CaravanBitcoin;

// Get network information
const mainnet = networkData(Network.MAINNET);
const testnet = networkData(Network.TESTNET);
const regtest = networkData(Network.REGTEST);

console.log('=== MAINNET ===');
console.log('Name:', mainnet.label);
console.log('Used for:', 'Real Bitcoin with real value');
console.log('Address prefix:', mainnet.bip32.public);
console.log('');

console.log('=== TESTNET ===');
console.log('Name:', testnet.label);
console.log('Used for:', 'Testing without risk');
console.log('Address prefix:', testnet.bip32.public);
console.log('Coins have no value ✓');
console.log('');

console.log('=== REGTEST ===');
console.log('Name:', regtest.label);
console.log('Used for:', 'Local development');
console.log('You control the blockchain');`}
                imports={{ CaravanBitcoin }}
                height="400px"
            />

            <Callout type="warning" title="Important">
                <p>
                    <strong>Always use TESTNET when learning!</strong> Testnet coins have no value,
                    so mistakes won't cost you real money. We'll use testnet throughout this tutorial.
                </p>
            </Callout>

            <h2>Address Types</h2>

            <p>
                Bitcoin has evolved over time, introducing new address formats. Each format has
                different characteristics:
            </p>

            <div className="not-prose my-6 grid md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Legacy (P2PKH)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <code className="text-sm text-primary">1A1zP1e...</code>
                        <p className="text-sm text-text-secondary">
                            • Original Bitcoin addresses<br />
                            • Starts with "1"<br />
                            • Higher transaction fees<br />
                            • Maximum compatibility
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Script Hash (P2SH)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <code className="text-sm text-primary">3J98t1W...</code>
                        <p className="text-sm text-text-secondary">
                            • Starts with "3"<br />
                            • Used for multisig<br />
                            • Medium fees<br />
                            • Good compatibility
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Native SegWit (P2WPKH)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <code className="text-sm text-primary">bc1qar0s...</code>
                        <p className="text-sm text-text-secondary">
                            • Starts with "bc1q"<br />
                            • Lower fees (SegWit)<br />
                            • 42 characters<br />
                            • Single-signature
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-primary/50">
                    <CardHeader>
                        <CardTitle className="text-base">Native SegWit Script (P2WSH) ⭐</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <code className="text-sm text-primary">bc1qrp33...</code>
                        <p className="text-sm text-text-secondary">
                            • Starts with "bc1q"<br />
                            • Lowest fees for multisig<br />
                            • 62 characters<br />
                            • <strong>Recommended for Caravan</strong>
                        </p>
                    </CardContent>
                </Card>
            </div>

            <h2>Try It: Validate Different Addresses</h2>

            <CodePlayground
                title="Address Validation"
                initialCode={`const { validateAddress, Network } = CaravanBitcoin;

const addresses = {
  'Legacy P2PKH': '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
  'P2SH': '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
  'Native SegWit': 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  'Invalid': 'not_a_real_address',
};

console.log('Testing Bitcoin Addresses:\\n');

for (const [type, address] of Object.entries(addresses)) {
  const error = validateAddress(address, Network.MAINNET);
  
  if (error) {
    console.log(\`❌ \${type}\`);
    console.log(\`   Error: \${error}\`);
  } else {
    console.log(\`✅ \${type}\`);
    console.log(\`   \${address}\`);
  }
  console.log('');
}`}
                imports={{ CaravanBitcoin }}
                height="350px"
            />

            <h2>Transactions</h2>

            <p>
                A Bitcoin transaction is simple in concept:
            </p>

            <div className="not-prose my-6 p-6 bg-bg-secondary rounded-lg border border-border">
                <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="text-3xl mb-2">📥</div>
                        <h4 className="font-semibold mb-2">Inputs</h4>
                        <p className="text-sm text-text-secondary">
                            UTXOs you're spending<br />
                            (Must be signed)
                        </p>
                    </div>
                    <div>
                        <div className="text-3xl mb-2">⚙️</div>
                        <h4 className="font-semibold mb-2">Transaction</h4>
                        <p className="text-sm text-text-secondary">
                            Consumes inputs,<br />
                            creates outputs
                        </p>
                    </div>
                    <div>
                        <div className="text-3xl mb-2">📤</div>
                        <h4 className="font-semibold mb-2">Outputs</h4>
                        <p className="text-sm text-text-secondary">
                            New UTXOs<br />
                            (Payment + Change)
                        </p>
                    </div>
                </div>
            </div>

            <Callout type="tip" title="Transaction Anatomy">
                <p>Every transaction has:</p>
                <ul>
                    <li><strong>Inputs:</strong> References to UTXOs you're spending (with signatures)</li>
                    <li><strong>Outputs:</strong> New UTXOs being created (recipient + your change)</li>
                    <li><strong>Fee:</strong> Inputs minus outputs (goes to miners)</li>
                </ul>
            </Callout>

            <h2>Key Takeaways</h2>

            <div className="not-prose my-6">
                <Card className="bg-primary/5 border-primary/30">
                    <CardContent className="pt-6">
                        <ul className="space-y-3 text-text-secondary">
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Bitcoin uses UTXOs, not account balances</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Always test on TESTNET when learning</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>P2WSH (Native SegWit) is best for multisig</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-primary text-xl">✓</span>
                                <span>Transactions consume UTXOs and create new ones</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>

            <h2>What's Next?</h2>

            <p>
                Now that you understand Bitcoin basics, let's dive into <strong>keys and addresses</strong> -
                the foundation of Bitcoin security and multisig wallets.
            </p>

            <PageNavigation />
        </div>
    );
}