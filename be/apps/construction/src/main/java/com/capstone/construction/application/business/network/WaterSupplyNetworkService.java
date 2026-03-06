package com.capstone.construction.application.business.network;

import com.capstone.construction.application.dto.request.branch.CreateRequest;
import com.capstone.construction.application.dto.request.branch.UpdateRequest;
import com.capstone.construction.application.dto.response.catalog.WaterSupplyNetworkResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface WaterSupplyNetworkService {
  void createNetwork(CreateRequest request);

  WaterSupplyNetworkResponse updateNetwork(String id, UpdateRequest request);

  void deleteNetwork(String id);

  WaterSupplyNetworkResponse getNetworkById(String id);

  PageResponse<WaterSupplyNetworkResponse> getAllNetworks(Pageable pageable, String keyword);

  boolean networkExists(String id);
}
