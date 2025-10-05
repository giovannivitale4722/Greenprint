#!/bin/bash

# Development Setup Script - Cross-platform compatible
# Works on: Windows (WSL2), macOS, Linux

set -e

echo "🚀 Setting up Carbon Ledger development environment..."

# Detect OS
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "🪟 Windows detected - make sure you're running in WSL2"
    echo "   If not, open WSL2 terminal and run this script again"
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "   On macOS: Open Docker Desktop from Applications"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        echo "   On Windows: Make sure WSL2 integration is enabled in Docker Desktop"
        echo "   Settings → Resources → WSL Integration → Enable integration with Ubuntu"
    else
        echo "   On Linux: Run 'sudo systemctl start docker'"
    fi
    exit 1
fi

# Start database with persistent volume
echo "📦 Starting database with persistent storage..."
docker compose up -d db

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Check if database needs seeding
echo "🔍 Checking if database needs seeding..."
USER_COUNT=$(docker exec carbon-ledger-db psql -U postgres -d carbon_ledger -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null || echo "0")

if [ "$USER_COUNT" -eq "0" ]; then
    echo "🌱 Database is empty, seeding data..."
    cd apps/api
    DATABASE_URL='postgresql://postgres:postgres@localhost:5432/carbon_ledger?schema=public' npx tsx src/prisma/seeds/seed.ts
    cd ../..
    echo "✅ Database seeded successfully!"
else
    echo "✅ Database already has data, skipping seed."
fi

echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Run: pnpm dev"
echo "2. Go to: http://localhost:3000"
echo "3. Login with: demo@carbonledger.com / demo123"
echo ""
echo "💡 Your database data will persist between restarts!"
