# Simple static server for wrapper skin
FROM node:20-alpine AS runner
WORKDIR /app
COPY skin /app/skin
RUN npm i -g http-server@14.1.1
EXPOSE 8080
CMD ["http-server", "/app/skin", "-p", "8080", "-c-1"]
