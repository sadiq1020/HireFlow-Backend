import { Server } from 'http';
import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 5000;

let server: Server;

async function main() {
  try {
    server = app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

main();

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
  console.log('Unhandled Rejection! Shutting down...');
  if (server) {
    server.close(() => {
      console.error(error);
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.log('Uncaught Exception! Shutting down...');
  console.error(error);
  process.exit(1);
});
