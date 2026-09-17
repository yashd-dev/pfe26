import {
  addMenuItemReview,
  type Database,
  getCuisineBySlug,
  getMenuItemBySlug,
  getMenuItemRating,
  listCuisines,
  listMenuItems,
  listMenuItemsByCuisineSlug,
} from "@api/db";
import { Elysia, t } from "elysia";

export function menuRoutes(db: Database) {
  return new Elysia({
    prefix: "/menu",
    detail: {
      tags: ["Menu"],
    },
  })
    .get("/", ({ query }) => listMenuItems(db, query.search), {
      query: t.Object({
        search: t.Optional(t.String()),
      }),
    })
    .get("/cuisines", () => listCuisines(db))
    .get("/cuisines/:slug", async ({ params, set }) => {
      const cuisine = await getCuisineBySlug(db, params.slug);

      if (!cuisine) {
        set.status = 404;
        return { error: "Cuisine not found" };
      }

      return cuisine;
    })
    .get(
      "/cuisines/:slug/items",
      async ({ params, query, set }) => {
        const cuisine = await getCuisineBySlug(db, params.slug);

        if (!cuisine) {
          set.status = 404;
          return { error: "Cuisine not found" };
        }

        return listMenuItemsByCuisineSlug(db, params.slug, query.search);
      },
      {
        query: t.Object({
          search: t.Optional(t.String()),
        }),
      },
    )
    .get("/:slug/reviews", async ({ params, set }) => {
      const id = Number(params.slug);

      if (!Number.isInteger(id)) {
        set.status = 400;
        return { error: "Menu item id must be a number" };
      }

      const item = await getMenuItemRating(db, id);

      if (!item) {
        set.status = 404;
        return { error: "Menu item not found" };
      }

      return item;
    })
    .post(
      "/:slug/reviews",
      async ({ body, params, set }) => {
        const id = Number(params.slug);

        if (!Number.isInteger(id)) {
          set.status = 400;
          return { error: "Menu item id must be a number" };
        }

        const item = await addMenuItemReview(db, id, body.rating);

        if (!item) {
          set.status = 404;
          return { error: "Menu item not found" };
        }

        set.status = 201;
        return item;
      },
      {
        body: t.Object({
          rating: t.Integer({ minimum: 1, maximum: 5 }),
        }),
      },
    )
    .get("/:slug", async ({ params, set }) => {
      const item = await getMenuItemBySlug(db, params.slug);

      if (!item) {
        set.status = 404;
        return { error: "Menu item not found" };
      }

      return item;
    });
}
