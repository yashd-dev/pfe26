import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

import { env } from "./env.server";
import { menuRoutes } from "./routes/menu";
import { getDb } from "./services";

const db = getDb();

new Elysia()
  .use(
    cors({
      origin: env.CORS_ORIGIN,
      methods: ["GET", "POST", "OPTIONS"],
    }),
  )
  .get("/", () => "OK")
  .use(menuRoutes(db))
  .listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
