package com.capstone.construction.application.business.network;

import com.capstone.common.annotation.AppLog;
import com.capstone.construction.application.dto.request.branch.CreateRequest;
import com.capstone.construction.application.dto.request.branch.UpdateRequest;
import com.capstone.construction.application.dto.response.catalog.WaterSupplyNetworkResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.domain.model.WaterSupplyNetwork;
import com.capstone.construction.infrastructure.utils.Message;
import com.capstone.construction.infrastructure.persistence.WaterSupplyNetworkRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WaterSupplyNetworkServiceImpl implements WaterSupplyNetworkService {
  WaterSupplyNetworkRepository networkRepository;
  @NonFinal
  Logger log;

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void createNetwork(@NonNull CreateRequest request) {
    log.info("Creating new water supply network with name: {}", request.name());

    var network = WaterSupplyNetwork.create(builder -> builder
      .name(request.name()));

    networkRepository.save(network);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public WaterSupplyNetworkResponse updateNetwork(String id, @NonNull UpdateRequest request) {
    log.info("Updating water supply network with id: {}", id);
    var network = networkRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Network not found with id: " + id));

    var name = request.name();
    if (name != null && !name.isBlank()) {
      if (networkRepository.existsByNameIgnoreCase(name) && !network.getName().equalsIgnoreCase(name)) {
        throw new IllegalArgumentException(Message.PT_57);
      }
      network.setName(name);
    }

    var saved = networkRepository.save(network);
    return mapToResponse(saved);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
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
  public PageResponse<WaterSupplyNetworkResponse> getAllNetworks(Pageable pageable, String keyword) {
    log.info("Fetching all water supply networks with pageable: {}", pageable);
    var page = keyword == null ? networkRepository.findAll(pageable)
      : networkRepository.findAllByNameContainsIgnoreCase(keyword, pageable);
    return PageResponse.fromPage(page, this::mapToResponse);
  }

  @Override
  public boolean networkExists(String id) {
    return networkRepository.existsById(id);
  }

  @Override
  public String getName(String id) {
    return networkRepository.findNameByBranchId(id);
  }

  private @NonNull WaterSupplyNetworkResponse mapToResponse(@NonNull WaterSupplyNetwork network) {
    return new WaterSupplyNetworkResponse(
      network.getBranchId(),
      network.getName(),
      network.getCreatedAt());
  }
}
