package com.capstone.construction.application.usecase.catalog;

import com.capstone.construction.application.business.network.WaterSupplyNetworkService;
import com.capstone.construction.application.dto.request.branch.CreateRequest;
import com.capstone.construction.application.dto.request.branch.UpdateRequest;
import com.capstone.construction.application.dto.response.catalog.WaterSupplyNetworkResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WaterSupplyNetworkUseCase {
  WaterSupplyNetworkService networkService;

  public void createNetwork(@NonNull CreateRequest request) {
    networkService.createNetwork(request);
  }

  public WaterSupplyNetworkResponse updateNetwork(String id, UpdateRequest request) {
    return networkService.updateNetwork(id, request);
  }

  public void deleteNetwork(String id) {
    networkService.deleteNetwork(id);
  }

  public WaterSupplyNetworkResponse getNetworkById(String id) {
    return networkService.getNetworkById(id);
  }

  public PageResponse<WaterSupplyNetworkResponse> getAllNetworks(Pageable pageable, String keyword) {
    return networkService.getAllNetworks(pageable, keyword);
  }

  public boolean checkExistenceOfNetwork(String id) {
    return networkService.networkExists(id);
  }
}
