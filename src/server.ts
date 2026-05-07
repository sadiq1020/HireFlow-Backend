import 'dotenv/config';
import { Server } from 'http';
import app from './app';
import logger from './config/logger';

const port = process.env.PORT || 5000;

let server: Server;

async function main() {
  try {
    server = app.listen(port, () => {
      logger.info(`🚀 Server is running on port ${port}`);
      logger.info(`📝 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
  }
}

main();

process.on('unhandledRejection', (error) => {
  logger.error('Unhandled Rejection! Shutting down...', { error });
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception! Shutting down...', { error });
  process.exit(1);
});