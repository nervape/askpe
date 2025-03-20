#!/bin/sh
set -e

# Check if schema exists in volume
if [ ! -f "/app/prisma/schema.prisma" ]; then
  echo "Copying Prisma schema files to volume..."
  # Copy schema files from image to volume
  cp -r /app/prisma-schema/* /app/prisma/
fi

echo "Running Prisma migrations..."
NODE_ENV=production npx prisma migrate deploy

echo "Database migrations completed successfully"

# Start the application
exec "$@" 