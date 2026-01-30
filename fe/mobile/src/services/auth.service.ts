import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'localhost:3000/api/auth';

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data: LoginResponse = await response.json();

    // ✅ lưu token
    await AsyncStorage.setItem('accessToken', data.accessToken);

    if (data.refreshToken) {
      await AsyncStorage.setItem('refreshToken', data.refreshToken);
    }

    await AsyncStorage.setItem('user', JSON.stringify(data.user));

    return data;
  },

  async logout(): Promise<void> {
    await AsyncStorage.multiRemove([
      'accessToken',
      'refreshToken',
      'user',
    ]);
  },

  async getAccessToken(): Promise<string | null> {
    return AsyncStorage.getItem('accessToken');
  },

  async getCurrentUser() {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('accessToken');
    return !!token;
  },
};

export default authService;
