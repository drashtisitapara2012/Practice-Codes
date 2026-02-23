/**
 * Recipes API Client using TheMealDB
 * 
 * Demonstrates Next.js 16 Cache Components with ISR pattern
 * TheMealDB provides free access with a test API key
 */

import { cacheLife, cacheTag } from 'next/cache';
import { RANDOM_RECIPES_TAG, recipeTag, recipeSearchTag } from '@/lib/cache/tags';

export interface Recipe {
    id: string;
    name: string;
    category: string;
    area: string;
    instructions: string;
    thumbnail: string;
    tags: string[];
    youtube: string | null;
    ingredients: { ingredient: string; measure: string }[];
    source: string | null;
}

export interface RecipeCategory {
    id: string;
    name: string;
    thumbnail: string;
    description: string;
}

// TheMealDB provides a free test API key: '1'
const MEALDB_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

/**
 * Get random recipes for the home page
 * Fetches multiple random recipes in parallel
 */
export async function getRandomRecipes(count: number = 6): Promise<Recipe[]> {
    'use cache';
    cacheLife('hours'); // Refresh every hour
    cacheTag(RANDOM_RECIPES_TAG);

    // TheMealDB returns one random recipe per call
    const promises = Array(count).fill(null).map(() =>
        fetch(`${MEALDB_BASE_URL}/random.php`)
            .then(res => res.json())
            .then(data => data.meals?.[0])
            .catch(() => null)
    );

    const results = await Promise.all(promises);
    const uniqueRecipes = new Map<string, Recipe>();

    results.filter(Boolean).forEach(meal => {
        const recipe = formatRecipe(meal);
        if (!uniqueRecipes.has(recipe.id)) {
            uniqueRecipes.set(recipe.id, recipe);
        }
    });

    return Array.from(uniqueRecipes.values());
}

/**
 * Get recipe by ID
 */
export async function getRecipeById(id: string): Promise<Recipe | null> {
    'use cache';
    cacheLife('max'); // Recipe details rarely change
    cacheTag(recipeTag(id));

    const response = await fetch(`${MEALDB_BASE_URL}/lookup.php?i=${id}`);

    if (!response.ok) {
        return null;
    }

    const data = await response.json();

    if (!data.meals?.[0]) {
        return null;
    }

    return formatRecipe(data.meals[0]);
}

/**
 * Search recipes by name
 */
export async function searchRecipes(query: string): Promise<Recipe[]> {
    'use cache';
    cacheLife('days');
    cacheTag(recipeSearchTag(query));

    const response = await fetch(
        `${MEALDB_BASE_URL}/search.php?s=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
        throw new Error(`Recipe search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return (data.meals || []).map(formatRecipe);
}

/**
 * Get recipes by category
 */
export async function getRecipesByCategory(category: string): Promise<Recipe[]> {
    'use cache';
    cacheLife('days');
    cacheTag(`recipes-category-${category.toLowerCase()}`);

    const response = await fetch(
        `${MEALDB_BASE_URL}/filter.php?c=${encodeURIComponent(category)}`
    );

    if (!response.ok) {
        throw new Error(`Recipe category fetch failed: ${response.statusText}`);
    }

    const data = await response.json();

    // The filter endpoint returns minimal data, so we need to fetch full details
    // For performance, we'll return the basic info and let client fetch details
    return (data.meals || []).map((meal: any) => ({
        id: meal.idMeal,
        name: meal.strMeal,
        category: category,
        area: '',
        instructions: '',
        thumbnail: meal.strMealThumb,
        tags: [],
        youtube: null,
        ingredients: [],
        source: null,
    }));
}

/**
 * Get recipes by main ingredient
 */
export async function getRecipesByIngredient(ingredient: string): Promise<Recipe[]> {
    'use cache';
    cacheLife('days');
    cacheTag(`recipes-ingredient-${ingredient.toLowerCase()}`);

    const response = await fetch(
        `${MEALDB_BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
    );

    if (!response.ok) {
        throw new Error(`Recipe ingredient fetch failed: ${response.statusText}`);
    }

    const data = await response.json();

    return (data.meals || []).map((meal: any) => ({
        id: meal.idMeal,
        name: meal.strMeal,
        category: '',
        area: '',
        instructions: '',
        thumbnail: meal.strMealThumb,
        tags: [],
        youtube: null,
        ingredients: [],
        source: null,
    }));
}

/**
 * Get all recipe categories
 */
export async function getRecipeCategories(): Promise<RecipeCategory[]> {
    'use cache';
    cacheLife('weeks'); // Categories rarely change
    cacheTag('recipe-categories');

    const response = await fetch(`${MEALDB_BASE_URL}/categories.php`);

    if (!response.ok) {
        throw new Error(`Categories fetch failed: ${response.statusText}`);
    }

    const data = await response.json();

    return (data.categories || []).map((cat: any) => ({
        id: cat.idCategory,
        name: cat.strCategory,
        thumbnail: cat.strCategoryThumb,
        description: cat.strCategoryDescription,
    }));
}

/**
 * Get recipe by first letter
 */
export async function getRecipesByLetter(letter: string): Promise<Recipe[]> {
    'use cache';
    cacheLife('weeks');
    cacheTag(`recipes-letter-${letter.toLowerCase()}`);

    const response = await fetch(`${MEALDB_BASE_URL}/search.php?f=${letter}`);

    if (!response.ok) {
        throw new Error(`Recipe letter search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return (data.meals || []).map(formatRecipe);
}

// Helper to format API response to Recipe type
function formatRecipe(meal: any): Recipe {
    const ingredients: { ingredient: string; measure: string }[] = [];

    // TheMealDB has ingredients as strIngredient1 through strIngredient20
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim()) {
            ingredients.push({
                ingredient: ingredient.trim(),
                measure: measure?.trim() || '',
            });
        }
    }

    return {
        id: meal.idMeal,
        name: meal.strMeal,
        category: meal.strCategory || '',
        area: meal.strArea || '',
        instructions: meal.strInstructions || '',
        thumbnail: meal.strMealThumb,
        tags: meal.strTags ? meal.strTags.split(',').map((t: string) => t.trim()) : [],
        youtube: meal.strYoutube || null,
        ingredients,
        source: meal.strSource || null,
    };
}
