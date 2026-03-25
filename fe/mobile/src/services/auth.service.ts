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
  };
}

const authService = {
  validateCredentials(identifier: string, password: string): string | null {
    if (!identifier || !identifier.trim()) return 'Email hoặc tên đăng nhập không được để trống';
    if (!password || password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';

    return null;
  },

  async login(identifier: string, password: string): Promise<LoginResponse> {
    console.log("[auth.service.ts] Đang đăng nhập cho:", identifier);
    
    // Gọi backend trực tiếp thay vì qua Keycloak
    const response = await apiFetch('/auth/login', {
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
      const response = await apiFetch('/auth/refresh-token', {
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
