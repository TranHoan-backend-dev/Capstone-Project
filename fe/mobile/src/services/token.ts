import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules } from 'react-native';

const { AuthModule } = NativeModules;

export const TokenManager = {
  async getAccessToken(): Promise<string | null> {
    try {
      if (AuthModule && AuthModule.getAccessToken) {
        const token = await AuthModule.getAccessToken();
        if (token) return token;
      }
    } catch (e) {
      console.warn('Native getAccessToken failed:', e);
    }
    return AsyncStorage.getItem('accessToken');
  },

  async setTokens(accessToken: string, refreshToken?: string): Promise<void> {
    await AsyncStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      await AsyncStorage.setItem('refreshToken', refreshToken);
    }
    // Sync with native if available
    try {
        if (AuthModule && AuthModule.login) {
            await AuthModule.login(accessToken);
        }
    } catch (e) {
        console.warn('Native login sync failed:', e);
    }
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    try {
        if (AuthModule && AuthModule.logout) {
            await AuthModule.logout();
        }
    } catch (e) {
        console.warn('Native logout failed:', e);
    }
  },

  async syncChangePassword(oldPass: string, newPass: string): Promise<void> {
    try {
        if (AuthModule && AuthModule.changePassword) {
            await AuthModule.changePassword(oldPass, newPass);
        }
    } catch (e) {
        console.warn('Native changePassword sync failed:', e);
    }
  }
};
