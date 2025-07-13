# Development startup script for Zenith monorepo
# This script starts both the backend and frontend in separate terminals

Write-Host "🚀 Starting Zenith Development Environment..." -ForegroundColor Green
Write-Host "📁 Working directory: $(Get-Location)" -ForegroundColor Yellow

# Start backend in a new PowerShell window
Write-Host "🔧 Starting backend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; pnpm start:backend"

# Wait a moment for backend to initialize
Start-Sleep -Seconds 2

# Start frontend in a new PowerShell window
Write-Host "🎨 Starting frontend development server..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; pnpm run dev"

Write-Host "✅ Both servers are starting up!" -ForegroundColor Green
Write-Host "📝 Backend: Usually runs on http://localhost:3000" -ForegroundColor Yellow
Write-Host "🌐 Frontend: Usually runs on http://localhost:5173" -ForegroundColor Yellow
Write-Host "🔒 Press Ctrl+C in each terminal window to stop the servers" -ForegroundColor Red
