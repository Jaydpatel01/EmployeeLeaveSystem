#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔨 Building Employee Leave System...\n');

const commands = [
  { desc: 'Installing server dependencies', cmd: 'npm ci', cwd: 'server' },
  { desc: 'Installing client dependencies', cmd: 'npm ci', cwd: 'client' },
  { desc: 'Building client application', cmd: 'npm run build', cwd: 'client' },
];

try {
  for (const { desc, cmd, cwd } of commands) {
    console.log(`📦 ${desc}...`);
    execSync(cmd, {
      cwd: path.join(__dirname, cwd),
      stdio: 'inherit',
    });
    console.log(`✅ ${desc} complete\n`);
  }
  console.log('🎉 Build successful!');
  process.exit(0);
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
