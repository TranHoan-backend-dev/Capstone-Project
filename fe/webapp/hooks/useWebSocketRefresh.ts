import { useEffect, useCallback, useRef } from "react";
import { websocketService } from "@/services/websocket.service";
import { useDataCache, CacheKey } from "@/context/DataCacheContext";

/**
 * Map WebSocket events to cache keys that should be invalidated
 */
export const WEBSOCKET_TO_CACHE_MAP: Record<string, CacheKey | CacheKey[]> = {
  SETTLEMENT_CREATED: "settlements",
  SETTLEMENT_UPDATED: "settlements",
  SETTLEMENT_DELETED: "settlements",
  SETTLEMENT_STATUS_CHANGED: "settlements",
  SETTLEMENT_SIGNED: "settlements",

  RECEIPT_CREATED: "receipts",
  RECEIPT_UPDATED: "receipts",
  RECEIPT_DELETED: "receipts",

  CUSTOMER_CREATED: "customers",
  CUSTOMER_UPDATED: "customers",
  CUSTOMER_DELETED: "customers",
  CUSTOMER_RECOVERED: "customers",

  INSTALLATION_CREATED: ["installations", "surveys"],
  INSTALLATION_UPDATED: ["installations", "surveys"],
  INSTALLATION_DELETED: "installations",

  SURVEY_CREATED: "surveys",
  SURVEY_UPDATED: "surveys",
  SURVEY_ASSIGNED: "surveys",
  SURVEY_COMPLETED: "surveys",

  CONSTRUCTION_CREATED: "constructions",
  CONSTRUCTION_UPDATED: "constructions",
  CONSTRUCTION_COMPLETED: "constructions",

  CONTRACT_CREATED: "contracts",
  CONTRACT_UPDATED: "contracts",
  CONTRACT_SIGNED: "contracts",

  EMPLOYEE_CREATED: "employees",
  EMPLOYEE_UPDATED: "employees",
  EMPLOYEE_DELETED: "employees",

  DEPARTMENT_CREATED: "departments",
  DEPARTMENT_UPDATED: "departments",
  DEPARTMENT_DELETED: "departments",

  DEVICE_CREATED: "devices",
  DEVICE_UPDATED: "devices",
  DEVICE_DELETED: "devices",

  MATERIAL_CREATED: "materials",
  MATERIAL_UPDATED: "materials",
  MATERIAL_DELETED: "materials",

  CATEGORY_UPDATED: "categories",
};

/**
 * Enhanced hook để auto-refresh dữ liệu khi nhận được WebSocket message
 * Tự động invalidate cache key
 * @param messageType Loại message cần subscribe
 * @param onDataChanged Callback khi data thay đổi (tùy chọn)
 * @param dependencies Dependencies array
 */
export const useWebSocketRefresh = (
  messageType: string,
  onDataChanged?: () => void,
  dependencies: any[] = [],
) => {
  const { invalidate } = useDataCache();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!websocketService.isConnected()) {
      console.warn("WebSocket not connected, auto-refresh disabled");
      return;
    }

    const cacheKeys = WEBSOCKET_TO_CACHE_MAP[messageType];

    const handler = (data: any) => {
      console.log(`🔄 WebSocket message received: ${messageType}`, data);

      // Invalidate relevant cache keys
      if (cacheKeys) {
        invalidate(cacheKeys);
      }

      // Call custom callback if provided
      if (onDataChanged) {
        onDataChanged();
      }
    };

    unsubscribeRef.current = websocketService.subscribe(messageType, handler);

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [messageType, onDataChanged, invalidate, ...dependencies]);
};

/**
 * Hook để subscribe tới settlement updates
 */
export const useSettlementUpdates = (onSettlementUpdated?: () => void) => {
  useWebSocketRefresh("SETTLEMENT_UPDATED", onSettlementUpdated);
  useWebSocketRefresh("SETTLEMENT_DELETED", onSettlementUpdated);
  useWebSocketRefresh("SETTLEMENT_STATUS_CHANGED", onSettlementUpdated);
  useWebSocketRefresh("SETTLEMENT_SIGNED", onSettlementUpdated);
};

/**
 * Hook để subscribe tới settlement deletion
 */
