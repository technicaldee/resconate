FROM node:24-bookworm-slim AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
COPY frontend/package.json frontend/package.json
COPY backend/package.json backend/package.json
RUN npm ci --omit=dev
FROM dependencies AS build
COPY frontend frontend
ARG API_INTERNAL_URL=http://api:3001
ENV API_INTERNAL_URL=$API_INTERNAL_URL NEXT_TELEMETRY_DISABLED=1
RUN npm run build --workspace frontend
FROM node:24-bookworm-slim AS frontend
WORKDIR /app
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000
COPY --from=build --chown=node:node /app/frontend/.next/standalone ./
COPY --from=build --chown=node:node /app/frontend/.next/static ./frontend/.next/static
COPY --from=build --chown=node:node /app/frontend/public ./frontend/public
USER node
EXPOSE 3000
CMD ["node","frontend/server.js"]
FROM dependencies AS api
COPY --chown=node:node backend backend
ENV NODE_ENV=production API_HOST=0.0.0.0 API_PORT=3001
USER node
EXPOSE 3001
CMD ["node","backend/server.js"]
