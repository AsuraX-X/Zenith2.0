# Development startup script for Zenith monorepo
# This script starts both the backend and frontend concurrently

Write-Host "🚀 Starting Zenith Development Environment..." -ForegroundColor Green
Write-Host "📁 Working directory: $(Get-Location)" -ForegroundColor Yellow

# Start both backend and frontend concurrently using the new workspace commands
Write-Host "🔧 Starting both backend and frontend servers..." -ForegroundColor Cyan
Write-Host "🎨 Using concurrently for synchronized output..." -ForegroundColor Magenta

# Run the dev command which starts both services
pnpm dev

Write-Host "✅ Development servers have stopped!" -ForegroundColor Green
