# Multi-stage Dockerfile for Leaderboard Aggregator
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* .npmrc* ./
RUN npm ci --ignore-scripts --no-audit --omit=dev

FROM node:20-alpine AS build
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm ci --ignore-scripts --no-audit && npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules
VOLUME [ "/app/data" ]
EXPOSE 4600
CMD ["node", "dist/server/index.js"]

