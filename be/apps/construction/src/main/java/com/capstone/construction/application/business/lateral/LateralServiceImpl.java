package com.capstone.construction.application.business.lateral;

import com.capstone.common.annotation.AppLog;
import com.capstone.construction.application.dto.request.catalog.LateralRequest;
import com.capstone.construction.application.dto.response.catalog.LateralResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.domain.model.Lateral;
import com.capstone.construction.infrastructure.persistence.LateralRepository;
import com.capstone.construction.infrastructure.persistence.WaterSupplyNetworkRepository;
import com.capstone.construction.application.exception.ExistingItemException;
import com.capstone.construction.infrastructure.utils.Message;
import com.capstone.construction.infrastructure.service.OverallWaterMeterService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.jspecify.annotations.NonNull;
import org.slf4j.Logger;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@AppLog
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LateralServiceImpl implements LateralService {
  @NonFinal
  Logger log;
  LateralRepository lateralRepository;
  WaterSupplyNetworkRepository networkRepository;
  OverallWaterMeterService metersService;

  @Override
  @Transactional(rollbackFor = Exception.class)
  public LateralResponse createLateral(@NonNull LateralRequest request) {
    log.info("Creating new lateral with name: {}", request.name());
    Objects.requireNonNull(request.name(), Message.PT_45);
    if (lateralRepository.existsByNameIgnoreCase(request.name())) {
      throw new ExistingItemException("Lateral with name " + request.name() + " already exists");
    }
    Objects.requireNonNull(request.networkId(), Message.PT_34);

    var network = networkRepository.findById(request.networkId())
      .orElseThrow(() -> new IllegalArgumentException(Message.SE_03));

    var lateral = Lateral.create(builder -> builder
      .name(request.name())
      .network(network));

    var saved = lateralRepository.save(lateral);
    return mapToResponse(saved);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public LateralResponse updateLateral(String id, @NonNull LateralRequest request) {
    log.info("Updating lateral with id: {}", id);
    var lateral = lateralRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Lateral not found with id: " + id));

    if (lateralRepository.existsByNameIgnoreCase(request.name())) {
      throw new ExistingItemException("Lateral with name " + request.name() + " already exists");
    }

    if (request.networkId() != null && !request.networkId().isBlank()) {
      var network = networkRepository.findById(request.networkId())
        .orElseThrow(() -> new IllegalArgumentException(Message.PT_34));
      lateral.setNetwork(network);
    }
    if (request.name() != null && !request.name().isBlank()) {
      lateral.setName(request.name());
    }

    var saved = lateralRepository.save(lateral);
    return mapToResponse(saved);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void deleteLateral(String id) {
    log.info("Deleting lateral with id: {}", id);
    if (!lateralRepository.existsById(id)) {
      throw new IllegalArgumentException("Lateral not found with id: " + id);
    }
//    metersService.deleteWaterMeter(id);
    lateralRepository.deleteById(id);
  }

  @Override
  public LateralResponse getLateralById(String id) {
    log.info("Fetching lateral with id: {}", id);
    return lateralRepository.findById(id)
      .map(this::mapToResponse)
      .orElseThrow(() -> new IllegalArgumentException("Lateral not found with id: " + id));
  }

  @Override
  public PageResponse<LateralResponse> getAllLaterals(Pageable pageable,
                                                      String keyword,
                                                      String networkId,
                                                      Boolean networkAssigned) {
    log.info("Fetching all laterals with pageable: {}, keyword: {}, networkId: {}, networkAssigned: {}",
      pageable, keyword, networkId, networkAssigned);

    var normalizedKeyword = (keyword == null || keyword.isBlank()) ? null : keyword.trim();
    var page = (normalizedKeyword == null || normalizedKeyword.isEmpty())
      ? lateralRepository.searchLateralsWithoutKeyword(networkId, networkAssigned, pageable)
      : lateralRepository.searchLateralsWithKeyword(normalizedKeyword, networkId, networkAssigned, pageable);
    return PageResponse.fromPage(page, this::mapToResponse);
  }

  @Override
  public Boolean checkLateralBelongedToNetwork(String id) {
    log.info("Checking lateral belonged to network with id: {}", id);
    return lateralRepository.existsByNetwork_BranchId(id);
  }

  private @NonNull LateralResponse mapToResponse(@NonNull Lateral lateral) {
    var network = lateral.getNetwork();
    return new LateralResponse(
      lateral.getId(),
      lateral.getName(),
      network == null ? null : network.getBranchId(),
      network == null ? null : network.getName(),
      lateral.getCreatedAt());
  }
}
