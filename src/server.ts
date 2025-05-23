import app from './app';
import { config } from 'dotenv';
import { connectDB } from './config/database';

config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1); // exit if DB connection fails
  }
};

startServer();
