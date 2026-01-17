'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { navigation, type NavItem } from '@/lib/navigation';
import { ChevronRight, BookOpen, Home } from 'lucide-react';

function NavItemComponent({ item, depth = 0 }: { item: NavItem; depth?: number }) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(() => {
        if (!item.children) return false;
        const checkOpen = (children: NavItem[]): boolean => {
            return children.some(child =>
                child.href === pathname ||
                (child.children && checkOpen(child.children))
            );
        };
        return checkOpen(item.children);
    });

    const hasChildren = item.children && item.children.length > 0;
    const isActive = item.href === pathname;
    const isSection = depth === 0 && !item.href;

    if (isSection) {
        return (
            <div className="mb-6">
                <div className="flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider text-primary">
                    {item.title}
                    {item.badge && (
                        <span className="ml-auto rounded bg-primary/20 px-2 py-0.5 text-[10px] text-primary">
                            {item.badge}
                        </span>
                    )}
                </div>
                {hasChildren && (
                    <div className="mt-2 space-y-1">
                        {item.children!.map((child, i) => (
                            <NavItemComponent key={i} item={child} depth={depth + 1} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (hasChildren) {
        return (
            <div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors',
                        'hover:bg-bg-tertiary text-text-secondary hover:text-white',
                        isOpen && 'text-white'
                    )}
                    style={{ paddingLeft: `${depth * 12 + 12}px` }}
                >
                    <span className="flex items-center gap-2">
                        {item.title}
                        {item.badge && (
                            <span className="rounded bg-primary/20 px-1.5 py-0.5 text-xs text-primary">
                                {item.badge}
                            </span>
                        )}
                    </span>
                    <ChevronRight
                        size={14}
                        className={cn('transition-transform', isOpen && 'rotate-90')}
                    />
                </button>
                {isOpen && (
                    <div className="mt-1 space-y-1">
                        {item.children!.map((child, i) => (
                            <NavItemComponent key={i} item={child} depth={depth + 1} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <Link
            href={item.href!}
            className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                    ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary'
                    : 'text-text-secondary hover:bg-bg-tertiary hover:text-white'
            )}
            style={{ paddingLeft: `${depth * 12 + 12}px` }}
        >
            {item.title}
            {item.badge && (
                <span className="rounded bg-primary/20 px-1.5 py-0.5 text-xs text-primary">
                    {item.badge}
                </span>
            )}
        </Link>
    );
}

export function Sidebar() {
    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-72 border-r border-border bg-bg-secondary overflow-y-auto">
            {/* Logo */}
            <div className="sticky top-0 z-10 border-b border-border bg-bg-secondary p-4">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg group-hover:shadow-primary/50 transition-shadow">
                        <span className="text-white font-bold text-xl">C</span>
                    </div>
                    <div className="flex-1">
                        <div className="font-bold text-white">Caravan Interactive</div>
                        <div className="text-xs text-text-secondary">Learn Bitcoin Multisig</div>
                    </div>
                </Link>
            </div>

            {/* Quick Links */}
            <div className="p-4 border-b border-border">
                <Link
                    href="/"
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-text-secondary hover:bg-bg-tertiary hover:text-white transition-colors"
                >
                    <Home size={16} />
                    Home
                </Link>
                <Link
                    href="/playground"
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-text-secondary hover:bg-bg-tertiary hover:text-white transition-colors"
                >
                    <BookOpen size={16} />
                    Playground
                </Link>
            </div>

            {/* Navigation */}
            <nav className="p-4">
                {navigation.map((section, i) => (
                    <NavItemComponent key={i} item={section} />
                ))}
            </nav>
        </aside>
    );
}