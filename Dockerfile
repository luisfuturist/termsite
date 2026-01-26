# Build stage
FROM node:20-slim AS builder

# Install build dependencies for native modules (node-pty)
RUN apt-get update && \
    apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm (updated to fix CVE-2025-69262, CVE-2025-69263, CVE-2025-69264)
RUN npm install -g pnpm@10.27.0

WORKDIR /app

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Manually build node-pty since pnpm blocks build scripts
RUN cd node_modules/.pnpm/node-pty@1.1.0/node_modules/node-pty && \
    npm install -g node-gyp && \
    node-gyp rebuild

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM node:20-slim

# Install security updates
RUN apt-get update && \
    apt-get upgrade -y && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN groupadd -r termsite && useradd -r -g termsite -s /bin/false termsite

# Install pnpm
RUN npm install -g pnpm@10.27.0

WORKDIR /app

# Copy package files first
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./

# Install ONLY production dependencies (no dev deps)
RUN pnpm install --prod --frozen-lockfile && \
    pnpm store prune

# Copy built application
COPY --from=builder /app/dist ./dist

# Copy node-pty binary (required native module)
COPY --from=builder /app/node_modules/.pnpm/node-pty@1.1.0/node_modules/node-pty ./node_modules/.pnpm/node-pty@1.1.0/node_modules/node-pty

# Change ownership to non-root user
RUN chown -R termsite:termsite /app

# Switch to non-root user
USER termsite

EXPOSE 2222

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('net').connect(2222, 'localhost').on('connect', () => process.exit(0)).on('error', () => process.exit(1))"

CMD ["node", "dist/server/main.js"]
