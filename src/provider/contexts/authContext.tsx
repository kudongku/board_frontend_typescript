'use client';

import { LoginResponse } from '@/api/auth/types';
import { useRouter } from 'next/navigation';
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
  useCallback,
} from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  currentUsername: string;
  loginState: (loginResponse: LoginResponse) => void;
  logoutState: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');
    if (token) {
      setIsLoggedIn(true);
    }
    if (username) {
      setCurrentUsername(username);
    }
  }, []);

  const loginState = useCallback((loginResponse: LoginResponse) => {
    localStorage.setItem('accessToken', loginResponse.accessToken);
    localStorage.setItem('refreshToken', loginResponse.refreshToken);
    localStorage.setItem('username', loginResponse.username);
    setIsLoggedIn(true);
    setCurrentUsername(loginResponse.username);
  }, []);

  const logoutState = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setCurrentUsername('');
    router.push('/');
  }, [router]);

  const value = useMemo(
    () => ({ isLoggedIn, loginState, logoutState, currentUsername }),
    [isLoggedIn, loginState, logoutState, currentUsername],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
