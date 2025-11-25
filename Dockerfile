# Multi-stage build for Resconate Portfolio Frontend
FROM node:18-alpine AS frontend-builder

# Set working directory for frontend
WORKDIR /app

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy frontend source files
COPY frontend/ ./

# Build Next.js application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built application from builder stage
COPY --from=frontend-builder /app/.next ./.next
COPY --from=frontend-builder /app/public ./public
COPY --from=frontend-builder /app/next.config.js ./next.config.js
COPY --from=frontend-builder /app/package.json ./package.json

# Copy .env file (create it if it doesn't exist with a placeholder)
# Note: For production, prefer passing env vars at runtime: docker run -e DATABASE_URL=...
COPY frontend/.env ./.env

# Expose port 3000 (Next.js default)
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
# Enable detailed error logging in production
ENV NODE_OPTIONS="--enable-source-maps"

# Environment variables can be overridden at runtime
# Example: docker run -e DATABASE_URL=... -e JWT_SECRET=... your-image
# If not provided at runtime, the .env file will be used (loaded by dotenv)

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start the Next.js server in production mode
CMD ["npm", "start"]
