import api from '@/lib/api';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '@/types/user';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // In a real implementation, this would call the backend API
    // For now, we'll use a simulated response
    
    // Uncomment below when backend is ready
    // const response = await api.post('/auth/login', credentials);
    // return response.data;
    
    // Mock implementation
    const response = await api.post('/api/auth/login', credentials);
    return response.data;

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            id: '1',
            name: 'Test User',
            email: credentials.email,
            requestsUsed: 0,
            requestLimit: 1000,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: 'mock-jwt-token',
        });
      }, 500);
    });
  },
  
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    // In a real implementation, this would call the backend API
    // For now, we'll use a simulated response
    
    // Uncomment below when backend is ready
    // const response = await api.post('/auth/register', credentials);
    // return response.data;
    
    // Mock implementation
    const response = await api.post('/api/auth/register', credentials);
    return response.data;
  },
  
  async getCurrentUser(): Promise<User> {
    // In a real implementation, this would call the backend API
    // For now, we'll use a simulated response
    
    // Uncomment below when backend is ready
    // const response = await api.get('/auth/me');
    // return response.data;
    
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          name: 'Test User',
          email: 'user@example.com',
          requestsUsed: 125,
          requestLimit: 1000,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }, 500);
    });
  },
};