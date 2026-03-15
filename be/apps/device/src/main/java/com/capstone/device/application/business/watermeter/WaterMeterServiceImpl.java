package com.capstone.device.application.business.watermeter;

import com.capstone.device.application.dto.request.WaterMeterRequest;
import com.capstone.device.application.dto.response.OverallWaterMeterResponse;
import com.capstone.device.application.dto.response.WaterMeterResponse;
import com.capstone.device.domain.model.OverallWaterMeter;
import com.capstone.device.domain.model.WaterMeter;
import com.capstone.device.infrastructure.persistence.OverallWaterMeterRepository;
import com.capstone.device.infrastructure.persistence.WaterMeterRepository;
import com.capstone.device.infrastructure.persistence.WaterMeterTypeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WaterMeterServiceImpl implements WaterMeterService {
  WaterMeterRepository waterMeterRepository;
  WaterMeterTypeRepository waterMeterTypeRepository;
  OverallWaterMeterRepository overallWaterMeterRepository;

  @Override
  @Transactional(rollbackFor = Exception.class)
  public WaterMeterResponse createWaterMeter(@NonNull WaterMeterRequest request) {
    log.info("Creating water meter with size: {}", request.size());

    var type = waterMeterTypeRepository.findById(request.typeId())
      .orElseThrow(() -> new IllegalArgumentException("Water meter type not found: " + request.typeId()));

    var meter = WaterMeter.create(builder -> builder
      .installationDate(request.installationDate())
      .size(request.size())
      .type(type));

    var saved = waterMeterRepository.save(meter);
    return mapToResponse(saved);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public WaterMeterResponse updateWaterMeter(String id, @NonNull WaterMeterRequest request) {
    log.info("Updating water meter ID: {}", id);
    var meter = waterMeterRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Water meter not found: " + id));

    var type = waterMeterTypeRepository.findById(request.typeId())
      .orElseThrow(() -> new IllegalArgumentException("Water meter type not found: " + request.typeId()));

    meter.setInstallationDate(request.installationDate());
    meter.setSize(request.size());
    meter.setType(type);

    var updated = waterMeterRepository.save(meter);
    return mapToResponse(updated);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void deleteWaterMeter(String id) {
    log.info("Deleting water meter ID: {}", id);
    if (!waterMeterRepository.existsById(id)) {
      throw new IllegalArgumentException("Water meter not found: " + id);
    }
    waterMeterRepository.deleteById(id);
  }

  @Override
  public WaterMeterResponse getWaterMeterById(String id) {
    log.info("Fetching water meter ID: {}", id);
    return waterMeterRepository.findById(id)
      .map(this::mapToResponse)
      .orElseThrow(() -> new IllegalArgumentException("Water meter not found: " + id));
  }

  @Override
  public Page<WaterMeterResponse> getAllWaterMeters(Pageable pageable) {
    log.debug("Fetching all water meters with pagination: {}", pageable);
    return waterMeterRepository.findAll(pageable).map(this::mapToResponse);
  }

  @Override
  public boolean isWaterMeterExisting(String id) {
    log.info("Checking existence of water meter ID: {}", id);
    return waterMeterRepository.existsById(id);
  }

  @Override
  public boolean isOverallWaterMeterExisting(String id) {
    log.info("Checking existence of overall water meter ID: {}", id);
    return overallWaterMeterRepository.existsById(id);
  }

  @Override
  public void deleteOverallWaterMeterByLateralId(String id) {
    log.info("Deleting overall water meter with lateral ID: {}", id);
    if (overallWaterMeterRepository.existsByLateralId(id)) {
      overallWaterMeterRepository.deleteByLateralId(id);
    }
  }

  @Override
  public Page<OverallWaterMeterResponse> getAllOverallWaterMeters(Pageable pageable, String keyword) {
    log.info("Fetching all overall water meters with keyword: {} and pagination: {}", keyword, pageable);
    var response = (keyword != null && !keyword.isBlank()) ?
      overallWaterMeterRepository.findByNameContainingIgnoreCase(keyword, pageable)
    : overallWaterMeterRepository.findAll(pageable);

    return response.map(this::mapToOverallWaterMeterResponse);
  }

  private @NonNull WaterMeterResponse mapToResponse(@NonNull WaterMeter meter) {
    return new WaterMeterResponse(
      meter.getId(),
      meter.getInstallationDate(),
      meter.getSize(),
      meter.getType() != null ? meter.getType().getName() : null);
  }

  private @NonNull OverallWaterMeterResponse mapToOverallWaterMeterResponse(@NonNull OverallWaterMeter meter) {
    return new OverallWaterMeterResponse(
      meter.getSerial(),
      meter.getName(),
      meter.getLateralId()
    );
  }
}
