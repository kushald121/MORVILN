import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

import app from './app';
import { initializeDatabase } from './config/database';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`📧 Email routes: http://localhost:${PORT}/api/email`);
      console.log(`🔐 Auth routes: http://localhost:${PORT}/api/auth`);
      console.log(`💳 Payment routes: http://localhost:${PORT}/api/payments`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();