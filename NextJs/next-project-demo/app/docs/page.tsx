import { ArrowRight, Book, Code, Globe, Terminal } from 'lucide-react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function DocsPage({ params }: { params: Promise<{ slug?: string[] }> }) {
    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-extrabold tracking-tight">Documentation</h1>
                <p className="text-xl text-muted-foreground">Master the features and architecture of NextHub.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <DocCard
                    title="Getting Started"
                    description="Learn how to set up the environment and run NextHub locally."
                    icon={Terminal}
                    href="/docs/getting-started"
                />
                <DocCard
                    title="Framework Features"
                    description="A deep dive into Next.js 16 features like Cache Components and PPR."
                    icon={Code}
                    href="/docs/features"
                />
                <DocCard
                    title="API Integration"
                    description="Understand how we connect to various real-world data sources."
                    icon={Globe}
                    href="/docs/api-guide"
                />
                <DocCard
                    title="Best Practices"
                    description="Production-ready patterns for styling, testing, and deployment."
                    icon={Book}
                    href="/docs/best-practices"
                />
            </div>

            <section className="space-y-6">
                <h2 className="text-2xl font-bold">Deep Dives</h2>
                <div className="space-y-4">
                    {[
                        'Architecture Overview',
                        'Caching Strategy',
                        'Authentication with NextAuth',
                        'Styling with Tailwind CSS 4',
                    ].map((topic) => (
                        <Link
                            key={topic}
                            href={`/docs/${topic.toLowerCase().replace(/ /g, '-')}`}
                            className="flex items-center justify-between p-4 rounded-xl border bg-card transition-all hover:border-primary/50 group"
                        >
                            <span className="font-bold">{topic}</span>
                            <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}

function DocCard({ title, description, icon: Icon, href }: any) {
    return (
        <Link href={href}>
            <Card className="h-full transition-all hover:shadow-lg hover:border-primary/20">
                <CardHeader>
                    <div className="p-2 rounded-lg bg-primary/10 w-fit mb-2">
                        <Icon className="size-6 text-primary" />
                    </div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
            </Card>
        </Link>
    );
}
