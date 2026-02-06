import { Suspense } from 'react';
import { getRecipeById, type Recipe } from '@/lib/api/recipes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    ArrowLeft,
    MapPin,
    ChefHat,
    Utensils,
    Clock,
    Video,
    Globe,
    CheckCircle2,
    Square
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookmarkButton } from '@/components/dashboard/bookmark-button';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
    const { id } = await params;
    const recipe = await getRecipeById(id);

    if (!recipe) return { title: 'Recipe Not Found' };

    return {
        title: `${recipe.name} | NextHub`,
        description: `Learn how to cook ${recipe.name}, a delicious ${recipe.area} ${recipe.category} dish.`,
    };
}

export default async function RecipeDetailPage({ params }: Props) {
    const { id } = await params;
    const recipe = await getRecipeById(id);

    if (!recipe) notFound();

    return (
        <div className="space-y-8 pb-12">
            <Link
                href="/dashboard/recipes"
                className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
                <ArrowLeft className="mr-2 size-4" />
                Back to Recipes
            </Link>

            <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-6">
                    <div className="relative aspect-video rounded-3xl overflow-hidden border shadow-xl bg-muted">
                        <Image
                            src={recipe.thumbnail}
                            alt={recipe.name}
                            fill
                            className="object-cover"
                            priority
                            unoptimized
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                            <Badge className="bg-primary/90 backdrop-blur-md border-none px-3 py-1 text-sm font-bold">
                                {recipe.category}
                            </Badge>
                            <Badge variant="secondary" className="bg-background/80 backdrop-blur-md border-none px-3 py-1 text-sm">
                                <MapPin className="size-3 mr-1" />
                                {recipe.area}
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-extrabold tracking-tight">{recipe.name}</h1>

                        <div className="flex flex-wrap gap-4">
                            <BookmarkButton
                                type="recipe"
                                id={recipe.id}
                                title={recipe.name}
                                thumbnail={recipe.thumbnail}
                            />
                            {recipe.youtube && (
                                <Button variant="outline" className="gap-2" asChild>
                                    <a href={recipe.youtube} target="_blank" rel="noopener noreferrer">
                                        <Video className="size-4 text-red-500" /> Watch Video
                                    </a>
                                </Button>
                            )}
                            {recipe.source && (
                                <Button variant="ghost" className="gap-2" asChild>
                                    <a href={recipe.source} target="_blank" rel="noopener noreferrer">
                                        <Globe className="size-4" /> Source
                                    </a>
                                </Button>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {recipe.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="rounded-full">
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <Card className="rounded-3xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Utensils className="size-5 text-primary" />
                            Ingredients
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recipe.ingredients.map((item, index) => (
                                <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-transparent hover:border-primary/20 transition-colors">
                                    <div className="mt-0.5">
                                        <Square className="size-4 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm leading-tight">{item.ingredient}</p>
                                        <p className="text-xs text-muted-foreground">{item.measure}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <section className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <ChefHat className="size-6 text-primary" />
                    Instructions
                </h2>
                <Card className="rounded-3xl overflow-hidden">
                    <CardContent className="p-8">
                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            {recipe.instructions.split('\r\n').filter(Boolean).map((step, index) => (
                                <div key={index} className="flex gap-6 mb-8 group last:mb-0">
                                    <div className="flex-none flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary font-bold text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        {index + 1}
                                    </div>
                                    <p className="text-lg leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">
                                        {step}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
