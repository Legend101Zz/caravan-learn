import { Sidebar } from '@/components/layout/sidebar';

export default function LearnLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-bg-primary">
            <Sidebar />
            <main className="ml-72">
                <div className="max-w-4xl mx-auto px-8 py-12">
                    {children}
                </div>
            </main>
        </div>
    );
}