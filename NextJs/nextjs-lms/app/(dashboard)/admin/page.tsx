import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminDashboard() {
    const session = await getSession();

    // Middleware protection is already in place

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex flex-col space-y-1.5 ">
                        <h3 className="tracking-tight text-sm font-medium">Total Revenue</h3>
                    </div>
                    <div className="p-0 pt-4">
                        <div className="text-2xl font-bold">$45,231.89</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex flex-col space-y-1.5 ">
                        <h3 className="tracking-tight text-sm font-medium">Subscriptions</h3>
                    </div>
                    <div className="p-0 pt-4">
                        <div className="text-2xl font-bold">+2350</div>
                        <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                    </div>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex flex-col space-y-1.5 ">
                        <h3 className="tracking-tight text-sm font-medium">Active Now</h3>
                    </div>
                    <div className="p-0 pt-4">
                        <div className="text-2xl font-bold">+573</div>
                        <p className="text-xs text-muted-foreground">+201 since last hour</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
