import { useState, useEffect, useContext, createContext } from 'react';
import useApi from './useApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { get, post } = useApi();

  const setToken = (newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
    setTokenState(newToken);
  };

  const login = async (username, password) => {
    const result = await post('/account/login', { username, password });
    
    if (result.success) {
      setToken(result.data.token);
      return { success: true };
    }
    
    return { success: false, error: result.error };
  };

  const signup = async (username, password) => {
    const result = await post('/account/signup', { username, password });
    return result;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const fetchUserInfo = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    const result = await get('/account/userinfo', token);
    
    if (result.success) {
      setUser(result.data[0]);
    } else {
      console.error('Failed to fetch user info:', result.error);
      if (result.error.includes('無効') || result.error.includes('無許可')) {
        logout();
      }
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchUserInfo();
  }, [token]);

  const value = {
    token,
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!token && !!user,
    hasRole: (role) => user?.role === role,
    hasAnyRole: (roles) => roles.includes(user?.role)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};