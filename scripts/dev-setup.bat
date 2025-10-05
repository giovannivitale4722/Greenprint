@echo off
REM Development Setup Script for Windows (PowerShell/CMD)
REM Alternative to the bash script for Windows users

echo 🚀 Setting up Carbon Ledger development environment...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop.
    echo    Make sure WSL2 integration is enabled:
    echo    Settings → Resources → WSL Integration → Enable integration with Ubuntu
    pause
    exit /b 1
)

REM Check if WSL2 is available
wsl --list --quiet >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ WSL2 is not available. Please install WSL2:
    echo    Run: wsl --install
    pause
    exit /b 1
)

echo 📦 Starting database with persistent storage...
docker compose up -d db

echo ⏳ Waiting for database to be ready...
timeout /t 10 /nobreak >nul

echo 🔍 Checking if database needs seeding...
for /f %%i in ('docker exec carbon-ledger-db psql -U postgres -d carbon_ledger -t -c "SELECT COUNT(*) FROM users;" 2^>nul ^|^| echo 0') do set USER_COUNT=%%i

if %USER_COUNT%==0 (
    echo 🌱 Database is empty, seeding data...
    cd apps\api
    set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/carbon_ledger?schema=public
    npx tsx src/prisma/seeds/seed.ts
    cd ..\..
    echo ✅ Database seeded successfully!
) else (
    echo ✅ Database already has data, skipping seed.
)

echo.
echo 🎉 Setup complete!
echo.
echo 📋 Next steps:
echo 1. Run: pnpm dev
echo 2. Go to: http://localhost:3000
echo 3. Login with: demo@carbonledger.com / demo123
echo.
echo 💡 Your database data will persist between restarts!
pause
