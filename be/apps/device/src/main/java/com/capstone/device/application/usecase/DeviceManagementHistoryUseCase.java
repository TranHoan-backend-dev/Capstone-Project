package com.capstone.device.application.usecase;

import com.capstone.device.application.dto.response.device.DeviceManagementHistoryResponse;
import java.util.List;

// for system logging
public interface DeviceManagementHistoryUseCase {
  List<DeviceManagementHistoryResponse> getDeviceManagementHistory();
}
