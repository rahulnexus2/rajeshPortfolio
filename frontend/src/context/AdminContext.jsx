import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');

  // Verify token validity on load
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsAdmin(false);
        setEditMode(false);
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get('/api/admin/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.valid) {
          setIsAdmin(true);
        } else {
          // Token invalid, clear it
          logout();
        }
      } catch (err) {
        console.error('Token verification failed:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const login = async (secretKey) => {
    try {
      const response = await axios.post('/api/admin/login', { secretKey });
      const newToken = response.data.token;
      
      localStorage.setItem('adminToken', newToken);
      setToken(newToken);
      setIsAdmin(true);
      setEditMode(true); // Automatically turn on inline editing on login
      return { success: true, message: response.data.message };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please verify your secret key.';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    setIsAdmin(false);
    setEditMode(false);
  };

  const toggleEditMode = () => {
    setEditMode(prev => !prev);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, editMode, loading, token, login, logout, toggleEditMode }}>
      {children}
    </AdminContext.Provider>
  );
};
