import "varlock/auto-load";

import { createDb } from ".";
import { sql } from "drizzle-orm";
import { ENV as env } from "./env";
import { menuItems } from "./schema";

type FoodItem = {
  id: number;
  name: string;
  ingredients: string[];
  cookTimeMinutes: number;
  servings: number;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  image: string;
  rating: number;
  reviewCount: number;
  mealType: string[];
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const foodFile = Bun.file(new URL("../../../food.json", import.meta.url));
const foodItems = (await foodFile.json()) as FoodItem[];
const db = createDb(env);

await db
  .insert(menuItems)
  .values(
    foodItems.map((item) => ({
      id: item.id,
      slug: slugify(item.name),
      name: item.name,
      ingredients: item.ingredients,
      cookTimeMinutes: item.cookTimeMinutes,
      servings: item.servings,
      cuisine: item.cuisine,
      caloriesPerServing: item.caloriesPerServing,
      tags: item.tags,
      image: item.image,
      rating: item.rating,
      reviewCount: item.reviewCount,
      mealType: item.mealType,
    })),
  )
  .onConflictDoUpdate({
    target: menuItems.id,
    set: {
      slug: sqlExcluded("slug"),
      name: sqlExcluded("name"),
      ingredients: sqlExcluded("ingredients"),
      cookTimeMinutes: sqlExcluded("cook_time_minutes"),
      servings: sqlExcluded("servings"),
      cuisine: sqlExcluded("cuisine"),
      caloriesPerServing: sqlExcluded("calories_per_serving"),
      tags: sqlExcluded("tags"),
      image: sqlExcluded("image"),
      rating: sqlExcluded("rating"),
      reviewCount: sqlExcluded("review_count"),
      mealType: sqlExcluded("meal_type"),
    },
  });

console.log(`Seeded ${foodItems.length} menu items`);

function sqlExcluded(column: string) {
  return sql.raw(`excluded.${column}`);
}
