import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
import { ensureUploadDirs } from './config/upload';
import { seedDatabase } from './scripts/seed';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);
export class Server {
  async start(): Promise<void> {
    ensureUploadDirs();
    await connectDB();
    await seedDatabase();

    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
      console.log(`API available at http://localhost:${env.port}/api`);
    });
  }
}

const server = new Server();
server.start();
