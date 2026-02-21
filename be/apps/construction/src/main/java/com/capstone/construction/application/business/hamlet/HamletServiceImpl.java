package com.capstone.construction.application.business.hamlet;

import com.capstone.common.annotation.AppLog;
import com.capstone.construction.application.dto.request.hamlet.UpdateHamletRequest;
import com.capstone.construction.application.dto.response.catalog.HamletResponse;
import com.capstone.construction.application.dto.response.PageResponse;
import com.capstone.construction.domain.enumerate.HamletType;
import com.capstone.construction.domain.model.Hamlet;
import com.capstone.construction.infrastructure.persistence.HamletRepository;
import com.capstone.construction.infrastructure.persistence.CommuneRepository;
import com.capstone.construction.application.exception.ExistingItemException;
import com.capstone.construction.infrastructure.config.Constant;
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
public class HamletServiceImpl implements HamletService {
  HamletRepository hamletRepository;
  CommuneRepository communeRepository;
  @NonFinal
  Logger log;

  @Override
  @Transactional(rollbackFor = Exception.class)
  public HamletResponse createHamlet(String name, HamletType type, String communeId) {
    log.info("Creating new hamlet with name: {}", name);
    if (hamletRepository.existsByNameIgnoreCase(name)) {
      throw new ExistingItemException("Hamlet with name " + name + " already exists");
    }

    var commune = communeRepository.findById(communeId)
      .orElseThrow(() -> new IllegalArgumentException(Constant.SE_04));

    var hamlet = Hamlet.create(builder -> builder
      .name(name)
      .type(type)
      .commune(commune));

    var saved = hamletRepository.save(hamlet);
    return mapToResponse(saved);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public HamletResponse updateHamlet(String id, @NonNull UpdateHamletRequest request) {
    log.info("Updating hamlet with id: {}", id);
    var hamlet = hamletRepository.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Hamlet not found with id: " + id));

    if (!hamlet.getName().equalsIgnoreCase(request.name()) && hamletRepository.existsByNameIgnoreCase(request.name())) {
      throw new ExistingItemException("Hamlet with name " + request.name() + " already exists");
    }

    var commune = communeRepository.findById(request.communeId())
      .orElseThrow(() -> new IllegalArgumentException(Constant.SE_04));

    if (request.name() != null && !request.name().isBlank()) {
      hamlet.setName(request.name());
    }
    if (request.type() != null && !request.type().isBlank()) {
      hamlet.setType(HamletType.valueOf(request.type()));
    }
    if (!request.communeId().isBlank()) {
      hamlet.setCommune(commune);
    }

    var saved = hamletRepository.save(hamlet);
    return mapToResponse(saved);
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public void deleteHamlet(String id) {
    log.info("Deleting hamlet with id: {}", id);
    if (!hamletRepository.existsById(id)) {
      throw new IllegalArgumentException("Hamlet not found with id: " + id);
    }
    hamletRepository.deleteById(id);
  }

  @Override
  public HamletResponse getHamletById(String id) {
    log.info("Fetching hamlet with id: {}", id);
    return hamletRepository.findById(id)
      .map(this::mapToResponse)
      .orElseThrow(() -> new IllegalArgumentException("Hamlet not found with id: " + id));
  }

  @Override
  public PageResponse<HamletResponse> getAllHamlets(Pageable pageable) {
    log.info("Fetching all hamlets with pageable: {}", pageable);
    var page = hamletRepository.findAll(pageable);
    return PageResponse.fromPage(page, this::mapToResponse);
  }

  private @NonNull HamletResponse mapToResponse(@NonNull Hamlet hamlet) {
    return new HamletResponse(
      hamlet.getHamletId(),
      hamlet.getName(),
      hamlet.getType().toString().toLowerCase(),
      hamlet.getCommune().getCommuneId(),
      hamlet.getCommune().getName(),
      hamlet.getCreatedAt());
  }
}
