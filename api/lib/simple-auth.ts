export interface AuthUser {
  userId: string;
  email: string;
}

// Simple authentication untuk development
// Format header: "Bearer userId:email" atau "userId:email"
export function getUserFromAuthHeader(authHeader: string | null): AuthUser | null {
  if (!authHeader) return null;
  
  // Format: "Bearer userId:email" atau "userId:email"
  const cleanHeader = authHeader.replace('Bearer ', '');
  const [userId, email] = cleanHeader.split(':');
  
  if (userId && email) {
    return { userId, email };
  }
  
  return null;
}

// Fallback untuk development - return default user jika tidak ada header
export function getDefaultUser(): AuthUser {
  return {
    userId: "550e8400-e29b-41d4-a716-446655440000",
    email: "test@manabucard.com"
  };
}

// Helper function yang mencoba header dulu, fallback ke default
export function getUserOrDefault(authHeader: string | null): AuthUser {
  return getUserFromAuthHeader(authHeader) || getDefaultUser();
}
