import axios from 'axios';

// API Configuration from environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8001';
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000;
const DEBUG_API = process.env.REACT_APP_DEBUG_API === 'true';

// Log configuration in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 API Configuration:', {
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    debug: DEBUG_API,
    environment: process.env.REACT_APP_ENVIRONMENT || process.env.NODE_ENV
  });
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
if (DEBUG_API) {
  api.interceptors.request.use(
    (config) => {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
        params: config.params
      });
      return config;
    },
    (error) => {
      console.error('❌ API Request Error:', error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data
      });
      return response;
    },
    (error) => {
      console.error('❌ API Response Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data
      });
      return Promise.reject(error);
    }
  );
}

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Common API functions  
export const apiGet = (endpoint, config = {}) => {
  if (!DEBUG_API) console.log('🔄 API GET:', getApiUrl(endpoint));
  return api.get(endpoint, config);
};

export const apiPost = (endpoint, data, config = {}) => {
  if (!DEBUG_API) console.log('🔄 API POST:', getApiUrl(endpoint));
  return api.post(endpoint, data, config);
};

export const apiPut = (endpoint, data, config = {}) => {
  if (!DEBUG_API) console.log('🔄 API PUT:', getApiUrl(endpoint));
  return api.put(endpoint, data, config);
};

export const apiDelete = (endpoint, config = {}) => {
  if (!DEBUG_API) console.log('🔄 API DELETE:', getApiUrl(endpoint));
  return api.delete(endpoint, config);
};

// Configuration export for external use
export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  debug: DEBUG_API,
  environment: process.env.REACT_APP_ENVIRONMENT || process.env.NODE_ENV
};

// Product-specific API functions
export const getProduct = (id) => apiGet(`/api/products/${id}`);
export const getProducts = (params = {}) => apiGet('/api/products', { params });
export const getProductPrice = (id, caratWeight, params = {}) => 
  apiGet(`/api/products/${id}/price/${caratWeight}`, { params });
export const getProductCarats = (id) => apiGet(`/api/products/${id}/carats`);
export const getFeaturedProducts = (limit = 6) => apiGet(`/api/products/featured?limit=${limit}`);
export const getDiscountedProducts = (limit = 8) => apiGet(`/api/products/discounted?limit=${limit}`);

// Category API functions
export const getCategories = () => apiGet('/api/categories');

// Carat pricing API functions
export const getCaratPricing = () => apiGet('/api/carat-pricing');

export default api; 