# Multi-stage Dockerfile with k6 + Node orchestrator
FROM grafana/k6:0.50.0 AS k6

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* .npmrc* ./
RUN npm ci --ignore-scripts --no-audit --omit=dev

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm ci --ignore-scripts --no-audit && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/k6 ./k6
COPY --from=deps /app/node_modules ./node_modules
COPY --from=k6 /usr/bin/k6 /usr/bin/k6
ENV K6_PATH=/usr/bin/k6
VOLUME [ "/app/results" ]
CMD ["node", "dist/index.js", "smoke"]

