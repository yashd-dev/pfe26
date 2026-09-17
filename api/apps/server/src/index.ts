import { cors } from "@elysiajs/cors";
import { openapi } from "@elysia/openapi";
import { Elysia } from "elysia";

import { menuRoutes } from "./routes/menu";
import { getDb } from "./services";

const db = getDb();

new Elysia()
  .use(
    cors({
      origin: true,
      methods: ["GET", "POST", "OPTIONS"],
    }),
  )
  .use(
    openapi({
      documentation: {
        info: {
          title: "NMIMS Canteen API",
          version: "1.0.0",
          description: "Backend API for the NMIMS canteen workshop project.",
        },
        tags: [
          { name: "App", description: "General API endpoints" },
          { name: "Menu", description: "Menu, cuisine, and review endpoints" },
        ],
      },
    }),
  )
  .get("/", () => "OK", {
    detail: {
      summary: "Health check",
      tags: ["App"],
    },
  })
  .use(menuRoutes(db))
  .listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
