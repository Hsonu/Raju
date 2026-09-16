const path = require('path');
const { spawn, exec, execSync } = require('child_process');
const os = require('os');
const fs = require('fs');
const net = require('net');
const dotenv = require('dotenv');
dotenv.config();
dotenv.config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Connect to MongoDB
connectDB();

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
}));
app.use(cors({
  origin: (origin, callback) => {
    // Allow any localhost, local network IP, or direct app requests
    callback(null, true);
  },
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Rate limiting
app.use('/api', apiLimiter);

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/repairs', require('./routes/repairs'));
app.use('/api/services', require('./routes/services'));
app.use('/api/videos', require('./routes/videos'));
app.use('/api', require('./routes/misc')); // coupons, banners, reviews, contact
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Riddhi Computer API is running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Helper: Check if a port is already in use
const isPortInUse = (port) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let status = false;

    socket.setTimeout(400);
    socket.on('connect', () => {
      status = true;
      socket.destroy();
    });
    socket.on('timeout', () => {
      socket.destroy();
    });
    socket.on('error', () => {
      // Port is free
    });
    socket.on('close', () => {
      resolve(status);
    });

    socket.connect(port, '127.0.0.1');
  });
};

let frontendProcess = null;

// Helper: Auto-start frontend if running backend independently
const ensureFrontendRunning = async () => {
  if (process.env.AUTO_STARTED_BY_ROOT === 'true') {
    return;
  }

  const inUse = await isPortInUse(3000);
  if (!inUse) {
    const frontendDir = path.join(__dirname, '..', 'frontend');
    if (fs.existsSync(frontendDir)) {
      console.log('⚡ Auto-starting Frontend (Next.js) on http://localhost:3000...\n');
      const frontendEnv = { ...process.env, PORT: '3000', AUTO_STARTED_BY_BACKEND: 'true' };
      frontendProcess = spawn('npm run dev -- -p 3000', {
        cwd: frontendDir,
        stdio: 'inherit',
        shell: true,
        env: frontendEnv
      });

      frontendProcess.on('error', (err) => {
        console.error('⚠️  Failed to start frontend process:', err.message);
      });
    }
  } else {
    console.log('🌐 Frontend is already running on http://localhost:3000\n');
  }
};

// Helper: Open default browser
const openBrowser = (url) => {
  const cmd = process.platform === 'win32'
    ? `start "" "${url}"`
    : process.platform === 'darwin'
      ? `open "${url}"`
      : `xdg-open "${url}"`;

  exec(cmd, (err) => {
    if (err) {
      console.log(`⚠️  Could not auto-open browser: ${err.message}`);
    }
  });
};

// Open home page on server start (with debounce for nodemon reloads)
const autoOpenHome = () => {
  if (process.env.AUTO_STARTED_BY_ROOT === 'true') {
    return;
  }

  const frontendUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.FRONTEND_URL || 'http://localhost:3000';
  const lockFilePath = path.join(os.tmpdir(), 'riddhi_browser_opened.lock');

  let isRecentRestart = false;
  try {
    if (fs.existsSync(lockFilePath)) {
      const lastOpen = parseInt(fs.readFileSync(lockFilePath, 'utf-8'), 10);
      if (Date.now() - lastOpen < 15000) {
        isRecentRestart = true;
      }
    }
  } catch (e) { }

  if (!isRecentRestart) {
    try { fs.writeFileSync(lockFilePath, Date.now().toString()); } catch (e) { }
    console.log(`🌐 Opening website in browser: ${frontendUrl}\n`);
    setTimeout(() => openBrowser(frontendUrl), 3000);
  }
};

// Cleanup spawned frontend on shutdown
const cleanExit = () => {
  if (frontendProcess && frontendProcess.pid) {
    try {
      if (process.platform === 'win32') {
        execSync(`taskkill /pid ${frontendProcess.pid} /T /F`, { stdio: 'ignore' });
      } else {
        frontendProcess.kill('SIGTERM');
      }
    } catch (e) { }
  }
  process.exit();
};

process.on('SIGINT', cleanExit);
process.on('SIGTERM', cleanExit);

const server = app.listen(PORT, async () => {
  console.log(`\n====================================================`);
  console.log(`🚀 Riddhi Computer Backend & Full-Stack System`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Backend API: http://localhost:${PORT}`);
  console.log(`   Frontend UI: http://localhost:3000`);
  console.log(`====================================================\n`);

  await ensureFrontendRunning();
  autoOpenHome();
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use by another running process.`);
    console.error(`👉 Tip: Stop the other running server or close running node processes.\n`);
  } else {
    console.error(`\n❌ Server error: ${err.message}\n`);
  }
});



