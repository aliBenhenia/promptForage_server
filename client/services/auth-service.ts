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
    localStorage.setItem('email', response.data.user.email);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    console.log('Login response:', response.data.user);
    localStorage.setItem('token', response.data.token);
    return response.data;

    
  },
  
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    // In a real implementation, this would call the backend API
    // For now, we'll use a simulated response
    
    // Uncomment below when backend is ready
    // const response = await api.post('/auth/register', credentials);
    // return response.data;
    
    // Mock implementation
    const response = await api.post('/api/auth/register', credentials);
    localStorage.setItem('email', response.data.user.email);
    return response.data;
  },
  
  async getCurrentUser(): Promise<User> {
    // In a real implementation, this would call the backend API
    // For now, we'll use a simulated response
    
    // Uncomment below when backend is ready
    const response = await api.get('/api/auth/me');
    return response.data;
    
  },
};