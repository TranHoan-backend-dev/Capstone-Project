// hooks/useAuth.ts
import { useEffect, useState } from "react";

interface User {
  id: string;
  roles: string[];
  email?: string;
  name?: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    accessToken: null,
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Lấy token từ cookie hoặc localStorage
    const getAccessToken = () => {
      // Cách 1: Từ cookie
      const cookies = document.cookie.split(";");
      const tokenCookie = cookies.find((c) =>
        c.trim().startsWith("access_token="),
      );
      if (tokenCookie) {
        return tokenCookie.split("=")[1];
      }

      // Cách 2: Từ localStorage
      return localStorage.getItem("access_token");
    };

    // Lấy user info từ token hoặc từ store
    const getUserFromToken = (token: string) => {
      try {
        // Decode JWT để lấy user info
        const payload = JSON.parse(atob(token.split(".")[1]));
        return {
          id: payload.sub || payload.userId,
          roles: payload.realm_access?.roles || payload.roles || [],
          email: payload.email,
          name: payload.name,
        };
      } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
      }
    };

    const token = getAccessToken();
    if (token) {
      const user = getUserFromToken(token);
      setAuthState({
        accessToken: token,
        user: user,
        isAuthenticated: true,
      });
    }
  }, []);

  return authState;
};
