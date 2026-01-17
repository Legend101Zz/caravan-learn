'use client';

import { useState } from 'react';
import { CodePlayground } from '@/components/interactive/code-playground';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import * as CaravanBitcoin from '@caravan/bitcoin';
import * as CaravanPSBT from '@caravan/psbt';
import * as CaravanMultisig from '@caravan/multisig';

const examples = [
    {
        name: 'Address Validation',
        code: `const { validateAddress, Network } = CaravanBitcoin;

const address = 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq';
const error = validateAddress(address, Network.MAINNET);

console.log(error || '✅ Valid address!');`,
    },
    {
        name: 'Network Info',
        code: `const { Network, networkData } = CaravanBitcoin;

const mainnet = networkData(Network.MAINNET);
const testnet = networkData(Network.TESTNET);

console.log('Mainnet:', mainnet);
console.log('\\nTestnet:', testnet);`,
    },
    {
        name: 'Multiple Addresses',
        code: `const { validateAddress, Network } = CaravanBitcoin;

const addresses = [
  'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
  '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
];

addresses.forEach(addr => {
  const error = validateAddress(addr, Network.MAINNET);
  console.log(error || \`✅ \${addr}\`);
});`,
    },
];

export default function PlaygroundPage() {
    const [selectedExample, setSelectedExample] = useState(0);

    return (
        <div className="min-h-screen bg-bg-primary py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <Link href="/" className="text-primary hover:text-primary-light mb-4 inline-block">
                        ← Back to Home
                    </Link>
                    <h1 className="text-5xl font-bold mb-4">Code Playground</h1>
                    <p className="text-xl text-text-secondary">
                        Experiment with Caravan packages in your browser
                    </p>
                </div>

                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Sidebar with examples */}
                    <div className="lg:col-span-1">
                        <Card className="p-4">
                            <h3 className="font-semibold mb-4">Examples</h3>
                            <div className="space-y-2">
                                {examples.map((example, index) => (
                                    <Button
                                        key={index}
                                        variant={selectedExample === index ? 'default' : 'ghost'}
                                        className="w-full justify-start"
                                        size="sm"
                                        onClick={() => setSelectedExample(index)}
                                    >
                                        {example.name}
                                    </Button>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Main playground area */}
                    <div className="lg:col-span-3">
                        <CodePlayground
                            key={selectedExample}
                            title={examples[selectedExample].name}
                            initialCode={examples[selectedExample].code}
                            imports={{
                                CaravanBitcoin,
                                CaravanPSBT,
                                CaravanMultisig,
                            }}
                            height="500px"
                        />

                        <Card className="mt-6 p-6">
                            <h3 className="text-lg font-semibold mb-4">Available Imports</h3>
                            <div className="grid md:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <div className="text-primary font-mono mb-2">CaravanBitcoin</div>
                                    <div className="text-text-secondary">@caravan/bitcoin</div>
                                </div>
                                <div>
                                    <div className="text-pkg-psbt font-mono mb-2">CaravanPSBT</div>
                                    <div className="text-text-secondary">@caravan/psbt</div>
                                </div>
                                <div>
                                    <div className="text-pkg-multisig font-mono mb-2">CaravanMultisig</div>
                                    <div className="text-text-secondary">@caravan/multisig</div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}