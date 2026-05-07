import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { authRateLimiter, globalRateLimiter } from './config/rateLimiter';
import { auth } from './lib/auth';
import adminRoutes from './modules/admin/admin.route';
import applicationRoutes from './modules/application/application.route';
import categoryRoutes from './modules/category/category.route';
import companyRoutes from './modules/company/company.route';
import jobRoutes from './modules/job/job.route';
import savedJobRoutes from './modules/saved-job/savedJob.route';
import userRoutes from './modules/user/user.route';
import globalErrorHandler from './shared/globalErrorHandler';

const app: Application = express();

// Middlewares
app.use(
  cors({
    origin: process.env.APP_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global rate limiter — applies to all routes
app.use(globalRateLimiter);

// Better Auth — stricter rate limit on auth routes
app.use('/api/auth', authRateLimiter);
app.all('/api/auth/*splat', toNodeHandler(auth));

// Application Routes
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/saved-jobs', savedJobRoutes);
app.use('/api/v1/admin', adminRoutes);

// Health check
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to HireFlow API',
  });
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;