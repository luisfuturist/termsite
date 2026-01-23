# Build stage
FROM node:20-slim AS builder

# Install build dependencies for native modules (node-pty)
RUN apt-get update && \
    apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm@10.14.0

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

# Install openssh-client for key generation
RUN apt-get update && \
    apt-get install -y openssh-client && \
    rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm@10.14.0

WORKDIR /app

# Copy built application and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Create a startup script that generates host key if it doesn't exist
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
# Generate host key if it does not exist\n\
if [ ! -f /app/host.key ]; then\n\
  echo "Generating SSH host key..."\n\
  ssh-keygen -t ed25519 -f /app/host.key -N "" -C "termsite-host-key"\n\
  echo "Host key generated successfully"\n\
fi\n\
\n\
# Start the server\n\
exec node dist/server/main.js\n\
' > /app/start.sh && chmod +x /app/start.sh

EXPOSE 2222

CMD ["/app/start.sh"]
