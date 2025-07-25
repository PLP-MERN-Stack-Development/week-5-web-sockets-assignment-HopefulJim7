// src/utils/authFetch.js
import { useAuth } from '../context/AuthContext';

export const authFetch = (url, options = {}) => {
  const { user } = useAuth();
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${user?.token}`,
  };

  return fetch(url, { ...options, headers });
};