import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from './api';
import { TokenManager } from './token';
import { keycloakService } from './keycloak.service';

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
    // 1. Đăng nhập qua Keycloak
    console.log("[auth.service.ts]: " + identifier + ", " + password)
    const kcData = await keycloakService.login({ identifier, password });
    console.log("[auth.service.ts] Ket qua cua keycloak: " + kcData)

    // 2. Lưu token tạm thời để sử dụng cho apiFetch tiếp theo (vì apiFetch sẽ tự động lấy token từ TokenManager)
    await TokenManager.setTokens(kcData.access_token, kcData.refresh_token);

    try {
      // 3. Gọi backend xác thực và lấy thông tin User chi tiết
      // apiFetch(..., { method: 'POST' }) sẽ tự động đính kèm Authorization: Bearer <kcData.access_token>
      const response = await apiFetch('/auth/login', {
        method: 'POST',
      });

      // response ở đây thường là WrapperApiResponse<UserProfileResponse> từ backend
      const userData = response.data || response;
      console.log("[auth.service.ts] userData: " + userData);

      // 4. Đồng bộ hóa với AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      return {
        accessToken: kcData.access_token,
        refreshToken: kcData.refresh_token,
        user: userData,
      };
    } catch (error) {
      console.error('Login backend sync error:', error);
      // Nếu lỗi ở bước sync backend, chúng ta nên xóa token đã lưu để đảm bảo tính toàn vẹn
      await TokenManager.logout();
      throw error;
    }
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
};

export default authService;
