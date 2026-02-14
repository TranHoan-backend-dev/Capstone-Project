package com.capstone.construction.application.business.lateral;

import com.capstone.construction.application.dto.request.catalog.LateralRequest;
import com.capstone.construction.application.dto.response.catalog.LateralResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.domain.model.Lateral;
import com.capstone.construction.domain.repository.LateralRepository;
import com.capstone.construction.domain.repository.WaterSupplyNetworkRepository;
import com.capstone.construction.application.exception.ExistingItemException;
import com.capstone.construction.infrastructure.config.Constant;
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
public class LateralServiceImpl implements LateralService {
  LateralRepository lateralRepository;
  WaterSupplyNetworkRepository networkRepository;

  @Override
  @Transactional
  public LateralResponse createLateral(@NonNull LateralRequest request) {
    log.info("Creating new lateral with name: {}", request.name());
    if (lateralRepository.existsByName(request.name())) {
      throw new ExistingItemException("Lateral with name " + request.name() + " already exists");
    }

    var network = networkRepository.findById(request.networkId())
      .orElseThrow(() -> new IllegalArgumentException(Constant.PT_59));

    var lateral = Lateral.create(builder -> builder
      .name(request.name())
      .network(network));

    var saved = lateralRepository.save(lateral);
    return mapToResponse(saved);
  }

  @Override
  @Transactional
  public LateralResponse updateLateral(String id, @NonNull LateralRequest request) {
    log.info("Updating lateral with id: {}", id);
    var lateral = lateralRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Lateral not found with id: " + id));

    if (!lateral.getName().equals(request.name()) && lateralRepository.existsByName(request.name())) {
      throw new ExistingItemException("Lateral with name " + request.name() + " already exists");
    }

    var network = networkRepository.findById(request.networkId())
      .orElseThrow(() -> new IllegalArgumentException(Constant.PT_59));

    lateral.setName(request.name());
    lateral.setNetwork(network);

    var saved = lateralRepository.save(lateral);
    return mapToResponse(saved);
  }

  @Override
  @Transactional
  public void deleteLateral(String id) {
    log.info("Deleting lateral with id: {}", id);
    if (!lateralRepository.existsById(id)) {
      throw new IllegalArgumentException("Lateral not found with id: " + id);
    }
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
  public PageResponse<LateralResponse> getAllLaterals(Pageable pageable) {
    log.info("Fetching all laterals with pageable: {}", pageable);
    var page = lateralRepository.findAll(pageable);
    return PageResponse.fromPage(page, this::mapToResponse);
  }

  private LateralResponse mapToResponse(@NonNull Lateral lateral) {
    return new LateralResponse(
      lateral.getId(),
      lateral.getName(),
      lateral.getNetwork().getBranchId(),
      lateral.getNetwork().getName(),
      lateral.getCreatedAt());
  }
}
