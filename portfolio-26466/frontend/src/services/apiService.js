import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  setAuthToken(token) {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.client.defaults.headers.common['Authorization'];
    }
  }

  setApiKey(apiKey) {
    if (apiKey) {
      this.client.defaults.headers.common['X-API-Key'] = apiKey;
    } else {
      delete this.client.defaults.headers.common['X-API-Key'];
    }
  }

  clearAuthToken() {
    delete this.client.defaults.headers.common['Authorization'];
    delete this.client.defaults.headers.common['X-API-Key'];
  }

  // Generic HTTP methods
  async get(url, config = {}) {
    return this.client.get(url, config);
  }

  async post(url, data = {}, config = {}) {
    return this.client.post(url, data, config);
  }

  async put(url, data = {}, config = {}) {
    return this.client.put(url, data, config);
  }

  async patch(url, data = {}, config = {}) {
    return this.client.patch(url, data, config);
  }

  async delete(url, config = {}) {
    return this.client.delete(url, config);
  }

  // Portfolio specific methods
  async getPortfolios(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/portfolio?${queryString}`);
  }

  async getPortfolio(id) {
    return this.get(`/portfolio/${id}`);
  }

  async createPortfolio(data) {
    return this.post('/portfolio', data);
  }

  async updatePortfolio(id, data) {
    return this.put(`/portfolio/${id}`, data);
  }

  async deletePortfolio(id) {
    return this.delete(`/portfolio/${id}`);
  }

  async getPublicPortfolios(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.get(`/portfolio/public/all?${queryString}`);
  }

  // Health check
  async healthCheck() {
    return this.get('/health');
  }
}

export const apiService = new ApiService();
