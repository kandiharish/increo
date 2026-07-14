import { api } from './api';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  role: string;
  full_name: string;
}

export interface UserMe {
  id: number;
  full_name: string;
  email: string;
  role: string;
  status: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  async getMe(token?: string): Promise<UserMe> {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const response = await api.get<UserMe>('/auth/me', { headers });
    return response.data;
  },
};
