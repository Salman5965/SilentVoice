import axios from "axios";
import { API_BASE_URL, LOCAL_STORAGE_KEYS } from "@/utils/constant";

class ApiService {
  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor to add auth token
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for global error handling
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Clear auth data on unauthorized
          localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.USER_DATA);
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  async get(url, config) {
    const response = await this.instance.get(url, config);
    return response.data;
  }

  async post(url, data, config) {
    const response = await this.instance.post(url, data, config);
    return response.data;
  }

  async put(url, data, config) {
    const response = await this.instance.put(url, data, config);
    return response.data;
  }

  async patch(url, data, config) {
    const response = await this.instance.patch(url, data, config);
    return response.data;
  }

  async delete(url, config) {
    const response = await this.instance.delete(url, config);
    return response.data;
  }

  setAuthToken(token) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN, token);
    this.instance.defaults.headers.Authorization = `Bearer ${token}`;
  }

  clearAuthToken() {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
    delete this.instance.defaults.headers.Authorization;
  }
}

export const apiService = new ApiService();
export default apiService;
