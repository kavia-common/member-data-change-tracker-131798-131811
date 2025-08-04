const app = require('./app');
const cron = require('node-cron');
const { runChangeDetectionJob } = require('./services/changeJob');

// Start scheduled job every 4 hours
cron.schedule('0 */4 * * *', async () => {
  console.log(`[${new Date().toISOString()}] Running scheduled change detection job...`);
  await runChangeDetectionJob();
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = server;
