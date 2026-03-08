#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔨 Building Employee Leave System...\n');

try {
  const serverDir = path.join(__dirname, 'server');
  const clientDir = path.join(__dirname, 'client');

  // Ensure devDependencies are installed by temporarily unsetting NODE_ENV
  const env = { ...process.env, NODE_ENV: 'development' };

  console.log('📦 Installing server dependencies...');
  execSync('npm install', { cwd: serverDir, stdio: 'inherit', env });
  console.log('✅ Server dependencies installed\n');

  console.log('📦 Installing client dependencies...');
  execSync('npm install', { cwd: clientDir, stdio: 'inherit', env });
  console.log('✅ Client dependencies installed\n');

  // Clear vite caches aggressively
  const cacheDir = path.join(clientDir, 'node_modules', '.vite');
  const tempDir = path.join(clientDir, 'node_modules', '.vite-temp');
  
  [cacheDir, tempDir].forEach(dir => {
    try {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    } catch (e) {
      // Ignore errors
    }
  });

  console.log('📦 Building client application...');
  execSync('npm run build', { cwd: clientDir, stdio: 'inherit' });
  console.log('✅ Client built successfully\n');

  console.log('🎉 Build successful!');
  process.exit(0);
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
