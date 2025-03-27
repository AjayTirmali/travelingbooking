const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Function to safely execute shell commands
function execCommand(command) {
  try {
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Function to check if a directory exists
function directoryExists(dirPath) {
  try {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  } catch (error) {
    return false;
  }
}

// Clean up node_modules
console.log('Cleaning up node_modules folders...');

// Root node_modules
if (directoryExists('./node_modules')) {
  console.log('Removing root node_modules...');
  if (process.platform === 'win32') {
    execCommand('rmdir /s /q node_modules');
  } else {
    execCommand('rm -rf node_modules');
  }
}

// Clean up package-lock.json if it exists
if (fs.existsSync('./package-lock.json')) {
  console.log('Removing root package-lock.json...');
  fs.unlinkSync('./package-lock.json');
}

console.log('Cleanup completed successfully!');
console.log('');
console.log('To reinstall dependencies, run:');
console.log('npm install concurrently --save-dev');
console.log('npm run install:all'); 