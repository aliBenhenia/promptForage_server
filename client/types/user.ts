export interface User {
  id: string;
  name: string;
  email: string;
  requestsUsed: number;
  requestLimit: number;
  createdAt: string;
  updatedAt: string;
  is2FAEnabled: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}