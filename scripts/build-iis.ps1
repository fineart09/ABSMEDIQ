Param(
  [string]$ZipName = "ABSMEDIQ-iis.zip"
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$distDir = Join-Path $repoRoot "dist"
$publicWebConfig = Join-Path $repoRoot "public\web.config"
$zipPath = Join-Path $repoRoot $ZipName

Write-Host "Building Vite app..." -ForegroundColor Cyan
Push-Location $repoRoot
try {
  npm run -s build
  if ($LASTEXITCODE -ne 0) {
    throw "npm run build failed with exit code $LASTEXITCODE"
  }
} finally {
  Pop-Location
}

if (!(Test-Path $distDir)) {
  throw "Build output not found: $distDir"
}

# Ensure web.config is present in dist for IIS (Vite should copy from public/, but keep this as a safety net)
$distWebConfig = Join-Path $distDir "web.config"
if (!(Test-Path $distWebConfig) -and (Test-Path $publicWebConfig)) {
  Copy-Item -Force $publicWebConfig $distWebConfig
}

if (Test-Path $zipPath) {
  Remove-Item -Force $zipPath
}

Write-Host "Packaging IIS artifact: $ZipName" -ForegroundColor Cyan
Compress-Archive -Path (Join-Path $distDir "*") -DestinationPath $zipPath -Force

Write-Host "Done." -ForegroundColor Green
Write-Host "- IIS deploy folder: $distDir"
Write-Host "- IIS deploy zip:     $zipPath"
