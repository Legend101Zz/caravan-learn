export interface NavItem {
  title: string;
  href?: string;
  description?: string;
  badge?: string;
  children?: NavItem[];
}

export const navigation: NavItem[] = [
  {
    title: "Getting Started",
    children: [
      {
        title: "Introduction",
        href: "/learn/start",
        description: "Your first steps with Caravan",
      },
      {
        title: "Course Overview",
        href: "/learn/overview",
        description: "What you'll learn",
      },
    ],
  },
  {
    title: "Part 1: Bitcoin Foundations",
    children: [
      {
        title: "Chapter 1: Bitcoin Basics",
        href: "/learn/foundations/bitcoin-basics",
        description: "Understanding Bitcoin fundamentals",
      },
      {
        title: "Chapter 2: Keys & Addresses",
        href: "/learn/foundations/keys-addresses",
        description: "Private keys, public keys, and addresses",
      },
      {
        title: "Chapter 3: HD Wallets",
        href: "/learn/foundations/hd-wallets",
        description: "Hierarchical Deterministic wallets",
      },
      {
        title: "Chapter 4: Multisig Basics",
        href: "/learn/foundations/multisig",
        description: "Introduction to multisignature",
      },
    ],
  },
  {
    title: "Part 2: Caravan Packages",
    badge: "Core",
    children: [
      {
        title: "@caravan/bitcoin",
        href: "/learn/packages/bitcoin",
        description: "Core Bitcoin utilities",
        children: [
          { title: "Overview", href: "/learn/packages/bitcoin" },
          { title: "Addresses", href: "/learn/packages/bitcoin/addresses" },
          { title: "Keys", href: "/learn/packages/bitcoin/keys" },
          { title: "Multisig", href: "/learn/packages/bitcoin/multisig" },
          {
            title: "The Braid",
            href: "/learn/packages/bitcoin/braid",
          },
        ],
      },
      {
        title: "@caravan/psbt",
        href: "/learn/packages/psbt",
        description: "Partially Signed Bitcoin Transactions",
        children: [
          { title: "Overview", href: "/learn/packages/psbt" },
          { title: "BIP-174", href: "/learn/packages/psbt/bip174" },
          { title: "BIP-370", href: "/learn/packages/psbt/bip370" },
          {
            title: "Understanding PSBT",
            href: "/learn/packages/psbt/pipeline",
          },
          {
            title: "Create PSBT",
            href: "/learn/packages/psbt/builder",
          },
        ],
      },
      {
        title: "@caravan/transactions",
        href: "/learn/packages/transactions",
        description: "Fees Package",
      },
    ],
  },
  {
    title: "Part 3: Build Your Wallet",
    badge: "Hands-On",
    children: [
      {
        title: "Chapter 11: Planning",
        href: "/learn/building/planning",
        description: "Design your multisig setup",
      },
      {
        title: "Chapter 12: Collecting Keys",
        href: "/learn/building/keys",
        description: "Gather extended public keys",
      },
      {
        title: "Chapter 13: Creating Wallet",
        href: "/learn/building/wallet",
        description: "Build your first multisig wallet",
      },
      {
        title: "Chapter 14: Generating Addresses",
        href: "/learn/building/addresses",
        description: "Derive receive addresses",
      },
      {
        title: "Chapter 15: Building Transactions",
        href: "/learn/building/transactions",
        description: "Create and sign transactions",
      },
    ],
  },
];

export function flattenNavigation(items: NavItem[]): NavItem[] {
  const result: NavItem[] = [];

  function flatten(items: NavItem[]) {
    for (const item of items) {
      if (item.href) {
        result.push(item);
      }
      if (item.children) {
        flatten(item.children);
      }
    }
  }

  flatten(items);
  return result;
}

export function getNextPage(currentPath: string): NavItem | null {
  const flat = flattenNavigation(navigation);
  const currentIndex = flat.findIndex((item) => item.href === currentPath);
  return currentIndex >= 0 && currentIndex < flat.length - 1
    ? flat[currentIndex + 1]
    : null;
}

export function getPrevPage(currentPath: string): NavItem | null {
  const flat = flattenNavigation(navigation);
  const currentIndex = flat.findIndex((item) => item.href === currentPath);
  return currentIndex > 0 ? flat[currentIndex - 1] : null;
}
