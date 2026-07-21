#!/bin/bash
set -e

echo "🔨 Building Next.js app..."
cd /var/www/serwell
rm -rf .next && NODE_ENV=production npm run build

echo "📦 Copying static assets to standalone folder..."
cp -r /var/www/serwell/.next/static /var/www/serwell/.next/standalone/.next/static
cp -r /var/www/serwell/public /var/www/serwell/.next/standalone/public

echo "🔁 Restarting PM2 process..."
pm2 restart serwell

echo "✅ Deploy complete!"
