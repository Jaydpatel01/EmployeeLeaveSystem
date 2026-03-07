#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

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

  console.log('📦 Building client application...');
  execSync('npm run build', { cwd: clientDir, stdio: 'inherit' });
  console.log('✅ Client built successfully\n');

  console.log('🎉 Build successful!');
  process.exit(0);
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
