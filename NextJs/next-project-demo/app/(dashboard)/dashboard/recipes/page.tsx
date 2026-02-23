import { Suspense } from 'react';
import { getRandomRecipes, searchRecipes, getRecipeCategories } from '@/lib/api/recipes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChefHat, Search, Utensils, MapPin, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
    title: 'Recipes | NextHub',
    description: 'Find your next favorite meal',
};

interface RecipesPageProps {
    searchParams: Promise<{ q?: string }>;
}

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
    const params = await searchParams;
    const query = params.q;

    return (
        <div className="space-y-12">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight">Culinary Inspiration</h1>
                    <p className="text-muted-foreground">Discover delicious recipes and cooking ideas.</p>
                </div>

                <form action="/dashboard/recipes" className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        name="q"
                        placeholder="Search recipes..."
                        defaultValue={query}
                        className="pl-10"
                    />
                </form>
            </div>

            {query ? (
                <section className="space-y-6">
                    <h2 className="text-2xl font-bold">Search results for "{query}"</h2>
                    <Suspense key={query} fallback={<RecipeGridSkeleton />}>
                        <SearchResults query={query} />
                    </Suspense>
                </section>
            ) : (
                <>
                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <ChefHat className="size-6 text-orange-500" />
                            Chef's Daily Picks
                        </h2>
                        <Suspense fallback={<RecipeGridSkeleton />}>
                            <RandomRecipes />
                        </Suspense>
                    </section>

                    <section className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Utensils className="size-6 text-primary" />
                            Categories
                        </h2>
                        <Suspense fallback={<CategoriesSkeleton />}>
                            <CategoriesGrid />
                        </Suspense>
                    </section>
                </>
            )}
        </div>
    );
}

async function SearchResults({ query }: { query: string }) {
    const recipes = await searchRecipes(query);

    if (recipes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center border rounded-2xl bg-muted/20">
                <div className="p-4 rounded-full bg-muted mb-4">
                    <ChefHat className="size-10 text-muted-foreground opacity-50" />
                </div>
                <h3 className="text-xl font-bold">No recipes found</h3>
                <p className="text-muted-foreground mt-1">Try searching for something else like "Chicken" or "Pasta".</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => <RecipeItem key={recipe.id} recipe={recipe} />)}
        </div>
    );
}

async function RandomRecipes() {
    const recipes = await getRandomRecipes(8);
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => <RecipeItem key={recipe.id} recipe={recipe} />)}
        </div>
    );
}

async function CategoriesGrid() {
    const categories = await getRecipeCategories();

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((cat) => (
                <Link
                    key={cat.id}
                    href={`/dashboard/recipes?q=${cat.name}`}
                    className="group flex flex-col items-center p-4 rounded-2xl border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/20"
                >
                    <div className="relative size-16 mb-3">
                        <Image
                            src={cat.thumbnail}
                            alt={cat.name}
                            fill
                            className="object-contain transition-transform group-hover:scale-110"
                            unoptimized
                        />
                    </div>
                    <span className="text-sm font-bold text-center">{cat.name}</span>
                </Link>
            ))}
        </div>
    );
}

function RecipeItem({ recipe }: { recipe: any }) {
    return (
        <Link href={`/dashboard/recipes/${recipe.id}`} className="group h-full">
            <div className="flex flex-col h-full rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/20 overflow-hidden">
                <div className="relative aspect-square w-full">
                    <Image
                        src={recipe.thumbnail}
                        alt={recipe.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                    />
                    <div className="absolute top-3 left-3">
                        <Badge className="bg-primary/90 backdrop-blur-md border-none font-bold">
                            {recipe.category}
                        </Badge>
                    </div>
                </div>

                <div className="flex flex-col p-5 flex-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                        <MapPin className="size-3" />
                        {recipe.area}
                    </div>

                    <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors flex-1 mb-4">
                        {recipe.name}
                    </h3>

                    <div className="flex items-center justify-between mt-auto">
                        <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                            <Utensils className="size-3" />
                            View Recipe
                        </div>
                        <div className="p-1.5 rounded-full bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <ArrowRight className="size-4" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

function RecipeGridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="rounded-2xl overflow-hidden h-full">
                    <div className="aspect-square w-full bg-muted animate-pulse" />
                    <CardContent className="p-5 space-y-4">
                        <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
                        <div className="h-6 w-full bg-muted animate-pulse rounded" />
                        <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function CategoriesSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-24 w-full bg-muted animate-pulse rounded-2xl" />
            ))}
        </div>
    );
}
