const API_BASE_URL = (import.meta.env.API_BASE_URL ?? import.meta.env.PUBLIC_API_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export type MenuItem = {
  id: number;
  slug: string;
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
  createdAt: string;
};

export type Cuisine = {
  name: string;
  slug: string;
  coverImage: string;
  itemCount: number;
};

async function getJson<T>(path: string, searchParams?: Record<string, string | undefined>) {
  const url = new URL(`${API_BASE_URL}${path}`);

  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (value) url.searchParams.set(key, value);
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${url.pathname}`);
  }

  return response.json() as Promise<T>;
}

export async function listCuisines() {
  return getJson<Cuisine[]>('/menu/cuisines');
}

export async function listMenuItems(options: { search?: string; cuisine?: string } = {}) {
  if (options.cuisine) {
    return getJson<MenuItem[]>(`/menu/cuisines/${options.cuisine}/items`, { search: options.search });
  }

  return getJson<MenuItem[]>('/menu', { search: options.search });
}

export async function getMenuItem(slug: string) {
  return getJson<MenuItem>(`/menu/${slug}`);
}
