import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us',
    description: 'About NextLMS',
};

export default function AboutPage() {
    return (
        <div className="container py-12 md:py-24 max-w-3xl mx-auto space-y-8">
            <h1 className="text-4xl font-bold">About NextLMS</h1>
            <p className="text-xl text-muted-foreground">
                NextLMS is a demonstration of a production-grade Learning Management System built purely with Next.js 16 technologies.
            </p>
            <div className="prose dark:prose-invert">
                <p>
                    Our mission is to show how modern React Server Components, Server Actions, and Streaming can create fast, accessible, and dynamic web applications without the need for heavy client-side JavaScript bundles.
                </p>
                <h3>Key Technologies</h3>
                <ul>
                    <li>Next.js 16 App Router</li>
                    <li>React Server Components</li>
                    <li>Tailwind CSS v4</li>
                    <li>Server Actions for Mutations</li>
                </ul>
            </div>
        </div>
    );
}
