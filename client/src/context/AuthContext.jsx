// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function with JWT fetch
  const login = async (username, password) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (data.token) {
        const loggedInUser = { username, token: data.token };
        setUser(loggedInUser);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        return true;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('[Auth] Login error:', err);
      return false;
    }
  };

  // Logout and cleanup
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Expose auth utilities
  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user?.token
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for easy access
export const useAuth = () => useContext(AuthContext);