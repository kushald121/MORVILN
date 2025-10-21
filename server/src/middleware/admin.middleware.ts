import { Request, Response, NextFunction } from 'express';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // For now, allow all authenticated users to access admin routes
  // You can modify this based on your user structure when you add role support
  if (!req.user) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Authentication required.'
    });
  }

  next();
};