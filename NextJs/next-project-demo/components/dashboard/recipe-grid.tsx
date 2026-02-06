import { getRandomRecipes, type Recipe } from '@/lib/api/recipes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChefHat, Clock, MapPin, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface RecipeGridProps {
    count?: number;
}

/**
 * Recipe Grid - Server Component with "use cache"
 * 
 * This component demonstrates:
 * - Server Components (async data fetching)
 * - Next.js 16 Cache Components (via getRandomRecipes)
 * - TheMealDB API integration
 */
export async function RecipeGrid({ count = 6 }: RecipeGridProps) {
    const recipes = await getRandomRecipes(count);

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <ChefHat className="size-5 text-orange-500" />
                        Featured Recipes
                    </CardTitle>
                    <Link
                        href="/dashboard/recipes"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                        Explore all
                        <ArrowRight className="size-3" />
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
    return (
        <Link
            href={`/dashboard/recipes/${recipe.id}`}
            className="group"
        >
            <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                <Image
                    src={recipe.thumbnail}
                    alt={recipe.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Category badge */}
                {recipe.category && (
                    <div className="absolute top-3 left-3">
                        <Badge className="bg-primary/90 backdrop-blur-sm">
                            {recipe.category}
                        </Badge>
                    </div>
                )}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-semibold text-white text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                        {recipe.name}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-white/80">
                        {recipe.area && (
                            <span className="flex items-center gap-1">
                                <MapPin className="size-3" />
                                {recipe.area}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            {recipe.ingredients.length} ingredients
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

/**
 * Compact Recipe List - For smaller spaces
 */
export async function RecipeList({ count = 4 }: RecipeGridProps) {
    const recipes = await getRandomRecipes(count);

    return (
        <div className="space-y-3">
            {recipes.map((recipe) => (
                <Link
                    key={recipe.id}
                    href={`/dashboard/recipes/${recipe.id}`}
                    className="group flex gap-3 rounded-lg p-2 -mx-2 transition-colors hover:bg-accent"
                >
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg">
                        <Image
                            src={recipe.thumbnail}
                            alt={recipe.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                            {recipe.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                            {recipe.category} • {recipe.area}
                        </p>
                        <div className="flex gap-1 mt-1">
                            {recipe.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
