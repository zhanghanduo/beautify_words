#!/usr/bin/env node

const path = require('path');
const { execSync } = require('child_process');

console.log('Starting Word Card Generator...');

// Change to the word-card-generator directory and run the appropriate command
const projectDir = path.join(__dirname, 'word-card-generator');

try {
  // Check if we're in development or production mode
  const isDev = process.env.NODE_ENV !== 'production';
  
  if (isDev) {
    console.log('Running in development mode...');
    execSync('npm run dev', { cwd: projectDir, stdio: 'inherit' });
  } else {
    console.log('Building and starting production server...');
    execSync('npm run build && npm run preview', { cwd: projectDir, stdio: 'inherit' });
  }
} catch (error) {
  console.error('Error starting the application:', error.message);
  process.exit(1);
} 