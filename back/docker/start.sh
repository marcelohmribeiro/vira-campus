set -eu

echo "Generating Prisma client..."
npx prisma generate

# echo "Applying Prisma schema..."
# npx prisma db push

echo "Starting API..."
node server.js
