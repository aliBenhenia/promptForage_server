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
  async get2FAStatus(): Promise<{ is2FAEnabled: boolean }> {
    // In a real implementation, this would call the backend API
    // For now, we'll use a simulated response
    
    // Uncomment below when backend is ready
    const response = await api.get('/api/auth/2fa-status');
    return response.data;
    
  },
  async toggle2FA(enable:boolean): Promise<{ is2FAEnabled: boolean }> {
    // In a real implementation, this would call the backend API
    // For now, we'll use a simulated response
    
    // Uncomment below when backend is ready
    const response = await api.post('/api/auth/toggle-2fa', { enable });
    return response.data;

  },
  async verify2FA(code: string): Promise<{ token: string , user: User }> {
    // In a real implementation, this would call the backend API
    // For now, we'll use a simulated response
    
    // Uncomment below when backend is ready
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User ID not found in local storage');
    }
    const response = await api.post('/api/auth/verify-2fa', { code,userId });
    return response.data;
    
  },
};