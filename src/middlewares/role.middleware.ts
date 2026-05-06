import { Request, Response, NextFunction } from 'express';
import { TRole } from '../shared/roles.types';

export const roleMiddleware = (...requiredRoles: TRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;

    if (!user || !requiredRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have the required permissions',
      });
    }

    next();
  };
};
