const { spawn, exec, execSync } = require('child_process');
const path = require('path');

const FRONTEND_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const BACKEND_PORT = process.env.PORT || 5000;
const FRONTEND_PORT = 3000;

console.log('====================================================');
console.log('🚀 Starting Riddhi Computer Application (Full Stack)');
console.log('====================================================\n');

// Function to auto-free ports if any zombie processes are holding them
function freePort(port) {
  try {
    if (process.platform === 'win32') {
      const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] });
      const lines = output.trim().split('\n');
      const pidsKilled = new Set();
      lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && pid !== '0' && pid !== process.pid.toString() && !pidsKilled.has(pid)) {
          try {
            execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
            pidsKilled.add(pid);
          } catch (e) {}
        }
      });
      if (pidsKilled.size > 0) {
        console.log(`🧹 Cleaned up lingering processes on port ${port}`);
      }
    }
  } catch (e) {
    // Port was already free
  }
}

// 1. Free ports 5000 and 3000
freePort(BACKEND_PORT);
freePort(FRONTEND_PORT);

// 2. Start Backend Server
const backendProcess = spawn('npm run dev', {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, AUTO_STARTED_BY_ROOT: 'true' }
});

// 3. Start Frontend Server
const frontendProcess = spawn('npm run dev', {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, AUTO_STARTED_BY_ROOT: 'true' }
});

// 4. Helper to open default browser
const openBrowser = (url) => {
  const cmd = process.platform === 'win32'
    ? `start "" "${url}"`
    : process.platform === 'darwin'
    ? `open "${url}"`
    : `xdg-open "${url}"`;

  exec(cmd, (err) => {
    if (err) {
      console.log(`⚠️  Could not automatically open browser: ${err.message}`);
    }
  });
};

// Wait 2.5 seconds for servers to start, then open browser to home page
setTimeout(() => {
  console.log(`\n🌐 Opening Home Page: ${FRONTEND_URL}\n`);
  openBrowser(FRONTEND_URL);
}, 2500);

// Graceful cleanup on termination
const cleanExit = () => {
  console.log('\n🛑 Shutting down backend and frontend servers...');
  if (backendProcess) backendProcess.kill();
  if (frontendProcess) frontendProcess.kill();
  freePort(BACKEND_PORT);
  freePort(FRONTEND_PORT);
  process.exit();
};

process.on('SIGINT', cleanExit);
process.on('SIGTERM', cleanExit);
