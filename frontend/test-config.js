#!/usr/bin/env node

/**
 * Configuration Test Script
 * Tests the environment variable loading for different scenarios
 */

const fs = require('fs');
const path = require('path');

// Simple env parser (similar to what React uses)
function parseEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  
  const content = fs.readFileSync(filePath, 'utf8');
  const vars = {};
  
  content.split('\n').forEach(line => {
    const match = line.match(/^([^#][^=]*?)=(.*)$/);
    if (match) {
      const [, key, value] = match;
      vars[key.trim()] = value.trim();
    }
  });
  
  return vars;
}

// Load different env files
const envFiles = [
  '.env',
  '.env.local',
  '.env.development',
  '.env.production'
];

console.log('🔧 Environment Configuration Test\n');

envFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`📄 ${file}:`);
    const vars = parseEnv(filePath);
    Object.entries(vars)
      .filter(([key]) => key.startsWith('REACT_APP_'))
      .forEach(([key, value]) => {
        console.log(`   ${key} = ${value}`);
      });
    console.log('');
  } else {
    console.log(`❌ ${file}: Not found\n`);
  }
});

// Test scenarios
console.log('🧪 Test Scenarios:\n');

console.log('1. Default Development:');
console.log('   REACT_APP_API_BASE_URL = http://localhost:8001');
console.log('   REACT_APP_DEBUG_API = true\n');

console.log('2. Change Port (edit .env.local):');
console.log('   REACT_APP_API_BASE_URL = http://localhost:9000\n');

console.log('3. Production Build:');
console.log('   npm run build (uses .env.production values)\n');

console.log('4. Temporary Override:');
console.log('   REACT_APP_API_BASE_URL=http://localhost:9000 npm start\n');

console.log('💡 Tips:');
console.log('- Restart dev server after changing .env files');
console.log('- Check browser console for "🔧 API Configuration" logs');
console.log('- Use .env.local for personal overrides (gitignored)');
console.log('- All React env vars must start with REACT_APP_'); 