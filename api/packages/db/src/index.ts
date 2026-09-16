import { createClient } from "@libsql/client";
import { eq, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";

import type { DatabaseConfig } from "./config";
import * as schema from "./schema";
import { menuItems, reviews } from "./schema";

export * from "./schema";

export function createDb(env: DatabaseConfig) {
  const client = createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  });

  return drizzle({ client, schema });
}

export type Database = ReturnType<typeof createDb>;

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function searchPattern(search: string) {
  return `%${search.trim()}%`;
}

export function listMenuItems(db: Database, search?: string) {
  const trimmedSearch = search?.trim();

  if (!trimmedSearch) {
    return db.select().from(menuItems).orderBy(menuItems.id);
  }

  const pattern = searchPattern(trimmedSearch);

  return db
    .select()
    .from(menuItems)
    .where(
      or(
        like(menuItems.name, pattern),
        like(menuItems.cuisine, pattern),
        like(menuItems.tags, pattern),
      ),
    )
    .orderBy(menuItems.id);
}

export async function listCuisines(db: Database) {
  const items = await db
    .select({
      id: menuItems.id,
      cuisine: menuItems.cuisine,
      image: menuItems.image,
    })
    .from(menuItems)
    .orderBy(menuItems.id);

  const cuisines = new Map<
    string,
    { name: string; slug: string; coverImage: string; itemCount: number }
  >();

  for (const item of items) {
    const slug = slugify(item.cuisine);
    const cuisine = cuisines.get(slug);

    if (cuisine) {
      cuisine.itemCount += 1;
      continue;
    }

    cuisines.set(slug, {
      name: item.cuisine,
      slug,
      coverImage: item.image,
      itemCount: 1,
    });
  }

  return Array.from(cuisines.values());
}

export async function getCuisineBySlug(db: Database, slug: string) {
  const cuisines = await listCuisines(db);

  return cuisines.find((cuisine) => cuisine.slug === slugify(slug));
}

export async function listMenuItemsByCuisineSlug(
  db: Database,
  cuisineSlug: string,
  search?: string,
) {
  const items = await listMenuItems(db, search);
  const normalizedCuisineSlug = slugify(cuisineSlug);

  return items.filter(
    (item) => slugify(item.cuisine) === normalizedCuisineSlug,
  );
}

export async function getMenuItemBySlug(db: Database, slug: string) {
  const [item] = await db
    .select()
    .from(menuItems)
    .where(eq(menuItems.slug, slug))
    .limit(1);

  return item;
}

export async function getMenuItemRating(db: Database, id: number) {
  const [item] = await db
    .select({
      id: menuItems.id,
      rating: menuItems.rating,
      reviewCount: menuItems.reviewCount,
    })
    .from(menuItems)
    .where(eq(menuItems.id, id))
    .limit(1);

  if (!item) {
    return undefined;
  }

  return {
    menuItemId: item.id,
    averageRating: item.rating,
    reviewCount: item.reviewCount,
  };
}

export async function addMenuItemReview(
  db: Database,
  id: number,
  rating: number,
) {
  const currentRating = await getMenuItemRating(db, id);

  if (!currentRating) {
    return undefined;
  }

  const reviewCount = currentRating.reviewCount + 1;
  const averageRating = Number(
    (
      (currentRating.averageRating * currentRating.reviewCount + rating) /
      reviewCount
    ).toFixed(1),
  );

  await db.insert(reviews).values({ menuItemId: id, rating });
  await db
    .update(menuItems)
    .set({ rating: averageRating, reviewCount })
    .where(eq(menuItems.id, id));

  return { menuItemId: id, averageRating, reviewCount };
}
