/**
 * ZoneIQ HVAC Fleet Platform - Main Application Entry Point
 * 
 * This server provides the Asset Management & Point Catalogue API.
 * Phase 1: Database & Repository layer - Complete
 * Phase 2: API Controllers & Routes - Complete
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const db = require('./config/database');
const { setupSwagger } = require('./config/swagger');
const { errorHandler } = require('./middleware/errorHandler');
const { paginationMiddleware } = require('./middleware/pagination');

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
const API_PREFIX = process.env.API_PREFIX || '/api';

// ============================================================================
// Middleware Configuration
// ============================================================================

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));

// Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.LOG_FORMAT || 'combined'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Pagination middleware
app.use(paginationMiddleware);

// ============================================================================
// Swagger API Documentation
// ============================================================================

setupSwagger(app);

// ============================================================================
// Health Check & Status Endpoints
// ============================================================================

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'ZoneIQ HVAC Fleet Platform',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get(`${API_PREFIX}/health`, async (req, res) => {
  try {
    // Test database connection
    await db.testConnection();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        api: 'operational',
        database: 'connected',
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        api: 'operational',
        database: 'disconnected',
      },
      error: error.message,
    });
  }
});

// Database status endpoint
app.get(`${API_PREFIX}/status`, async (req, res) => {
  try {
    const result = await db.query('SELECT NOW() as current_time, version() as pg_version');
    const poolStatus = {
      total: db.pool.totalCount,
      idle: db.pool.idleCount,
      waiting: db.pool.waitingCount,
    };
    
    res.json({
      status: 'operational',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        currentTime: result.rows[0].current_time,
        version: result.rows[0].pg_version,
        pool: poolStatus,
      },
    });
  } catch (error) {
    console.error('Status check failed:', error);
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

// ============================================================================
// API Routes
// ============================================================================

app.use(`${API_PREFIX}/portfolios`, require('./routes/portfolios'));
app.use(`${API_PREFIX}/buildings`, require('./routes/buildings'));
app.use(`${API_PREFIX}/floors`, require('./routes/floors'));
app.use(`${API_PREFIX}/zones`, require('./routes/zones'));
app.use(`${API_PREFIX}/devices`, require('./routes/devices'));
app.use(`${API_PREFIX}/points`, require('./routes/points'));
app.use(`${API_PREFIX}/device-profiles`, require('./routes/deviceProfiles'));

// ============================================================================
// Error Handling
// ============================================================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    timestamp: new Date().toISOString(),
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// ============================================================================
// Server Startup & Graceful Shutdown
// ============================================================================

let server;

async function startServer() {
  try {
    // Test database connection
    console.log('Testing database connection...');
    await db.testConnection();
    console.log('✓ Database connection successful');
    
    // Start HTTP server
    server = app.listen(PORT, HOST, () => {
      console.log('');
      console.log('='.repeat(60));
      console.log('  ZoneIQ HVAC Fleet Platform');
      console.log('='.repeat(60));
      console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`  Server:      http://${HOST}:${PORT}`);
      console.log(`  API Docs:    http://${HOST}:${PORT}/api-docs`);
      console.log(`  Health:      http://${HOST}:${PORT}${API_PREFIX}/health`);
      console.log(`  Status:      http://${HOST}:${PORT}${API_PREFIX}/status`);
      console.log('='.repeat(60));
      console.log('  Phase 1: Database & Repository layer - ✓ Complete');
      console.log('  Phase 2: API Controllers & Routes - ✓ Complete');
      console.log('  Phase 3: Business Logic - Pending');
      console.log('='.repeat(60));
      console.log('');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

async function gracefulShutdown(signal) {
  console.log(`\n${signal} received, starting graceful shutdown...`);
  
  if (server) {
    server.close(() => {
      console.log('HTTP server closed');
    });
  }
  
  try {
    await db.close();
    console.log('Database connections closed');
    console.log('Graceful shutdown complete');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
}

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start the server
if (require.main === module) {
  startServer();
}

// Export for testing
module.exports = app;
