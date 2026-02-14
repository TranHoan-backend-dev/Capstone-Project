package com.capstone.construction.application.usecase.catalog;

import com.capstone.construction.application.business.network.WaterSupplyNetworkService;
import com.capstone.construction.application.dto.request.catalog.WaterSupplyNetworkRequest;
import com.capstone.construction.application.dto.response.catalog.WaterSupplyNetworkResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WaterSupplyNetworkUseCase {
  WaterSupplyNetworkService networkService;

  public WaterSupplyNetworkResponse createNetwork(@NonNull WaterSupplyNetworkRequest request) {
    log.info("UseCase: Creating network {}", request.name());
    return networkService.createNetwork(request);
  }

  public WaterSupplyNetworkResponse updateNetwork(String id, WaterSupplyNetworkRequest request) {
    log.info("UseCase: Updating network {}", id);
    return networkService.updateNetwork(id, request);
  }

  public void deleteNetwork(String id) {
    log.info("UseCase: Deleting network {}", id);
    networkService.deleteNetwork(id);
  }

  public WaterSupplyNetworkResponse getNetworkById(String id) {
    log.info("UseCase: Fetching network {}", id);
    return networkService.getNetworkById(id);
  }

  public PageResponse<WaterSupplyNetworkResponse> getAllNetworks(Pageable pageable) {
    log.info("UseCase: Fetching all networks");
    return networkService.getAllNetworks(pageable);
  }
}
