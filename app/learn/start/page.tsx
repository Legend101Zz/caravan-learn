'use client';

import { CodePlayground } from '@/components/interactive/code-playground';
import { Callout } from '@/components/content/callout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import * as CaravanBitcoin from '@caravan/bitcoin';

export default function StartPage() {
    return (
        <div className="min-h-screen bg-bg-primary py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <Link href="/" className="text-primary hover:text-primary-light mb-4 inline-block">
                        ← Back to Home
                    </Link>
                    <h1 className="text-5xl font-bold mb-4">Getting Started</h1>
                    <p className="text-xl text-text-secondary">
                        Welcome to Caravan Interactive! Let's start with your first Bitcoin address validation.
                    </p>
                </div>

                {/* Introduction */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-6">What You'll Learn</h2>

                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Bitcoin Fundamentals</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <Check className="text-primary" size={16} />
                                    <span>Keys and addresses</span>
                                </div>
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <Check className="text-primary" size={16} />
                                    <span>HD wallets</span>
                                </div>
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <Check className="text-primary" size={16} />
                                    <span>Transaction basics</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Caravan Packages</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <Check className="text-primary" size={16} />
                                    <span>@caravan/bitcoin</span>
                                </div>
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <Check className="text-primary" size={16} />
                                    <span>@caravan/psbt</span>
                                </div>
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <Check className="text-primary" size={16} />
                                    <span>@caravan/multisig</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Callout type="tip" title="Interactive Learning">
                        Every code example on this site is runnable! Click the "Run" button to execute
                        the code and see the results. Feel free to modify the code and experiment.
                    </Callout>
                </section>

                {/* First Example */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">Your First Example</h2>
                    <p className="text-text-secondary mb-6">
                        Let's start with something simple: validating a Bitcoin address.
                        Try running this code, then modify the address and run it again!
                    </p>

                    <CodePlayground
                        title="Address Validation Example"
                        initialCode={`// Import validation function from Caravan
const { validateAddress, Network } = CaravanBitcoin;

// A valid Bitcoin mainnet address
const address = 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq';

// Validate the address
const error = validateAddress(address, Network.MAINNET);

if (error) {
  console.log('❌ Invalid address:', error);
} else {
  console.log('✅ Valid Bitcoin address!');
  console.log('Address:', address);
  console.log('Type: Native SegWit (bc1q...)');
}`}
                        imports={{ CaravanBitcoin }}
                        height="320px"
                    />

                    <Callout type="info" title="What's happening here?">
                        <p className="mb-2">
                            We're using the <code>validateAddress</code> function from <code>@caravan/bitcoin</code>
                            to check if an address is valid for Bitcoin mainnet.
                        </p>
                        <p>
                            The function returns an empty string if valid, or an error message if invalid.
                        </p>
                    </Callout>
                </section>

                {/* Try Different Addresses */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-4">Try Different Address Types</h2>
                    <p className="text-text-secondary mb-6">
                        Bitcoin has several address formats. Let's validate different types:
                    </p>

                    <CodePlayground
                        title="Validating Different Address Types"
                        initialCode={`const { validateAddress, Network } = CaravanBitcoin;

const addresses = {
  'Native SegWit (P2WPKH)': 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  'Legacy (P2PKH)': '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
  'Script Hash (P2SH)': '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
  'Invalid Address': 'this_is_not_valid',
};

console.log('Validating different address types:\\n');

for (const [type, address] of Object.entries(addresses)) {
  const error = validateAddress(address, Network.MAINNET);
  
  if (error) {
    console.log(\`❌ \${type}\`);
    console.log(\`   \${error}\\n\`);
  } else {
    console.log(\`✅ \${type}\`);
    console.log(\`   \${address}\\n\`);
  }
}`}
                        imports={{ CaravanBitcoin }}
                        height="380px"
                    />
                </section>

                {/* What's Next */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-6">What's Next?</h2>

                    <div className="space-y-4">
                        <Card className="hover:border-primary/50 transition-all">
                            <CardHeader>
                                <CardTitle>Bitcoin Basics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-text-secondary mb-4">
                                    Learn about keys, addresses, and how Bitcoin transactions work
                                </p>
                                <Button asChild>
                                    <Link href="/learn/basics">
                                        Continue Learning
                                        <ArrowRight size={16} />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:border-primary/50 transition-all">
                            <CardHeader>
                                <CardTitle>Try the Playground</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-text-secondary mb-4">
                                    Experiment with Caravan packages in a free-form code editor
                                </p>
                                <Button variant="outline" asChild>
                                    <Link href="/playground">
                                        Open Playground
                                        <ArrowRight size={16} />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <Callout type="tip" title="Learning Tips">
                    <ul className="space-y-2">
                        <li>• Don't just read - run every example and experiment with the code</li>
                        <li>• Try breaking things! Error messages are great teachers</li>
                        <li>• Use the console output to understand what's happening</li>
                        <li>• Take your time - Bitcoin development has a learning curve</li>
                    </ul>
                </Callout>
            </div>
        </div>
    );
}