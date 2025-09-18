# Dockerfile for GIF renderer with node-canvas deps
FROM node:20-bookworm AS deps
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
  libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* .npmrc* ./
RUN npm ci --ignore-scripts --no-audit --omit=dev

FROM node:20-bookworm AS build
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
  libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev \
  && rm -rf /var/lib/apt/lists/*
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm ci --ignore-scripts --no-audit && npm run build

FROM node:20-bookworm AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 4900
CMD ["node", "dist/index.js"]

