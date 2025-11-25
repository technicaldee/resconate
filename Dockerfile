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

# Install all dependencies (dev mode needs dev dependencies)
RUN npm install

# Copy frontend source files (needed for dev mode)
COPY frontend/ ./

# Copy built application from builder stage (for optimization)
COPY --from=frontend-builder /app/.next ./.next

# Expose port 3000 (Next.js default)
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=development
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start the Next.js server in dev mode for better error logging
CMD ["npm", "run", "dev"]
