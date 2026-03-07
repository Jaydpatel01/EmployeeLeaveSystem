#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔨 Building Employee Leave System...\n');

try {
  const serverDir = path.join(__dirname, 'server');
  const clientDir = path.join(__dirname, 'client');

  console.log('📦 Installing server dependencies...');
  execSync('npm ci', { cwd: serverDir, stdio: 'inherit' });
  console.log('✅ Server dependencies installed\n');

  console.log('📦 Installing client dependencies...');
  execSync('npm ci', { cwd: clientDir, stdio: 'inherit' });
  console.log('✅ Client dependencies installed\n');

  // Clear vite cache to prevent stale module resolution issues
  const viteCachePath = path.join(clientDir, 'node_modules', '.vite');
  if (fs.existsSync(viteCachePath)) {
    console.log('🧹 Clearing vite cache...');
    fs.rmSync(viteCachePath, { recursive: true, force: true });
    console.log('✅ Cache cleared\n');
  }

  console.log('📦 Building client application...');
  execSync('npm run build', { cwd: clientDir, stdio: 'inherit' });
  console.log('✅ Client built successfully\n');

  console.log('🎉 Build successful!');
  process.exit(0);
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
