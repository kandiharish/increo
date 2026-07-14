import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth';
import type { UserMe } from '../services/auth';

interface AuthContextType {
  user: UserMe | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserMe | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('increo_token');
    if (savedToken) {
      setToken(savedToken);
      authService
        .getMe(savedToken)
        .then((profile) => setUser(profile))
        .catch(() => {
          localStorage.removeItem('increo_token');
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authService.login(email, password);
    localStorage.setItem('increo_token', data.access_token);
    setToken(data.access_token);
    
    // Fetch profile
    const profile = await authService.getMe(data.access_token);
    setUser(profile);
  };

  const logout = () => {
    localStorage.removeItem('increo_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