export const useSettlementDeletion = (onSettlementDeleted?: () => void) => {
  useWebSocketRefresh("SETTLEMENT_DELETED", onSettlementDeleted);
};

/**
 * Hook để subscribe tới settlement status changes
 */
export const useSettlementStatusChange = (
  onSettlementStatusChanged?: () => void,
) => {
  useWebSocketRefresh("SETTLEMENT_STATUS_CHANGED", onSettlementStatusChanged);
};

/**
 * Hook để subscribe tới receipt updates
 */
export const useReceiptUpdates = (onReceiptUpdated?: () => void) => {
  useWebSocketRefresh("RECEIPT_CREATED", onReceiptUpdated);
  useWebSocketRefresh("RECEIPT_UPDATED", onReceiptUpdated);
  useWebSocketRefresh("RECEIPT_DELETED", onReceiptUpdated);
};

/**
 * Hook để subscribe tới customer updates
 */
export const useCustomerUpdates = (onCustomerUpdated?: () => void) => {
  useWebSocketRefresh("CUSTOMER_CREATED", onCustomerUpdated);
  useWebSocketRefresh("CUSTOMER_UPDATED", onCustomerUpdated);
  useWebSocketRefresh("CUSTOMER_DELETED", onCustomerUpdated);
  useWebSocketRefresh("CUSTOMER_RECOVERED", onCustomerUpdated);
};

/**
 * Hook để subscribe tới installation updates
 */
export const useInstallationUpdates = (onInstallationUpdated?: () => void) => {
  useWebSocketRefresh("INSTALLATION_CREATED", onInstallationUpdated);
  useWebSocketRefresh("INSTALLATION_UPDATED", onInstallationUpdated);
  useWebSocketRefresh("INSTALLATION_DELETED", onInstallationUpdated);
};

/**
 * Hook để subscribe tới survey updates
 */
export const useSurveyUpdates = (onSurveyUpdated?: () => void) => {
  useWebSocketRefresh("SURVEY_CREATED", onSurveyUpdated);
  useWebSocketRefresh("SURVEY_UPDATED", onSurveyUpdated);
  useWebSocketRefresh("SURVEY_ASSIGNED", onSurveyUpdated);
  useWebSocketRefresh("SURVEY_COMPLETED", onSurveyUpdated);
};

/**
 * Hook để subscribe tới construction updates
 */
export const useConstructionUpdates = (onConstructionUpdated?: () => void) => {
  useWebSocketRefresh("CONSTRUCTION_CREATED", onConstructionUpdated);
  useWebSocketRefresh("CONSTRUCTION_UPDATED", onConstructionUpdated);
  useWebSocketRefresh("CONSTRUCTION_COMPLETED", onConstructionUpdated);
};

/**
 * Hook để subscribe tới contract updates
 */
export const useContractUpdates = (onContractUpdated?: () => void) => {
  useWebSocketRefresh("CONTRACT_CREATED", onContractUpdated);
  useWebSocketRefresh("CONTRACT_UPDATED", onContractUpdated);
  useWebSocketRefresh("CONTRACT_SIGNED", onContractUpdated);
};

/**
 * Hook để subscribe tới device/material/category updates
 */
export const useDeviceUpdates = (onDeviceUpdated?: () => void) => {
  useWebSocketRefresh("DEVICE_CREATED", onDeviceUpdated);
  useWebSocketRefresh("DEVICE_UPDATED", onDeviceUpdated);
  useWebSocketRefresh("DEVICE_DELETED", onDeviceUpdated);
};

export const useMaterialUpdates = (onMaterialUpdated?: () => void) => {
  useWebSocketRefresh("MATERIAL_CREATED", onMaterialUpdated);
  useWebSocketRefresh("MATERIAL_UPDATED", onMaterialUpdated);
  useWebSocketRefresh("MATERIAL_DELETED", onMaterialUpdated);
};

export const useCategoryUpdates = (onCategoryUpdated?: () => void) => {
  useWebSocketRefresh("CATEGORY_UPDATED", onCategoryUpdated);
};

/**
 * Debounce callback để tránh quá nhiều refresh
 */
export const useDebounceCallback = (
  callback: () => void,
  delay: number = 1000,
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback();
      timeoutRef.current = null;
    }, delay);
  }, [callback, delay]);

  return debouncedCallback;
};
