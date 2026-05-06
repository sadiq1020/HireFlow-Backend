import { Request, Response, NextFunction } from 'express';
import { auth } from '../lib/auth';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  req.user = session.user;
  next();
};
