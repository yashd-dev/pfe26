FROM oven/bun:1 AS builder
WORKDIR /app

COPY . .
RUN bun install --frozen-lockfile

ENV NODE_ENV=production
RUN bun run --filter server build

FROM oven/bun:1 AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app /app

EXPOSE 3000

WORKDIR /app/apps/server
CMD ["bun", "dist/index.mjs"]
