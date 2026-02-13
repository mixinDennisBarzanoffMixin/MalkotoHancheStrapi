FROM node:22-bookworm-slim

WORKDIR /srv/app

# Install bun (works on Debian)
RUN curl -fsSL https://bun.sh/install | bash && \
  mv /root/.bun/bin/bun /usr/local/bin/ && \
  rm -rf /root/.bun

# Copy only package files first — this is the most cacheable layer
COPY package*.json bun.lock ./

# Install dependencies with bun
RUN bun install --frozen-lockfile 2>/dev/null || bun install

# Now copy the rest of your app
COPY . .

# Expose port
EXPOSE 1337

# Build the project (must run at build time for Strapi admin)
RUN bun run build

# Start the app (production mode)
ENV NODE_ENV=production
CMD ["bun", "run", "start"]
