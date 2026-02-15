package com.capstone.construction.application.business.network;

import com.capstone.construction.application.dto.request.catalog.WaterSupplyNetworkRequest;
import com.capstone.construction.application.dto.response.catalog.WaterSupplyNetworkResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface WaterSupplyNetworkService {
  WaterSupplyNetworkResponse createNetwork(WaterSupplyNetworkRequest request);

  WaterSupplyNetworkResponse updateNetwork(String id, WaterSupplyNetworkRequest request);

  void deleteNetwork(String id);

  WaterSupplyNetworkResponse getNetworkById(String id);

  PageResponse<WaterSupplyNetworkResponse> getAllNetworks(Pageable pageable, String keyword);

  boolean networkExists(String id);
}
