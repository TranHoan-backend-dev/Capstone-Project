import { useEffect, useCallback } from "react";
import { websocketService } from "@/services/websocket.service";

/**
 * Hook để auto-refresh dữ liệu khi nhận được WebSocket message
 * @param messageType Loại message cần subscribe
 * @param onDataChanged Callback khi data thay đổi
 * @param dependencies Dependencies array
 */
export const useWebSocketRefresh = (
  messageType: string,
  onDataChanged: () => void,
  dependencies: any[] = [],
) => {
  useEffect(() => {
    if (!websocketService.isConnected()) {
      console.warn("WebSocket not connected, auto-refresh disabled");
      return;
    }

    const unsubscribe = websocketService.subscribe(messageType, (data) => {
      console.log(`🔄 Auto-refresh triggered by ${messageType}:`, data);
      onDataChanged();
    });

    return () => {
      unsubscribe();
    };
  }, [messageType, onDataChanged, ...dependencies]);
};

/**
 * Hook để subscribe tới settlement updates
 */
export const useSettlementUpdates = (onSettlementUpdated: () => void) => {
  useWebSocketRefresh("SETTLEMENT_UPDATED", onSettlementUpdated);
};

/**
 * Hook để subscribe tới settlement deletion
 */
export const useSettlementDeletion = (onSettlementDeleted: () => void) => {
  useWebSocketRefresh("SETTLEMENT_DELETED", onSettlementDeleted);
};

/**
 * Hook để subscribe tới settlement status changes
 */
export const useSettlementStatusChange = (
  onSettlementStatusChanged: () => void,
) => {
  useWebSocketRefresh("SETTLEMENT_STATUS_CHANGED", onSettlementStatusChanged);
};

/**
 * Hook để subscribe tới receipt updates
 */
export const useReceiptUpdates = (onReceiptUpdated: () => void) => {
  useWebSocketRefresh("RECEIPT_UPDATED", onReceiptUpdated);
};

/**
 * Debounce callback để tránh quá nhiều refresh
 */
export const useDebounceCallback = (
  callback: () => void,
  delay: number = 1000,
) => {
  const timeoutRef = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout | null = null;

      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
          callback();
          timeoutId = null;
        }, delay);
      };
    })(),
    [callback, delay],
  );

  return timeoutRef;
};
