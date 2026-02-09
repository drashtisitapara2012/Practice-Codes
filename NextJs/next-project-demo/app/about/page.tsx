import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, Rocket, Zap, Heart, Users } from 'lucide-react';

export const metadata = {
    title: 'About | NextHub',
    description: 'Learn about the technology behind NextHub',
};

export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-20 max-w-5xl">
                <div className="space-y-16">
                    {/* Hero section */}
                    <div className="text-center space-y-6">
                        <Badge variant="secondary" className="px-4 py-1 text-sm rounded-full">The Next.js 16 Showcase</Badge>
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Built for the Modern Web</h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            NextHub is a comprehensive demonstration of <strong>Next.js 16</strong>'s core capabilities,
                            built with best practices and the latest React features.
                        </p>
                    </div>

                    {/* Grid section */}
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <FeatureCard
                            icon={Rocket}
                            title="Turbopack"
                            description="Native Rust-based bundler providing ultra-fast startup and rebuild times."
                        />
                        <FeatureCard
                            icon={Zap}
                            title="Cache Components"
                            description="Granular control over caching at the component level using the 'use cache' directive."
                        />
                        <FeatureCard
                            icon={Code}
                            title="React 19.2"
                            description="Leveraging modern React hooks like useOptimistic and the new Server Actions."
                        />
                        <FeatureCard
                            icon={Users}
                            title="NextAuth v5"
                            description="Secure, flexible authentication with support for multiple OAuth providers."
                        />
                        <FeatureCard
                            icon={Heart}
                            title="Shadcn/UI"
                            description="Beautifully designed components that are fully accessible and customizable."
                        />
                        <FeatureCard
                            icon={Rocket}
                            title="PPR"
                            description="Partial Pre-Rendering for instant initial loads with dynamic islands."
                        />
                    </div>

                    {/* Mission statement */}
                    <Card className="rounded-3xl bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/10">
                        <CardContent className="p-10 space-y-6 text-center">
                            <h2 className="text-3xl font-bold">Our Project Goal</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                The objective of NextHub is to serve as a high-fidelity reference for developers looking
                                to upgrade to Next.js 16. It covers everything from basic routing to advanced
                                patterns, all while using real-world data from public APIs.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function FeatureCard({ icon: Icon, title, description }: any) {
    return (
        <Card className="border-none shadow-none bg-muted/30 hover:bg-muted/50 transition-colors">
            <CardContent className="p-6 space-y-3">
                <div className="p-3 rounded-2xl bg-background w-fit shadow-sm border">
                    <Icon className="size-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{description}</p>
            </CardContent>
        </Card>
    );
}
