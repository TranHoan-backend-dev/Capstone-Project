import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from './api';
import { TokenManager } from './token';

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    username: string;
    role: string;
    fullName?: string;
    avatarUrl?: string;
    address?: string;
    phoneNumber?: string;
    gender?: string;
    birthday?: string;
    significanceUrl?: string;
  };
}

const authService = {
  validateCredentials(identifier: string, password: string): string | null {
    if (!identifier || !identifier.trim()) return 'Email hoặc tên đăng nhập không được để trống';
    if (identifier === 'test1' && password === '123') return null; // Bypass validation for dev account
    if (!password || password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';

    return null;
  },

  async login(identifier: string, password: string): Promise<LoginResponse> {
    console.log("[auth.service.ts] Đang đăng nhập cho:", identifier);

    // Bypass login logic for development
    if (identifier === 'test1' && password === '123') {
      const mockUser = {
        id: 'mock-id-001',
        email: 'test1@capstone.com',
        username: 'test1',
        role: 'METER_INSPECTION_STAFF',
        fullName: 'Nhân viên Test (Dev Bypass)',
        address: 'Hệ thống Demo Antigravity',
        phoneNumber: '0123456789',
        gender: 'MALE',
        birthday: '1990-01-01',
      };
      await TokenManager.setTokens('mock-access-token', 'mock-refresh-token');
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      return {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: mockUser,
      };
    }

    // Gọi backend trực tiếp thay vì qua Keycloak
    const response = await apiFetch('/auth/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: identifier,
        password: password,
      }),
    });

    // response từ backend là WrapperApiResponse<TokenResponse>
    // TokenResponse { userDetails, token: TokenExchangeResponse }
    const authData = response.data;
    if (!authData || !authData.token) {
      throw new Error('Dữ liệu xác thực không hợp lệ từ máy chủ');
    }

    const { userDetails, token } = authData;

    // Lưu token vào TokenManager
    await TokenManager.setTokens(token.access_token, token.refresh_token);

    // Lưu thông tin user vào AsyncStorage
    const user = {
      id: userDetails.id,
      email: userDetails.email,
      username: userDetails.username,
      role: userDetails.role,
      fullName: userDetails.fullname,
      avatarUrl: userDetails.avatarUrl,
      address: userDetails.address,
      phoneNumber: userDetails.phoneNumber,
      gender: userDetails.gender,
      birthday: userDetails.birthday,
      significanceUrl: userDetails.significanceUrl,
    };
    await AsyncStorage.setItem('user', JSON.stringify(user));

    return {
      accessToken: token.access_token,
      refreshToken: token.refresh_token,
      user: user,
    };
  },

  async logout(): Promise<void> {
    await TokenManager.logout();
    await AsyncStorage.removeItem('user');
  },

  async getAccessToken(): Promise<string | null> {
    return TokenManager.getAccessToken();
  },

  async getCurrentUser() {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<any> {
    const data = await apiFetch('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    // Sau khi đổi mật khẩu ở JS side, sync xuống native side nếu cần
    try {
      if (TokenManager.syncChangePassword) {
        await TokenManager.syncChangePassword(oldPassword, newPassword);
      }
    } catch (e) {
      console.warn('Native change password sync failed:', e);
    }

    return data;
  },

  async isAuthenticated(): Promise<boolean> {
    const token = await TokenManager.getAccessToken();
    return !!token;
  },

  async refreshToken(): Promise<string | null> {
    const refreshToken = await TokenManager.getRefreshToken();
    if (!refreshToken) return null;

    try {
      // Gọi backend để lấy access token mới
      // Sử dụng đúng path cho gateway: /auth/auth/refresh-token
      const response = await apiFetch('/auth/auth/refresh-token', {
        method: 'POST',
        body: JSON.stringify({ token: refreshToken }),
      });

      // Backend trả về TokenExchangeResponse trực tiếp hoặc trong data
      const tokenData = response.data || response;
      if (tokenData && tokenData.access_token) {
        await TokenManager.setTokens(tokenData.access_token, tokenData.refresh_token || refreshToken);
        return tokenData.access_token;
      }
      return null;
    } catch (error) {
      console.error('Refresh token error:', error);
      await this.logout();
      return null;
    }
  },
};

export default authService;
