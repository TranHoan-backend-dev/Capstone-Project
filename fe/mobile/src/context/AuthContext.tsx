import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import authService, { LoginResponse } from '../services/auth.service';
import { apiFetch, setLogoutHandler } from '../services/api';

interface AuthContextType {
  user: LoginResponse['user'] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session on app start
    const initAuth = async () => {
      // Register global logout handler to sync UI with API 401 failures
      // This is crucial because apiFetch might discover the session is dead
      // and we need the UI to update immediately.
      setLogoutHandler(() => {
        setUser(null);
        setIsAuthenticated(false);
      });

      try {
        const currentUser = await authService.getCurrentUser();
        const hasToken = await authService.isAuthenticated();

        if (currentUser && hasToken) {
          // Proactively verify the session. This will trigger 401 refresh in apiFetch if needed.
          try {
            console.log('[AuthContext] Proactively verifying session...');
            // Calling /auth/me to verify token and potentially trigger refresh
            await apiFetch('/auth/me'); 
            setUser(currentUser);
            setIsAuthenticated(true);
          } catch (e) {
            console.warn('[AuthContext] Session invalid or refresh failed during init:', e);
            // Storage is already cleared and logoutHandler already called by apiFetch if refresh failed
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    console.log("[AuthContext] start logging in")
    const data = await authService.login(email, password);
    setUser(data.user);
    console.log("[AuthContext] User: " + JSON.stringify(data.user));
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
