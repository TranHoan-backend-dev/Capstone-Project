package com.capstone.device.application.business.metertype;

import com.capstone.common.annotation.AppLog;
import com.capstone.common.exception.ExistingException;
import com.capstone.device.application.dto.request.metertype.CreateRequest;
import com.capstone.device.application.dto.request.metertype.SearchWaterMeterTypeRequest;
import com.capstone.device.application.dto.request.metertype.UpdateRequest;
import com.capstone.device.application.dto.response.PageResponse;
import com.capstone.device.application.dto.response.WaterMeterTypeResponse;
import com.capstone.device.domain.model.WaterMeterType;
import com.capstone.device.infrastructure.persistence.WaterMeterRepository;
import com.capstone.device.infrastructure.persistence.WaterMeterTypeRepository;
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
public class MeterTypeServiceImpl implements MeterTypeService {
  WaterMeterTypeRepository waterMeterTypeRepository;
  WaterMeterRepository waterMeterRepository;

  @NonFinal
  Logger log;

  @Override
  @Transactional(rollbackFor = Exception.class)
  public WaterMeterTypeResponse createMeterType(@NonNull CreateRequest request) {
    log.info("Creating new water meter type: {}", request.name());
    if (waterMeterTypeRepository.existsByNameIgnoreCase(request.name())) {
      throw new IllegalArgumentException("Water meter type with name " + request.name() + " already exists");
    }

    var meterType = WaterMeterType.create(builder -> builder
      .name(request.name())
      .origin(request.origin())
      .meterModel(request.meterModel())
      .size(request.size())
      .maxIndex(request.maxIndex())
      .qn(request.qn())
      .qt(request.qt())
      .qmin(request.qmin())
      .diameter(request.diameter()));

    var response = waterMeterTypeRepository.save(meterType);
    return mapToResponse(response);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public WaterMeterTypeResponse updateMeterType(String id, @NonNull UpdateRequest request) {
    log.info("Updating water meter type with id: {}", id);
    var meterType = waterMeterTypeRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Water meter type not found with id: " + id));

    if (request.name() != null && !request.name().isBlank()) {
      meterType.setName(request.name());
    }
    if (request.origin() != null && !request.origin().isBlank()) {
      meterType.setOrigin(request.origin());
    }
    if (request.meterModel() != null && !request.meterModel().isBlank()) {
      meterType.setMeterModel(request.meterModel());
    }
    if (request.size() != null) {
      meterType.setSize(request.size());
    }
    if (request.maxIndex() != null && !request.maxIndex().isBlank()) {
      meterType.setMaxIndex(request.maxIndex());
    }
    if (request.qn() != null && !request.qn().isBlank()) {
      meterType.setQn(request.qn());
    }
    if (request.qt() != null && !request.qt().isBlank()) {
      meterType.setQt(request.qt());
    }
    if (request.qmin() != null && !request.qmin().isBlank()) {
      meterType.setQmin(request.qmin());
    }
    if (request.diameter() != null) {
      meterType.setDiameter(request.diameter());
    }

    var saved = waterMeterTypeRepository.save(meterType);
    return mapToResponse(saved);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void deleteMeterType(String id) {
    log.info("Deleting water meter type with id: {}", id);
    if (!waterMeterTypeRepository.existsById(id)) {
      throw new IllegalArgumentException("Water meter type not found with id: " + id);
    }
    if (waterMeterRepository.existsByType_TypeId((id))) {
      throw new ExistingException("Water meter type with id: " + id + " has water meters that are in use");
    }
    waterMeterTypeRepository.deleteById(id);
  }

  @Override
  public WaterMeterTypeResponse getMeterTypeById(String id) {
    log.info("Fetching water meter type with id: {}", id);
    return waterMeterTypeRepository.findById(id)
      .map(this::mapToResponse)
      .orElseThrow(() -> new IllegalArgumentException("Water meter type not found with id: " + id));
  }

  @Override
  public PageResponse<WaterMeterTypeResponse> getAllMeterTypes(Pageable pageable) {
    log.info("Fetching all water meter types with pageable: {}", pageable);
    var page = waterMeterTypeRepository.findAll(pageable);
    return PageResponse.fromPage(page, this::mapToResponse);
  }

  @Override
  public PageResponse<WaterMeterTypeResponse> searchMeterTypes(SearchWaterMeterTypeRequest request, Pageable pageable) {
    log.info("Searching water meter types with request: {}", request);
    var page = waterMeterTypeRepository.searchMeterTypes(request, pageable);
    return PageResponse.fromPage(page, this::mapToResponse);
  }

  private @NonNull WaterMeterTypeResponse mapToResponse(@NonNull WaterMeterType meterType) {
    return new WaterMeterTypeResponse(
      meterType.getTypeId(),
      meterType.getName(),
      meterType.getOrigin(),
      meterType.getMeterModel(),
      meterType.getSize(),
      meterType.getMaxIndex(),
      meterType.getQn(),
      meterType.getQt(),
      meterType.getQmin(),
      meterType.getDiameter(),
      meterType.getCreatedAt(),
      meterType.getUpdatedAt());
  }
}
