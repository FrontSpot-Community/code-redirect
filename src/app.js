const db = require('./boundaries/database');
const rest = require('./boundaries/rest');
const expressApp = require('./boundaries/rest');
const logger = require('./services/logger');
const config = require('../configuration');

process.on('SIGUSER1', () => {
  logger.info('Received debug signal SIGUSER1');
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection: %o', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.log('error', 'Unhandled Exception: %o', error);
  process.exit(1);
});

process.on('warning', (error) => {
  logger.error('Warning detected: %o', error);
});

process.on('exit', (code) => {
  logger.info('Stopped with code: %o', code);
});

async function bootstrup() {
  logger.info('Starting...');

  ['SIGTERM', 'SIGINT', 'SIGHUP'].forEach(sigEvent => {
    process.on(sigEvent, () => this.stop());
  })

  try {
    await start();
  } catch (error) {
    logger.error('Error during startup: %o', error);
    process.exit(1);
  }

  logger.info('Started');
}

async function distruct() {
  logger.info('Stopping...');

  const timeoutId = setTimeout(() => {
    logger.error('Stopped forcefully, awaiting Event Loop');
    process.exit(1);
  }, config.get('shutdownTimeout'));

  try {
    await stop();
    timeoutId.unref();
  } catch (error) {
    logger.error('Error during shutdown: %o', error);
    process.exit(1);
  }
}

async function start() {
  await db.start();
  await rest.start();
}

async function stop() {
  await rest.stop();
  await db.stop();
}

module.exports = {
  start: bootstrup,
  stop: distruct
}
