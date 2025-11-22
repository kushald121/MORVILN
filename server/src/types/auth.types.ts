import { Request } from 'express';

export interface AuthUser {
  userId: string;
  email: string;
  name: string;
  id?: string; // Make id optional for backward compatibility
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}