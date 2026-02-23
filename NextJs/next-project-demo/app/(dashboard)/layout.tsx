import { Sidebar } from '@/components/layout/sidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dashboard | NextHub',
    description: 'Manage your personal dashboard',
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <main className="flex-1 transition-all duration-300 lg:pl-64">
                <div className="container mx-auto p-4 md:p-8 pt-20 lg:pt-8 min-h-screen">
                    {children}
                </div>
            </main>
        </div>
    );
}
