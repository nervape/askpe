#!/bin/sh
echo "Running Prisma migrations..."
npx prisma migrate deploy
npx prisma generate

echo "Database migrations completed successfully"

# Start the application
exec "$@" 