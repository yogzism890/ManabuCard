import jwt from 'jsonwebtoken';

export interface AuthUser {
  userId: string;
  email: string;
}

export function verifyToken(token: string): AuthUser | null {
  if (!token) {
    return null;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as AuthUser;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function getUserFromAuthHeader(authHeader: string | null): AuthUser | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  return verifyToken(token);
}