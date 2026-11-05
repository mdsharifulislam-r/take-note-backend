import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import routes from './routes';
import { globalErrorHandler, notFoundHandler } from './middlewares/error.middleware';
import { env } from './config/env';

export class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(helmet({ contentSecurityPolicy: false }));
    this.app.use(cors());
    this.app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use('/uploads', express.static(path.join(process.cwd(), env.uploadRoot)));
  }

  private initializeRoutes(): void {
    this.app.get('/api/health', (_req, res) => {
      res.json({ success: true, message: 'API is running.' });
    });

    this.app.use('/api', routes);
  }

  private initializeErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(globalErrorHandler);
  }
}

export default new App().app;
