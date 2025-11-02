import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_DOMAIN || 'http://localhost:3001';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiCall = useCallback(async (config) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios({
        baseURL: API_BASE_URL,
        timeout: 10000,
        ...config
      });
      
      return { data: response.data, success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'エラーが発生しました';
      
      setError(errorMessage);
      return { error: errorMessage, success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((url, token = null, params = {}) => {
    return apiCall({
      method: 'GET',
      url,
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  }, [apiCall]);

  const post = useCallback((url, data = {}, token = null) => {
    return apiCall({
      method: 'POST',
      url,
      data,
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  }, [apiCall]);

  const put = useCallback((url, data = {}, token = null) => {
    return apiCall({
      method: 'PUT',
      url,
      data,
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  }, [apiCall]);

  const del = useCallback((url, token = null) => {
    return apiCall({
      method: 'DELETE',
      url,
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  }, [apiCall]);

  return {
    loading,
    error,
    get,
    post,
    put,
    delete: del,
    clearError: () => setError(null)
  };
};

export default useApi;