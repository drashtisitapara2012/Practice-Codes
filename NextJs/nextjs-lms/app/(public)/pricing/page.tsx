import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PricingPage() {
    return (
        <div className="container py-12 md:py-24">
            <div className="text-center mb-12 space-y-4">
                <h1 className="text-4xl font-bold">Simple, Transparent Pricing</h1>
                <p className="text-muted-foreground text-xl">Choose the plan that's right for you</p>
            </div>

            <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
                {/* Free Plan */}
                <div className="rounded-xl border bg-card p-8 shadow-sm flex flex-col">
                    <h3 className="font-semibold text-lg">Hobby</h3>
                    <div className="mt-4 mb-8">
                        <span className="text-4xl font-bold">$0</span>
                        <span className="text-muted-foreground">/mo</span>
                    </div>
                    <ul className="space-y-3 flex-1 mb-8">
                        <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-primary" /> Access to free courses</li>
                        <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-primary" /> Community support</li>
                    </ul>
                    <Button variant="outline" className="w-full">Get Started</Button>
                </div>

                {/* Pro Plan */}
                <div className="rounded-xl border-2 border-primary bg-card p-8 shadow-md flex flex-col relative">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold rounded-full">Most Popular</div>
                    <h3 className="font-semibold text-lg">Pro Learner</h3>
                    <div className="mt-4 mb-8">
                        <span className="text-4xl font-bold">$19</span>
                        <span className="text-muted-foreground">/mo</span>
                    </div>
                    <ul className="space-y-3 flex-1 mb-8">
                        <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-primary" /> All Access Pass</li>
                        <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-primary" /> Certificate of Completion</li>
                        <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-primary" /> 1-on-1 Mentorship</li>
                    </ul>
                    <Button className="w-full">Subscribe Now</Button>
                </div>

                {/* Team Plan */}
                <div className="rounded-xl border bg-card p-8 shadow-sm flex flex-col">
                    <h3 className="font-semibold text-lg">Team</h3>
                    <div className="mt-4 mb-8">
                        <span className="text-4xl font-bold">$99</span>
                        <span className="text-muted-foreground">/mo</span>
                    </div>
                    <ul className="space-y-3 flex-1 mb-8">
                        <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-primary" /> 5 Team Members</li>
                        <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-primary" /> Admin Dashboard</li>
                        <li className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-primary" /> Priority Support</li>
                    </ul>
                    <Button variant="outline" className="w-full">Contact Sales</Button>
                </div>
            </div>
        </div>
    );
}
