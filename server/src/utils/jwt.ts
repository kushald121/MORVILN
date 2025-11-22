import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  id?: string; // Make id optional for backward compatibility
}

// Password hashing
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Password verification
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn } as any);
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.verify(token, secret) as TokenPayload;
};

export const generateAuthResponse = (user: any) => {
  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    name: user.name
  };

  const token = generateToken(tokenPayload);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatarUrl || user.avatar_url,
      isVerified: user.isVerified || user.is_verified,
      provider: user.provider
    }
  };
};