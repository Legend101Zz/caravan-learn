/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
/* eslint-disable react/no-unescaped-entities */
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getNextPage, getPrevPage } from '@/lib/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function PageNavigation() {
    const pathname = usePathname();
    const prevPage = getPrevPage(pathname);
    const nextPage = getNextPage(pathname);

    if (!prevPage && !nextPage) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16 pt-8 border-t border-border">
            {prevPage ? (
                <Card className="p-6 hover:border-primary/50 transition-all">
                    <Button variant="ghost" asChild className="h-auto p-0 w-full">
                        <Link href={prevPage.href!} className="flex items-start gap-4 text-left">
                            <ArrowLeft className="mt-1 flex-shrink-0 text-primary" size={20} />
                            <div className="flex-1">
                                <div className="text-xs text-text-muted mb-1">Previous</div>
                                <div className="font-semibold text-white">{prevPage.title}</div>
                                {prevPage.description && (
                                    <div className="text-sm text-text-secondary mt-1">{prevPage.description}</div>
                                )}
                            </div>
                        </Link>
                    </Button>
                </Card>
            ) : (
                <div />
            )}

            {nextPage && (
                <Card className="p-6 hover:border-primary/50 transition-all">
                    <Button variant="ghost" asChild className="h-auto p-0 w-full">
                        <Link href={nextPage.href!} className="flex items-start gap-4 text-right">
                            <div className="flex-1">
                                <div className="text-xs text-text-muted mb-1">Next</div>
                                <div className="font-semibold text-white">{nextPage.title}</div>
                                {nextPage.description && (
                                    <div className="text-sm text-text-secondary mt-1">{nextPage.description}</div>
                                )}
                            </div>
                            <ArrowRight className="mt-1 flex-shrink-0 text-primary" size={20} />
                        </Link>
                    </Button>
                </Card>
            )}
        </div>
    );
}