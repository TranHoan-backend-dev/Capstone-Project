import AsyncStorage from '@react-native-async-storage/async-storage';

const CAPTURED_KEY = 'captured_customers';
const AUDIT_RECORDS_KEY = 'audit_records';

export interface AuditRecord {
  id: string;
  customerId?: string;
  photoUri: string;
  aiIndex: number | string;
  aiSerial: string;
  customerName?: string;
  address?: string;
  timestamp: string;
}

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
    } catch (e: any) {
      console.error("[localCapturedService.ts]" + e.message)
      return [];
    }
  },

  /**
   * Clear captured list (usually after a sync or new day)
   */
  async clearCaptured(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CAPTURED_KEY);
      await AsyncStorage.removeItem(AUDIT_RECORDS_KEY);
    } catch (e) {
      console.error('Failed to clear captured data:', e);
    }
  },

  /**
   * Save a full audit record (photo + ai response)
   */
  async saveAuditRecord(record: AuditRecord): Promise<void> {
    try {
      const records = await this.getAuditRecords();
      // Check if record exists, update if it does, otherwise push
      const index = records.findIndex(r => r.id === record.id);
      if (index >= 0) {
        records[index] = record;
      } else {
        records.push(record);
      }
      await AsyncStorage.setItem(AUDIT_RECORDS_KEY, JSON.stringify(records));

      // Also mark as captured for ID tracking
      if (record.customerId) {
        await this.markAsCaptured(record.customerId);
      }
    } catch (e) {
      console.error('Failed to save audit record:', e);
    }
  },

  /**
   * Get all pending audit records
   */
  async getAuditRecords(): Promise<AuditRecord[]> {
    try {
      const data = await AsyncStorage.getItem(AUDIT_RECORDS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e: any) {
      console.error("[localCapturedService.ts]" + e.message)
      return [];
    }
  },

  /**
   * Remove a single record (after review)
   */
  async removeAuditRecord(id: string): Promise<void> {
    try {
      const records = await this.getAuditRecords();
      const filtered = records.filter(r => r.id !== id);
      await AsyncStorage.setItem(AUDIT_RECORDS_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to remove audit record:', e);
    }
  },

  /**
   * Cập nhật một phần bản ghi (ví dụ gán khách hàng khi thiếu serial)
   */
  async updateAuditRecord(id: string, patch: Partial<AuditRecord>): Promise<void> {
    try {
      const records = await this.getAuditRecords();
      const index = records.findIndex(r => r.id === id);
      if (index < 0) return;
      records[index] = { ...records[index], ...patch };
      await AsyncStorage.setItem(AUDIT_RECORDS_KEY, JSON.stringify(records));
      if (patch.customerId) {
        await this.markAsCaptured(patch.customerId);
      }
    } catch (e) {
      console.error('Failed to update audit record:', e);
    }
  },
};
