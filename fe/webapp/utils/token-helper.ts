/**
 * Lấy access token từ cookies (client-side)
 */
export const getAccessTokenFromCookie = (): string | null => {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === "access_token" || key === "__Secure-access_token") {
      return decodeURIComponent(value);
    }
  }
  return null;
};

/**
 * Lấy refresh token từ cookies (client-side)
 */
export const getRefreshTokenFromCookie = (): string | null => {
  if (typeof document === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === "refresh_token" || key === "__Secure-refresh_token") {
      return decodeURIComponent(value);
    }
  }
  return null;
};

/**
 * Extract user ID từ JWT token
 */
export const extractUserIdFromToken = (token: string): string | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const decoded = JSON.parse(atob(parts[1]));
    return decoded.sub || decoded.user_id || decoded.userId || null;
  } catch {
    return null;
  }
};

/**
 * Check token expiration
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;

    const decoded = JSON.parse(atob(parts[1]));
    const expiration = decoded.exp;

    if (!expiration) return false;

    return Date.now() >= expiration * 1000;
  } catch {
    return true;
  }
};
