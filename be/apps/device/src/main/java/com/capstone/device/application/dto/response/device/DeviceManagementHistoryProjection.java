package com.capstone.device.application.dto.response.device;

import java.time.LocalDateTime;

// for system logging
public interface DeviceManagementHistoryProjection {
  String getEntityName();

  String getItemName();

  LocalDateTime getOperationTime();
}
