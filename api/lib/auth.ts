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
    // Gunakan JWT_SECRET dari environment atau fallback yang aman untuk development
    const secret = process.env.JWT_SECRET || 'manabucard_dev_secret_key_2024';
    
    const decoded = jwt.verify(token, secret) as AuthUser;
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

// Helper untuk generate token (jika diperlukan untuk testing)
export function generateToken(userId: string, email: string): string {
  const secret = process.env.JWT_SECRET || 'manabucard_dev_secret_key_2024';
  
  return jwt.sign(
    { userId, email },
    secret,
    { expiresIn: '24h' }
  );
}
