import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

const start = async () => {
  await connectDB();

  app.listen(Number(env.PORT), () => {
    console.log(`🚀 TechPath API running on http://localhost:${env.PORT}`);
    console.log(`📚 Environment: ${env.NODE_ENV}`);
  });
};

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
