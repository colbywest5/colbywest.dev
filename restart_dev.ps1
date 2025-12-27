Write-Host "Stopping all Node.js processes..."
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "All Node processes stopped."

Write-Host "Starting Next.js development server..."
npm run dev
