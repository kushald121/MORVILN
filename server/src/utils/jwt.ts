import * as jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
}

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
      avatar: user.avatar,
      isVerified: user.isVerified
    }
  };
};