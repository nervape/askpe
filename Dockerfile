FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
# Install SQLite for Prisma
RUN apk add --no-cache openssl sqlite
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install SQLite for Prisma
RUN apk add --no-cache openssl sqlite

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

# Generate Prisma Client during build
RUN npx prisma generate
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install SQLite for Prisma
RUN apk add --no-cache openssl sqlite

COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy scripts directory
COPY --chown=nextjs:nodejs scripts ./scripts/
RUN chmod +x ./scripts/migrate.sh

# Copy prisma schema and migrations
COPY --chown=nextjs:nodejs prisma ./prisma-schema/
# Create directory for database
RUN mkdir -p /app/prisma
RUN chown -R nextjs:nodejs /app/prisma
RUN chmod -R 777 /app/prisma

# Copy scripts and entrypoint
COPY --chown=nextjs:nodejs scripts/entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Copy .env files (will be overridden by mounted volumes in production)
COPY --chown=nextjs:nodejs .env* ./

# Create a health check route
RUN echo '{ "status": "ok" }' > /app/public/health.json
RUN chown nextjs:nodejs /app/public/health.json

USER nextjs

EXPOSE 3000
EXPOSE 3001

ENV PORT 3000
ENV SOCKET_PORT 3001
ENV HOSTNAME "0.0.0.0"

# Using entrypoint script and server.js from Next.js standalone output
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["node", "server.js"] 