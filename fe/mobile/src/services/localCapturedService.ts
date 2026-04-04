import AsyncStorage from '@react-native-async-storage/async-storage';

const CAPTURED_KEY = 'captured_customers';

export const localCapturedService = {
  /**
   * Mark a customer as captured locally
   */
  async markAsCaptured(customerId: string): Promise<void> {
    try {
      const captured = await this.getCapturedIds();
      if (!captured.includes(customerId)) {
        captured.push(customerId);
        await AsyncStorage.setItem(CAPTURED_KEY, JSON.stringify(captured));
      }
    } catch (e) {
      console.error('Failed to mark as captured:', e);
    }
  },

  /**
   * Get list of captured customer IDs
   */
  async getCapturedIds(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(CAPTURED_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  /**
   * Clear captured list (usually after a sync or new day)
   */
  async clearCaptured(): Promise<void> {
    await AsyncStorage.removeItem(CAPTURED_KEY);
  }
};
