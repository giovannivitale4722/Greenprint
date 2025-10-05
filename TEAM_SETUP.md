# 🚀 Team Setup Guide - Carbon Ledger

This guide ensures all team members can set up the project quickly and consistently across different operating systems.

## 📋 Prerequisites

### All Platforms
- **Node.js 20+** - [Download here](https://nodejs.org/)
- **pnpm 8+** - Install with `npm install -g pnpm`
- **Git** - [Download here](https://git-scm.com/)

### Platform-Specific Requirements

#### 🪟 Windows
- **Docker Desktop** with WSL2 integration enabled
- **WSL2** (Ubuntu) - Install with `wsl --install` in PowerShell as Admin

#### 🍎 macOS
- **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)

#### 🐧 Linux
- **Docker** - `sudo apt install docker.io docker-compose` (Ubuntu/Debian)

## 🛠️ Quick Setup (Choose Your Platform)

### Option 1: Automated Setup (Recommended)

#### Windows (WSL2)
```bash
# Open WSL2 terminal (Ubuntu)
git clone <your-repo-url>
cd Greenprint
./scripts/dev-setup.sh
```

#### Windows (PowerShell/CMD)
```cmd
# Open PowerShell or Command Prompt
git clone <your-repo-url>
cd Greenprint
scripts\dev-setup.bat
```

#### macOS/Linux
```bash
# Open Terminal
git clone <your-repo-url>
cd Greenprint
./scripts/dev-setup.sh
```

### Option 2: Manual Setup

#### Step 1: Clone Repository
```bash
git clone <your-repo-url>
cd Greenprint
```

#### Step 2: Install Dependencies
```bash
pnpm install
```

#### Step 3: Start Database
```bash
# Start with persistent storage
docker compose up -d db

# Wait for database to be ready
sleep 10
```

#### Step 4: Seed Database (First Time Only)
```bash
cd apps/api
DATABASE_URL='postgresql://postgres:postgres@localhost:5432/carbon_ledger?schema=public' npx tsx src/prisma/seeds/seed.ts
cd ../..
```

#### Step 5: Start Development
```bash
pnpm dev
```

## 🎯 Verify Setup

1. **Check Database**: `docker ps` should show `carbon-ledger-db`
2. **Check API**: Visit `http://localhost:4000/health`
3. **Check Web App**: Visit `http://localhost:3000`
4. **Test Login**: Use `demo@carbonledger.com` / `demo123`

## 🔧 Troubleshooting

### Windows Issues

#### Docker Not Found
```bash
# Make sure WSL2 integration is enabled in Docker Desktop
# Settings → Resources → WSL Integration → Enable integration with Ubuntu
```

#### Permission Denied
```bash
# Run WSL2 terminal as Administrator
# Or fix permissions: chmod +x scripts/dev-setup.sh
```

### macOS Issues

#### Docker Permission Denied
```bash
# Add user to docker group
sudo usermod -aG docker $USER
# Log out and back in
```

### Linux Issues

#### Docker Not Running
```bash
# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker
```

#### Port Already in Use
```bash
# Kill processes using ports 3000/4000
sudo lsof -ti:3000 | xargs kill -9
sudo lsof -ti:4000 | xargs kill -9
```

## 🚀 Development Workflow

### Daily Development
```bash
# Start the app (database persists)
pnpm dev
```

### Reset Database (If Needed)
```bash
# Stop database
docker compose down

# Remove volume (WARNING: This deletes all data)
docker volume rm greenprint_carbon-ledger-data

# Restart with fresh database
docker compose up -d db
./scripts/dev-setup.sh
```

### Pull Latest Changes
```bash
git pull
pnpm install  # If package.json changed
```

## 📱 Platform-Specific Notes

### Windows (WSL2)
- Always use WSL2 terminal for development
- Docker Desktop must have WSL2 integration enabled
- File paths use forward slashes in WSL2

### macOS
- May need to allow Docker Desktop through firewall
- Use `sudo` for Docker commands if needed

### Linux
- Ensure user is in docker group
- Some distributions may need `docker-compose` instead of `docker compose`

## 🆘 Getting Help

If setup fails:

1. **Check prerequisites** - All required software installed?
2. **Check Docker** - Is Docker Desktop running?
3. **Check ports** - Are 3000/4000/5432 ports available?
4. **Check logs** - Look at terminal output for specific errors
5. **Ask team** - Someone else might have encountered the same issue

## ✅ Success Indicators

You'll know setup worked when:
- ✅ `docker ps` shows `carbon-ledger-db` running
- ✅ `http://localhost:4000/health` returns `{"status":"ok"}`
- ✅ `http://localhost:3000` shows the login page
- ✅ Login with `demo@carbonledger.com` / `demo123` works
- ✅ Navigation between pages works

---

**Happy coding! 🎉**
