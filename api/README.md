# API Routes

Base URL: `http://localhost:3000`

## Health Check

```bash
curl http://localhost:3000/
```

Response:

```txt
OK
```

## List Menu Items

```bash
curl http://localhost:3000/menu
```

Response:

```json
[
  {
    "id": 1,
    "slug": "classic-margherita-pizza",
    "name": "Classic Margherita Pizza",
    "ingredients": ["Pizza dough", "Tomato sauce", "Fresh mozzarella"],
    "cookTimeMinutes": 15,
    "servings": 4,
    "cuisine": "Italian",
    "caloriesPerServing": 300,
    "tags": ["Pizza", "Italian"],
    "image": "https://cdn.dummyjson.com/recipe-images/1.webp",
    "rating": 4.6,
    "reviewCount": 98,
    "mealType": ["Dinner"],
    "createdAt": "2026-09-17 12:00:00"
  }
]
```

## Search Menu Items

```bash
curl "http://localhost:3000/menu?search=pasta"
```

Response:

```json
[
  {
    "id": 4,
    "slug": "pasta-carbonara",
    "name": "Pasta Carbonara",
    "ingredients": ["Spaghetti", "Eggs", "Parmesan cheese"],
    "cookTimeMinutes": 20,
    "servings": 2,
    "cuisine": "Italian",
    "caloriesPerServing": 500,
    "tags": ["Pasta", "Italian"],
    "image": "https://cdn.dummyjson.com/recipe-images/4.webp",
    "rating": 4.7,
    "reviewCount": 85,
    "mealType": ["Lunch", "Dinner"],
    "createdAt": "2026-09-17 12:00:00"
  }
]
```

## List Cuisines

```bash
curl http://localhost:3000/menu/cuisines
```

Response:

```json
[
  {
    "name": "Italian",
    "slug": "italian",
    "coverImage": "https://cdn.dummyjson.com/recipe-images/1.webp",
    "itemCount": 7
  },
  {
    "name": "Asian",
    "slug": "asian",
    "coverImage": "https://cdn.dummyjson.com/recipe-images/2.webp",
    "itemCount": 2
  }
]
```

## Get Cuisine

```bash
curl http://localhost:3000/menu/cuisines/italian
```

Response:

```json
{
  "name": "Italian",
  "slug": "italian",
  "coverImage": "https://cdn.dummyjson.com/recipe-images/1.webp",
  "itemCount": 7
}
```

Not found response:

```json
{
  "error": "Cuisine not found"
}
```

## List Cuisine Menu Items

```bash
curl http://localhost:3000/menu/cuisines/italian/items
```

Response:

```json
[
  {
    "id": 1,
    "slug": "classic-margherita-pizza",
    "name": "Classic Margherita Pizza",
    "ingredients": ["Pizza dough", "Tomato sauce", "Fresh mozzarella"],
    "cookTimeMinutes": 15,
    "servings": 4,
    "cuisine": "Italian",
    "caloriesPerServing": 300,
    "tags": ["Pizza", "Italian"],
    "image": "https://cdn.dummyjson.com/recipe-images/1.webp",
    "rating": 4.6,
    "reviewCount": 98,
    "mealType": ["Dinner"],
    "createdAt": "2026-09-17 12:00:00"
  }
]
```

## Search Cuisine Menu Items

```bash
curl "http://localhost:3000/menu/cuisines/italian/items?search=pizza"
```

Response:

```json
[
  {
    "id": 1,
    "slug": "classic-margherita-pizza",
    "name": "Classic Margherita Pizza",
    "ingredients": ["Pizza dough", "Tomato sauce", "Fresh mozzarella"],
    "cookTimeMinutes": 15,
    "servings": 4,
    "cuisine": "Italian",
    "caloriesPerServing": 300,
    "tags": ["Pizza", "Italian"],
    "image": "https://cdn.dummyjson.com/recipe-images/1.webp",
    "rating": 4.6,
    "reviewCount": 98,
    "mealType": ["Dinner"],
    "createdAt": "2026-09-17 12:00:00"
  }
]
```

## Get Menu Item By Slug

```bash
curl http://localhost:3000/menu/classic-margherita-pizza
```

Response:

```json
{
  "id": 1,
  "slug": "classic-margherita-pizza",
  "name": "Classic Margherita Pizza",
  "ingredients": ["Pizza dough", "Tomato sauce", "Fresh mozzarella"],
  "cookTimeMinutes": 15,
  "servings": 4,
  "cuisine": "Italian",
  "caloriesPerServing": 300,
  "tags": ["Pizza", "Italian"],
  "image": "https://cdn.dummyjson.com/recipe-images/1.webp",
  "rating": 4.6,
  "reviewCount": 98,
  "mealType": ["Dinner"],
  "createdAt": "2026-09-17 12:00:00"
}
```

Not found response:

```json
{
  "error": "Menu item not found"
}
```

## Get Menu Item Rating

This route uses the menu item id in the path.

```bash
curl http://localhost:3000/menu/1/reviews
```

Response:

```json
{
  "menuItemId": 1,
  "averageRating": 4.6,
  "reviewCount": 98
}
```

## Add Menu Item Review

This route uses the menu item id in the path.

```bash
curl -X POST http://localhost:3000/menu/1/reviews \
  -H "Content-Type: application/json" \
  -d '{"rating":5}'
```

Response:

```json
{
  "menuItemId": 1,
  "averageRating": 4.6,
  "reviewCount": 99
}
```

Validation error example:

```json
{
  "error": "Menu item id must be a number"
}
```
