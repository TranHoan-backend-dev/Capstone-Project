package com.capstone.construction.application.business.network;

import com.capstone.construction.application.dto.request.catalog.WaterSupplyNetworkRequest;
import com.capstone.construction.application.dto.response.catalog.WaterSupplyNetworkResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.domain.model.WaterSupplyNetwork;
import com.capstone.construction.infrastructure.persistence.WaterSupplyNetworkRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WaterSupplyNetworkServiceImpl implements WaterSupplyNetworkService {
  WaterSupplyNetworkRepository networkRepository;

  @Override
  @Transactional
  public WaterSupplyNetworkResponse createNetwork(@NonNull WaterSupplyNetworkRequest request) {
    log.info("Creating new water supply network with name: {}", request.name());

    var network = WaterSupplyNetwork.create(builder -> builder
      .name(request.name()));

    var saved = networkRepository.save(network);
    return mapToResponse(saved);
  }

  @Override
  @Transactional
  public WaterSupplyNetworkResponse updateNetwork(String id, @NonNull WaterSupplyNetworkRequest request) {
    log.info("Updating water supply network with id: {}", id);
    var network = networkRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Network not found with id: " + id));

    network.setName(request.name());

    var saved = networkRepository.save(network);
    return mapToResponse(saved);
  }

  @Override
  @Transactional
  public void deleteNetwork(String id) {
    log.info("Deleting water supply network with id: {}", id);
    if (!networkRepository.existsById(id)) {
      throw new IllegalArgumentException("Network not found with id: " + id);
    }
    networkRepository.deleteById(id);
  }

  @Override
  public WaterSupplyNetworkResponse getNetworkById(String id) {
    log.info("Fetching water supply network with id: {}", id);
    return networkRepository.findById(id)
      .map(this::mapToResponse)
      .orElseThrow(() -> new IllegalArgumentException("Network not found with id: " + id));
  }

  @Override
  public PageResponse<WaterSupplyNetworkResponse> getAllNetworks(Pageable pageable) {
    log.info("Fetching all water supply networks with pageable: {}", pageable);
    var page = networkRepository.findAll(pageable);
    return PageResponse.fromPage(page, this::mapToResponse);
  }

  private WaterSupplyNetworkResponse mapToResponse(@NonNull WaterSupplyNetwork network) {
    return new WaterSupplyNetworkResponse(
      network.getBranchId(),
      network.getName(),
      network.getCreatedAt());
  }
}
