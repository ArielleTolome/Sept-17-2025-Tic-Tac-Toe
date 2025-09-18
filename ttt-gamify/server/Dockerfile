FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* .npmrc* ./
RUN npm ci --omit=dev || npm i --omit=dev
COPY server ./server
COPY ttt-gamify/server ./server
ENV PORT=8787
EXPOSE 8787
CMD ["node", "server/src/index.js"]

