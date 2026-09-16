'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = api.getToken();
      if (token) {
        try {
          const data = await api.getMe();
          if (data && data.user) {
            setUser(data.user);
          }
        } catch {
          api.removeToken();
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.user) {
      setUser(res.user);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res.user) {
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const demoLogin = async (role = 'customer') => {
    if (role === 'admin') {
      return login('admin@riddhicomputer.com', 'admin123');
    } else {
      return login('customer@gmail.com', 'customer123');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, demoLogin }}>
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
