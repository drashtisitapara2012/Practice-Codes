import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import { FeaturedMovie } from '@/components/dashboard/movie-carousel';
import { RecipeGrid } from '@/components/dashboard/recipe-grid';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted/50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 max-w-[800px]">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 animate-in fade-in slide-in-from-bottom-3 duration-1000">
                  Experience Next.js 16
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl dark:text-gray-400 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                  A comprehensive demo of the latest features including Cache Components, Turbopack, React 19.2, and enhanced routing.
                </p>
              </div>
              <div className="space-x-4 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-300">
                <Link href="/login">
                  <Button size="lg" className="gap-2">
                    Get Started <ArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link href="/docs">
                  <Button variant="outline" size="lg">
                    Documentation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                    <Check className="size-4" />
                  </div>
                  Cache Components
                </h3>
                <p className="text-muted-foreground">
                  Precise control over caching with the new "use cache" directive, cacheLife profiles, and cacheTag integration.
                </p>
              </div>

              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300">
                    <Check className="size-4" />
                  </div>
                  Turbopack Powered
                </h3>
                <p className="text-muted-foreground">
                  Blazing fast builds and HMR with Turbopack as the default bundler and new file system caching.
                </p>
              </div>

              <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300">
                    <Check className="size-4" />
                  </div>
                  React 19.2
                </h3>
                <p className="text-muted-foreground">
                  Leveraging the latest React features including Server Actions, useOptimistic, and View Transitions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Content Demo */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Real API Integration
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Demonstrating caching strategies with real data from free public APIs.
                </p>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Featured Movie (ISR Demo) */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Trending Movies (ISR)</h3>
                <Suspense fallback={<Skeleton className="aspect-[21/9] rounded-xl" />}>
                  <FeaturedMovie />
                </Suspense>
              </div>

              {/* Recipe Grid (PPR Demo) */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Featured Recipes (PPR)</h3>
                <Suspense fallback={<Skeleton className="h-[400px] rounded-xl" />}>
                  <RecipeGrid count={4} />
                </Suspense>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
