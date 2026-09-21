import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { mockUsers } from '../services/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    // Default demo user: Project Manager
    return mockUsers[1];
  });

  const [token, setToken] = useState(() => localStorage.getItem('access_token') || 'demo-token');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user_profile', JSON.stringify(user));
    } else {
      localStorage.removeItem('user_profile');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await api.login(email, password);
      setUser(data.user);
      setToken(data.access_token);
      localStorage.setItem('access_token', data.access_token);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const switchRole = (role) => {
    const matchedUser = mockUsers.find(u => u.role === role) || mockUsers[0];
    setUser(matchedUser);
    localStorage.setItem('access_token', 'demo-token');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_profile');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout,
      switchRole,
      isAuthenticated: Boolean(user)
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
