#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🔨 Building Employee Leave System...\n');

try {
  console.log('📦 Installing server dependencies...');
  execSync('npm ci', {
    cwd: path.join(__dirname, 'server'),
    stdio: 'inherit',
    shell: true,
  });
  console.log('✅ Server dependencies installed\n');

  console.log('📦 Installing client dependencies...');
  execSync('npm ci', {
    cwd: path.join(__dirname, 'client'),
    stdio: 'inherit',
    shell: true,
  });
  console.log('✅ Client dependencies installed\n');

  console.log('📦 Building client application...');
  // Set PATH to include node_modules/.bin
  const clientDir = path.join(__dirname, 'client');
  const env = { ...process.env, PATH: `${path.join(clientDir, 'node_modules', '.bin')}${path.delimiter}${process.env.PATH}` };
  execSync('vite build', {
    cwd: clientDir,
    stdio: 'inherit',
    shell: true,
    env,
  });
  console.log('✅ Client built successfully\n');

  console.log('🎉 Build successful!');
  process.exit(0);
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
