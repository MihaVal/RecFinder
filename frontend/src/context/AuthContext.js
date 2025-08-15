import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../config/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('rf_token');
    const userData = localStorage.getItem('rf_user');
    return token && userData ? JSON.parse(userData) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('rf_token');
      if (token && !user) {
        try {
          setLoading(true);
          const response = await api.auth.me();
          setUser(response.user);
          localStorage.setItem('rf_user', JSON.stringify(response.user));
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('rf_token');
          localStorage.removeItem('rf_user');
        } finally {
          setLoading(false);
        }
      }
    };

    checkAuth();
  }, [user]);

  async function register(name, email, password) {
    try {
      setLoading(true);
      const response = await api.auth.register({ name, email, password });
      
      localStorage.setItem('rf_token', response.token);
      localStorage.setItem('rf_user', JSON.stringify(response.user));
      setUser(response.user);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function login(email, password) {
    try {
      setLoading(true);
      const response = await api.auth.login({ email, password });
      
      localStorage.setItem('rf_token', response.token);
      localStorage.setItem('rf_user', JSON.stringify(response.user));
      setUser(response.user);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('rf_token');
    localStorage.removeItem('rf_user');
    setUser(null);
  }

  const value = useMemo(() => ({ user, register, login, logout, loading }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
