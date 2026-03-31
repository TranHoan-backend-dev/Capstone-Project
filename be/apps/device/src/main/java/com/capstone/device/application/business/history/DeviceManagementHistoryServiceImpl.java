package com.capstone.device.application.business.history;

import com.capstone.device.application.dto.response.device.DeviceManagementHistoryResponse;
import com.capstone.device.application.usecase.DeviceManagementHistoryUseCase;
import com.capstone.device.infrastructure.persistence.DeviceManagementHistoryRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

// for system logging
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DeviceManagementHistoryServiceImpl implements DeviceManagementHistoryUseCase {

  DeviceManagementHistoryRepository repository;

  @Override
  public List<DeviceManagementHistoryResponse> getDeviceManagementHistory() {
    return repository.getDeviceManagementHistory().stream()
        .map(projection -> new DeviceManagementHistoryResponse(
            projection.getEntityName(),
            projection.getItemName(),
            projection.getOperationTime()))
        .collect(Collectors.toList());
  }
}
