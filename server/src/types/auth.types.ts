import { Request } from 'express';

export interface AuthUser {
  id: string;
  userId: string;
  email: string;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}